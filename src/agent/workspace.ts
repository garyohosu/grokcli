import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

const WORKSPACE_DIR = path.join(os.homedir(), '.grok_agent');

const STATIC_FILES = ['Agents.md', 'interview.md'];
const AUTO_FILES = [
  'planner.md',
  'executor.md',
  'reviewer.md',
  'result.md',
  'final_report.md',
  'meta.json'
];

interface MetaInfo {
  goal_hash: string;
  loop_count: number;
  timestamp: string;
}

/**
 * Ensure workspace directory exists
 */
async function ensureWorkspace(): Promise<void> {
  try {
    await fs.mkdir(WORKSPACE_DIR, { recursive: true });
  } catch (error) {
    // Ignore if already exists
  }
}

/**
 * Calculate SHA-256 hash of content
 */
function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Load meta.json from workspace
 */
async function loadMeta(): Promise<MetaInfo> {
  const metaPath = path.join(WORKSPACE_DIR, 'meta.json');

  try {
    const content = await fs.readFile(metaPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Ensure all fields exist with defaults
    return {
      goal_hash: parsed.goal_hash || '',
      loop_count: parsed.loop_count || 0,
      timestamp: parsed.timestamp || new Date().toISOString()
    };
  } catch (error) {
    // Return default if file doesn't exist or is invalid
    return {
      goal_hash: '',
      loop_count: 0,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Save meta.json to workspace
 */
async function saveMeta(meta: MetaInfo): Promise<void> {
  const metaPath = path.join(WORKSPACE_DIR, 'meta.json');
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
}

/**
 * Delete all auto-generated files
 */
async function clearAutoFiles(): Promise<void> {
  const filesToDelete = [...AUTO_FILES, 'goal.md'];

  for (const file of filesToDelete) {
    const filePath = path.join(WORKSPACE_DIR, file);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore errors for missing files
    }
  }
}

/**
 * Load goal.md content
 */
async function loadGoal(): Promise<string | null> {
  const goalPath = path.join(WORKSPACE_DIR, 'goal.md');

  try {
    return await fs.readFile(goalPath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Generate goal.md from interview.md template
 * Note: This is a placeholder that should integrate with the LLM
 */
async function generateGoalFromInterview(): Promise<void> {
  const interviewTemplatePath = path.join(process.cwd(), 'Spec', 'interview.md');
  const goalPath = path.join(WORKSPACE_DIR, 'goal.md');

  try {
    // Load interview template
    const interviewTemplate = await fs.readFile(interviewTemplatePath, 'utf-8');

    // TODO: This should call the LLM with the interview template
    // For now, create a placeholder goal
    const placeholderGoal = `# Goal Definition

## Output Language
(User language detected as: English)

## User Goal
This is a placeholder goal. The actual goal should be generated through the interview process with the LLM.

## Requirements
- Complete the interview process
- Generate a proper goal

## Output Format
A complete final report based on the interview results.
`;

    await fs.writeFile(goalPath, placeholderGoal, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to generate goal from interview: ${error}`);
  }
}

/**
 * Handle goal change detection and cleanup
 */
async function handleGoalChangeIfNeeded(): Promise<void> {
  const goalContent = await loadGoal();

  if (!goalContent) {
    // No goal exists, generate one
    await generateGoalFromInterview();

    // Create new meta
    const newMeta: MetaInfo = {
      goal_hash: hashContent(await loadGoal() || ''),
      loop_count: 0,
      timestamp: new Date().toISOString()
    };
    await saveMeta(newMeta);
    return;
  }

  // Load existing meta
  const meta = await loadMeta();
  const currentHash = hashContent(goalContent);

  // Check if goal changed
  if (currentHash !== meta.goal_hash) {
    // Goal changed - reset everything
    await clearAutoFiles();
    await generateGoalFromInterview();

    // Reset meta
    const newMeta: MetaInfo = {
      goal_hash: hashContent(await loadGoal() || ''),
      loop_count: 0,
      timestamp: new Date().toISOString()
    };
    await saveMeta(newMeta);
  }
}

/**
 * Load Agents.md specification
 */
async function loadAgentsSpec(): Promise<string> {
  const agentsPath = path.join(process.cwd(), 'Spec', 'Agents.md');

  try {
    return await fs.readFile(agentsPath, 'utf-8');
  } catch (error) {
    // Fallback to workspace if not in Spec
    const workspaceAgentsPath = path.join(WORKSPACE_DIR, 'Agents.md');
    return await fs.readFile(workspaceAgentsPath, 'utf-8');
  }
}

/**
 * Prepare Agent Mode execution
 */
async function prepareAgentMode(): Promise<{
  workspacePath: string;
  goalPath: string;
  agentsSpec: string;
  meta: MetaInfo;
}> {
  // 1. Ensure workspace exists
  await ensureWorkspace();

  // 2. Handle goal change detection
  await handleGoalChangeIfNeeded();

  // 3. Load Agents.md
  const agentsSpec = await loadAgentsSpec();

  // 4. Load meta
  const meta = await loadMeta();

  // 5. Return prepared context
  return {
    workspacePath: WORKSPACE_DIR,
    goalPath: path.join(WORKSPACE_DIR, 'goal.md'),
    agentsSpec,
    meta
  };
}

/**
 * Get path to file in workspace
 */
function getPath(filename: string): string {
  return path.join(WORKSPACE_DIR, filename);
}

/**
 * Read file from workspace
 */
async function readFile(filename: string): Promise<string | null> {
  const filePath = getPath(filename);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Write file to workspace
 */
async function writeFile(filename: string, content: string): Promise<void> {
  const filePath = getPath(filename);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Delete file from workspace
 */
async function deleteFile(filename: string): Promise<void> {
  const filePath = getPath(filename);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore errors for missing files
  }
}

/**
 * Cleanup generated files (alias for clearAutoFiles)
 */
async function cleanupGeneratedFiles(): Promise<void> {
  const generatedFiles = [
    'planner.md',
    'executor.md',
    'reviewer.md',
    'result.md',
    'final_report.md'
  ];

  for (const file of generatedFiles) {
    await deleteFile(file);
  }
}

/**
 * Hash goal content
 */
function hashGoal(content: string): string {
  return hashContent(content);
}

/**
 * Check if workspace should be reset based on goal change
 */
async function shouldResetWorkspace(newGoal: string): Promise<boolean> {
  const meta = await loadMeta();
  const newHash = hashGoal(newGoal);
  return newHash !== meta.goal_hash;
}

export {
  ensureWorkspace,
  getPath,
  readFile,
  writeFile,
  deleteFile,
  cleanupGeneratedFiles,
  hashGoal,
  loadMeta,
  saveMeta,
  clearAutoFiles,
  shouldResetWorkspace,
  prepareAgentMode,
  WORKSPACE_DIR
};
