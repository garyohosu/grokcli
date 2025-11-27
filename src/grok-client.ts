import axios, { AxiosInstance } from 'axios';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import { webSearch } from './tools/searchApi';

const execAsync = promisify(exec);

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface GrokMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

interface GrokChatRequest {
  messages: GrokMessage[];
  model: string;
  stream?: boolean;
  temperature?: number;
  tools?: Tool[];
  tool_choice?: 'auto' | 'none' | 'required';
}

interface GrokChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GrokMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function getOSType(): 'windows' | 'linux' | 'darwin' {
  const platform = os.platform();
  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'darwin';
  return 'linux';
}

function getShellTools(): Tool[] {
  const osType = getOSType();
  const exampleCommand = osType === 'windows' ? 'dir' : 'ls -la';

  return [
    {
      type: 'function',
      function: {
        name: 'execute_shell_command',
        description: `Execute a shell command on the ${osType} system. Use appropriate commands for ${osType}. ${osType === 'windows' ? 'Windows commands: dir, echo, type, etc.' : 'Unix commands: ls, cat, grep, etc.'}`,
        parameters: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: `The shell command to execute. Must be appropriate for ${osType}. Example: ${exampleCommand}`,
            },
            reason: {
              type: 'string',
              description: 'Brief explanation of why this command needs to be executed',
            },
          },
          required: ['command', 'reason'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'webSearch',
        description: 'Perform a web search using SerpAPI to find up-to-date information from the internet',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to execute',
            },
          },
          required: ['query'],
        },
      },
    },
  ];
}

async function executeShellCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command);
    let result = '';

    if (stdout) {
      result += `Output:\n${stdout}`;
    }
    if (stderr) {
      result += `\n\nWarnings/Errors:\n${stderr}`;
    }

    return result || 'Command executed successfully with no output.';
  } catch (error: any) {
    let errorMsg = `Error executing command: ${error.message}`;
    if (error.stdout) errorMsg += `\n\nOutput:\n${error.stdout}`;
    if (error.stderr) errorMsg += `\n\nError details:\n${error.stderr}`;
    return errorMsg;
  }
}

export class GrokClient {
  private client: AxiosInstance;
  private conversationHistory: GrokMessage[] = [];
  private tools: Tool[];
  private currentModel: string = 'grok-2-1212';

  // Available models and their aliases
  private static readonly MODEL_ALIASES: Record<string, string> = {
    // Fast reasoning models
    'grok-4.1-fast-reasoning': 'grok-4-1-fast-reasoning',
    'grok-4.1-fast': 'grok-4-1-fast-reasoning',
    '4.1-fast': 'grok-4-1-fast-reasoning',
    'fast': 'grok-4-1-fast-reasoning',

    // Fast non-reasoning models
    'grok-4.1-fast-nr': 'grok-4-1-fast-non-reasoning',
    '4.1-fast-nr': 'grok-4-1-fast-non-reasoning',

    // Grok 4 Fast models
    'grok-4-fast-r': 'grok-4-fast-reasoning',
    '4-fast-r': 'grok-4-fast-reasoning',
    'grok-4-fast-nr': 'grok-4-fast-non-reasoning',
    '4-fast-nr': 'grok-4-fast-non-reasoning',

    // Main models
    'grok-4': 'grok-4',
    '4': 'grok-4',
    'grok-3': 'grok-3',
    '3': 'grok-3',
    'grok-3-mini': 'grok-3-mini',
    '3-mini': 'grok-3-mini',
    'mini': 'grok-3-mini',
    'grok-2': 'grok-2-1212',
    '2': 'grok-2-1212',

    // Code model
    'code': 'grok-code-fast-1',
    'grok-code': 'grok-code-fast-1',

    // Vision and image models
    'vision': 'grok-2-vision-1212',
    'grok-vision': 'grok-2-vision-1212',
    'image': 'grok-2-image-1212',
    'grok-image': 'grok-2-image-1212',
  };

  private static readonly AVAILABLE_MODELS = [
    'grok-4-1-fast-reasoning',
    'grok-4-1-fast-non-reasoning',
    'grok-4-fast-reasoning',
    'grok-4-fast-non-reasoning',
    'grok-code-fast-1',
    'grok-4',
    'grok-3',
    'grok-3-mini',
    'grok-2-vision-1212',
    'grok-2-image-1212',
    'grok-2-1212',
  ];

  constructor(apiKey: string, baseURL: string = 'https://api.x.ai/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    this.tools = getShellTools();
  }

  async chat(message: string): Promise<string> {
    const spinner = ora('Thinking...').start();

    try {
      this.conversationHistory.push({
        role: 'user',
        content: message,
      });

      let iterations = 0;
      const maxIterations = 10; // Prevent infinite loops

      while (iterations < maxIterations) {
        iterations++;

        const request: GrokChatRequest = {
          messages: this.conversationHistory,
          model: this.currentModel,
          stream: false,
          temperature: 0.7,
          tools: this.tools,
          tool_choice: 'auto',
        };

        const response = await this.client.post<GrokChatResponse>('/chat/completions', request);
        const assistantMessage = response.data.choices[0].message;

        // Add assistant message to history
        this.conversationHistory.push(assistantMessage);

        // Check if there are tool calls
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
          spinner.text = 'Executing commands...';

          // Execute each tool call
          for (const toolCall of assistantMessage.tool_calls) {
            if (toolCall.function.name === 'execute_shell_command') {
              const args = JSON.parse(toolCall.function.arguments);
              const osType = getOSType();

              spinner.text = `Executing: ${args.command} (${args.reason})`;

              const result = await executeShellCommand(args.command);

              // Add tool response to conversation
              this.conversationHistory.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: result,
              });
            } else if (toolCall.function.name === 'webSearch') {
              const args = JSON.parse(toolCall.function.arguments);

              spinner.text = `Searching: ${args.query}`;

              try {
                const result = await webSearch(args);

                // Add tool response to conversation
                this.conversationHistory.push({
                  role: 'tool',
                  tool_call_id: toolCall.id,
                  name: toolCall.function.name,
                  content: JSON.stringify(result),
                });
              } catch (error: any) {
                // Add error response to conversation
                this.conversationHistory.push({
                  role: 'tool',
                  tool_call_id: toolCall.id,
                  name: toolCall.function.name,
                  content: `Error: ${error.message}`,
                });
              }
            }
          }

          // Continue the loop to get the next response
          continue;
        }

        // No tool calls, return the final response
        spinner.succeed('Done');
        return assistantMessage.content || 'No response from Grok.';
      }

      spinner.warn('Max iterations reached');
      return 'Conversation reached maximum iterations.';
    } catch (error) {
      spinner.fail('Error');
      if (axios.isAxiosError(error)) {
        throw new Error(`Grok API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): GrokMessage[] {
    return [...this.conversationHistory];
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  setModel(modelNameOrAlias: string): { success: boolean; model?: string; error?: string } {
    const normalizedInput = modelNameOrAlias.toLowerCase().trim();

    // Check if it's an alias
    const resolvedModel = GrokClient.MODEL_ALIASES[normalizedInput];
    if (resolvedModel) {
      this.currentModel = resolvedModel;
      return { success: true, model: resolvedModel };
    }

    // Check if it's a valid model name directly
    if (GrokClient.AVAILABLE_MODELS.includes(modelNameOrAlias)) {
      this.currentModel = modelNameOrAlias;
      return { success: true, model: modelNameOrAlias };
    }

    return {
      success: false,
      error: `Unknown model: ${modelNameOrAlias}`,
    };
  }

  static getAvailableModels(): string[] {
    return [...GrokClient.AVAILABLE_MODELS];
  }

  static getModelAliases(): Record<string, string> {
    return { ...GrokClient.MODEL_ALIASES };
  }
}
