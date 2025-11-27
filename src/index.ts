#!/usr/bin/env node

import chalk from 'chalk';
import * as readline from 'readline';
import { GrokClient } from './grok-client';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

dotenv.config();

const OPENING_MESSAGE = `
${chalk.cyan('╔══════════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')} ${chalk.bold('Grok CLI')} ${chalk.gray('- Interactive AI assistant in your terminal')}   ${chalk.cyan('║')}
${chalk.cyan('║')}                                                              ${chalk.cyan('║')}
${chalk.cyan('║')} ${chalk.dim('Powered by Grok')}                                            ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════════════╝')}

Available commands:
  ${chalk.cyan('/help')}     Show available commands
  ${chalk.cyan('/clear')}    Clear conversation history
  ${chalk.cyan('/exit')}     Exit the application
  ${chalk.cyan('/version')}  Show version information
  ${chalk.cyan('/exec')}     Execute shell command

Just type your message to chat with Grok AI
`;

function showHelp() {
  console.log(`
${chalk.bold('Grok CLI Commands:')}

  ${chalk.cyan('/help')}           Show this help message
  ${chalk.cyan('/clear')}          Clear the conversation history
  ${chalk.cyan('/exit')}           Exit the application
  ${chalk.cyan('/version')}        Show version information
  ${chalk.cyan('/exec <command>')} Execute shell command

${chalk.dim('Just type your message to chat with Grok AI')}
`);
}

function showVersion() {
  console.log(`
${chalk.bold('Grok CLI')} version ${chalk.cyan('1.0.0')}
Powered by Grok API
`);
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
