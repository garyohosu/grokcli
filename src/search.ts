import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

interface DuckDuckGoResult {
  Heading: string;
  AbstractText: string;
  AbstractURL: string;
  RelatedTopics: Array<{
    Text?: string;
    FirstURL?: string;
  }>;
}

/**
 * Search DuckDuckGo with a query
 * @param query - The search query
 * @param silent - If true, don't show spinner (for function calling)
 * @returns Formatted search results
 */
export async function search(query: string, silent: boolean = false): Promise<string> {
  const spinner = silent ? null : ora('Searching DuckDuckGo...').start();

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

    const response = await axios.get<DuckDuckGoResult>(url);
    const data = response.data;

    if (spinner) {
      spinner.succeed('Search completed');
    }

    // Build the formatted result
    let result = '\n';

    // Title/Heading
    const title = data.Heading || 'No title available';
    result += chalk.bold.cyan(`${title}\n`);
    result += chalk.dim('─'.repeat(60)) + '\n\n';

    // Summary/Abstract
    const summary = data.AbstractText || 'No summary available.';
    result += chalk.white(summary) + '\n\n';

    // URL
    const urlInfo = data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    result += chalk.blue.underline(`🔗 ${urlInfo}`) + '\n';

    // Related Topics
    if (Array.isArray(data.RelatedTopics) && data.RelatedTopics.length > 0) {
      const relatedItems = data.RelatedTopics
        .filter(topic => topic && topic.Text)
        .slice(0, 5); // Show up to 5 related topics

      if (relatedItems.length > 0) {
        result += '\n' + chalk.bold('Related Topics:') + '\n';
        relatedItems.forEach((topic, index) => {
          result += chalk.dim(`  ${index + 1}.`) + ` ${topic.Text}\n`;
          if (topic.FirstURL) {
            result += chalk.dim(`     ${topic.FirstURL}`) + '\n';
          }
        });
      }
    }

    result += '\n';
    return result;

  } catch (error) {
    if (spinner) {
      spinner.fail('Search failed');
    }

    if (axios.isAxiosError(error)) {
      throw new Error(`DuckDuckGo API error: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}
