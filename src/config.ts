import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

/**
 * Configuration priority:
 * 1. ~/.grokcli/.env (global config directory)
 * 2. ./project/.env (fallback to local project directory)
 *
 * This allows grokcli to run from any directory with a centralized config.
 */
export function loadConfig(): void {
  // Try to load from global config directory first
  const homeDir = os.homedir();
  const globalConfigDir = path.join(homeDir, '.grokcli');
  const globalEnvPath = path.join(globalConfigDir, '.env');

  if (fs.existsSync(globalEnvPath)) {
    console.log(`Loading config from: ${globalEnvPath}`);
    dotenv.config({ path: globalEnvPath });
    return;
  }

  // Fallback to local .env file
  const localEnvPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(localEnvPath)) {
    console.log(`Loading config from: ${localEnvPath}`);
    dotenv.config({ path: localEnvPath });
    return;
  }

  // No config file found - will rely on environment variables
  dotenv.config();
}
