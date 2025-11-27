import axios, { AxiosInstance } from 'axios';
import ora from 'ora';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokChatRequest {
  messages: GrokMessage[];
  model: string;
  stream?: boolean;
  temperature?: number;
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

export class GrokClient {
  private client: AxiosInstance;
  private conversationHistory: GrokMessage[] = [];

  constructor(apiKey: string, baseURL: string = 'https://api.x.ai/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async chat(message: string, model: string = 'grok-2-1212'): Promise<string> {
    const spinner = ora('Thinking...').start();

    try {
      this.conversationHistory.push({
        role: 'user',
        content: message,
      });

      const request: GrokChatRequest = {
        messages: this.conversationHistory,
        model,
        stream: false,
        temperature: 0.7,
      };

      const response = await this.client.post<GrokChatResponse>('/chat/completions', request);

      const assistantMessage = response.data.choices[0].message;
      this.conversationHistory.push(assistantMessage);

      spinner.succeed('Done');
      return assistantMessage.content;
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
}
