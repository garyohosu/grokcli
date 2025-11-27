#!/usr/bin/env node

import chalk from 'chalk';
import * as readline from 'readline';
import { GrokClient } from './grok-client';
import { exec } from 'child_process';
import { promisify } from 'util';
import { webSearch } from './tools/searchApi';
import { loadConfig } from './config';

const execAsync = promisify(exec);

// Load configuration from global config directory or local .env
loadConfig();

const OPENING_MESSAGE = `
${chalk.cyan('╔══════════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')} ${chalk.bold('Grok CLI')} ${chalk.gray('- Interactive AI assistant in your terminal')}         ${chalk.cyan('║')}
${chalk.cyan('║')}                                                              ${chalk.cyan('║')}
${chalk.cyan('║')} ${chalk.dim('Powered by Grok')}                                              ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════════════╝')}

Available commands:
  ${chalk.cyan('/help')}     Show available commands
  ${chalk.cyan('/clear')}    Clear conversation history
  ${chalk.cyan('/model')}    View or change AI model
  ${chalk.cyan('/search')}   Search the web
  ${chalk.cyan('/exit')}     Exit the application
  ${chalk.cyan('/version')}  Show version information
  ${chalk.cyan('/exec')}     Execute shell command

Just type your message to chat with Grok AI
`;

function showHelp() {
  console.log(`
${chalk.bold('Grok CLI Commands:')}

  ${chalk.cyan('/help')}            Show this help message
  ${chalk.cyan('/clear')}           Clear the conversation history
  ${chalk.cyan('/model')}           View current model
  ${chalk.cyan('/model <name>')}    Change to a different model
  ${chalk.cyan('/model list')}      List all available models
  ${chalk.cyan('/search <query>')}  Search the web using SerpAPI
  ${chalk.cyan('/exit')}            Exit the application
  ${chalk.cyan('/version')}         Show version information
  ${chalk.cyan('/exec <command>')}  Execute shell command

${chalk.dim('Just type your message to chat with Grok AI')}
`);
}

function showVersion() {
  console.log(`
${chalk.bold('Grok CLI')} version ${chalk.cyan('1.0.0')}
Powered by Grok API
`);
}

function showCurrentModel(grokClient: GrokClient) {
  const currentModel = grokClient.getCurrentModel();
  console.log(`\n${chalk.bold('Current Model:')} ${chalk.cyan(currentModel)}\n`);
}

function listAvailableModels() {
  const models = GrokClient.getAvailableModels();
  const aliases = GrokClient.getModelAliases();

  console.log(`\n${chalk.bold('Available Models:')}\n`);

  models.forEach(model => {
    const modelAliases = Object.entries(aliases)
      .filter(([_, value]) => value === model)
      .map(([key]) => key);

    const uniqueAliases = [...new Set(modelAliases)].filter(alias => alias !== model);

    if (uniqueAliases.length > 0) {
      console.log(`  ${chalk.cyan(model)} ${chalk.dim('(aliases: ' + uniqueAliases.slice(0, 3).join(', ') + ')')}`);
    } else {
      console.log(`  ${chalk.cyan(model)}`);
    }
  });

  console.log(`\n${chalk.dim('Popular aliases:')}`);
  console.log(`  ${chalk.cyan('fast')}     - Latest fast reasoning model (4.1)`);
  console.log(`  ${chalk.cyan('4')}        - Grok 4`);
  console.log(`  ${chalk.cyan('3')}        - Grok 3`);
  console.log(`  ${chalk.cyan('mini')}     - Grok 3 Mini (smaller, faster)`);
  console.log(`  ${chalk.cyan('code')}     - Code-specialized model`);
  console.log(`  ${chalk.cyan('vision')}   - Vision model`);
  console.log(`  ${chalk.cyan('image')}    - Image generation model\n`);
}

function changeModel(grokClient: GrokClient, modelName: string) {
  const result = grokClient.setModel(modelName);

  if (result.success) {
    console.log(`\n${chalk.green('✓')} Model changed to: ${chalk.cyan(result.model)}\n`);
  } else {
    console.log(`\n${chalk.red('✗')} ${result.error}`);
    console.log(`${chalk.dim('Use')} ${chalk.cyan('/model list')} ${chalk.dim('to see available models\n')}`);
  }
}

async function handleCommand(command: string, grokClient: GrokClient): Promise<boolean> {
  const cmd = command.toLowerCase();

  // Handle /exec command separately as it needs the full command string
  if (command.startsWith('/exec ')) {
    const shellCommand = command.substring(6).trim();
    if (!shellCommand) {
      console.log(chalk.yellow('\nPlease provide a command to execute'));
      console.log(chalk.dim('Usage: /exec <command>\n'));
      return true;
    }

    try {
      console.log(chalk.dim(`\nExecuting: ${shellCommand}\n`));
      const { stdout, stderr } = await execAsync(shellCommand);

      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error(chalk.yellow(stderr));
      }
      console.log(chalk.dim('Command completed.\n'));
    } catch (error: any) {
      console.error(chalk.red('Error executing command:'), error.message);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(chalk.yellow(error.stderr));
    }
    return true;
  }

  // Handle /search command separately as it needs the full query string
  if (command.startsWith('/search ')) {
    const query = command.substring(8).trim();
    if (!query) {
      console.log(chalk.yellow('\nPlease provide a search query'));
      console.log(chalk.dim('Usage: /search <query>\n'));
      return true;
    }

    try {
      console.log(chalk.dim(`\nSearching for: ${query}\n`));
      const result = await webSearch({ query });

      console.log(chalk.bold(`Search results for: ${chalk.cyan(query)}\n`));

      if (result.results.length === 0) {
        console.log(chalk.yellow('No results found.\n'));
      } else {
        result.results.forEach((r, index) => {
          console.log(chalk.bold(`${index + 1}. ${r.title}`));
          console.log(chalk.blue(`   ${r.url}`));
          console.log(chalk.dim(`   ${r.snippet}`));
          console.log('');
        });
      }
    } catch (error: any) {
      console.error(chalk.red('Search error:'), error.message);
      if (error.message.includes('Missing SERPAPI_KEY')) {
        console.log(chalk.yellow('\nPlease set your SerpAPI key:'));
        console.log(chalk.dim('  Add SERPAPI_KEY=your_api_key to your .env file\n'));
      }
    }
    return true;
  }

  // Handle /model command separately as it needs the full command string
  if (command.startsWith('/model ')) {
    const modelArg = command.substring(7).trim();

    if (modelArg.toLowerCase() === 'list') {
      listAvailableModels();
    } else {
      changeModel(grokClient, modelArg);
    }
    return true;
  }

  switch (cmd) {
    case '/help':
    case '/h':
      showHelp();
      return true;

    case '/clear':
    case '/c':
      grokClient.clearHistory();
      console.log(chalk.dim('\nConversation history cleared.\n'));
      return true;

    case '/model':
    case '/m':
      showCurrentModel(grokClient);
      return true;

    case '/exit':
    case '/quit':
    case '/q':
      console.log(chalk.dim('\nGoodbye!\n'));
      process.exit(0);

    case '/version':
    case '/v':
      showVersion();
      return true;

    case '/exec':
      console.log(chalk.yellow('\nPlease provide a command to execute'));
      console.log(chalk.dim('Usage: /exec <command>\n'));
      return true;

    case '/search':
    case '/s':
      console.log(chalk.yellow('\nPlease provide a search query'));
      console.log(chalk.dim('Usage: /search <query>\n'));
      return true;

    default:
      if (cmd.startsWith('/')) {
        console.log(chalk.yellow(`\nUnknown command: ${command}`));
        console.log(chalk.dim('Type /help to see available commands\n'));
        return true;
      }
      return false;
  }
}

async function startInteractiveMode() {
  console.log(OPENING_MESSAGE);

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    console.error(chalk.red('\nError: GROK_API_KEY not found in environment variables'));
    console.log(chalk.yellow('Please set your API key:'));
    console.log(chalk.dim('  export GROK_API_KEY=your_api_key'));
    console.log(chalk.dim('  or create a .env file with GROK_API_KEY=your_api_key\n'));
    process.exit(1);
  }

  const grokClient = new GrokClient(apiKey);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.blue('\n> ')
  });

  rl.prompt();

  rl.on('line', async (line: string) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    // Handle commands
    const isCommand = await handleCommand(input, grokClient);
    if (isCommand) {
      rl.prompt();
      return;
    }

    // Handle regular chat
    console.log(''); // Empty line for spacing
    try {
      const response = await grokClient.chat(input);
      console.log(chalk.white(response));
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.dim('\nGoodbye!\n'));
    process.exit(0);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log(chalk.dim('\n\nGoodbye!\n'));
    process.exit(0);
  });
}

// Start interactive mode directly
startInteractiveMode();
