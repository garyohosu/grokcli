import * as fs from 'fs/promises';
import * as path from 'path';
import { GrokClient } from '../grok-client';
import { loadMeta, saveMeta } from './workspace';

interface MetaInfo {
  goal_hash: string;
  loop_count: number;
  timestamp: string;
}

interface WorkspaceInfo {
  workspacePath: string;
  goalPath: string;
  agentsSpec: string;
  meta: MetaInfo;
}

interface AgentSpecs {
  planner: string;
  executor: string;
  reviewer: string;
  updater: string;
  finalAgent: string;
}

interface AgentLoopResult {
  status: 'done' | 'incomplete';
  loops: number;
}

/**
 * Parse Agents.md into structured agent specifications
 */
function parseAgentsSpec(agentsContent: string): AgentSpecs {
  const sections: AgentSpecs = {
    planner: '',
    executor: '',
    reviewer: '',
    updater: '',
    finalAgent: ''
  };

  // Split by markdown headers
  const lines = agentsContent.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check for section headers
    if (line.startsWith('# Planner Agent') || line.startsWith('## Planner Agent')) {
      if (currentSection) {
        sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
      }
      currentSection = 'planner';
      currentContent = [];
    } else if (line.startsWith('# Executor Agent') || line.startsWith('## Executor Agent')) {
      if (currentSection) {
        sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
      }
      currentSection = 'executor';
      currentContent = [];
    } else if (line.startsWith('# Reviewer Agent') || line.startsWith('## Reviewer Agent')) {
      if (currentSection) {
        sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
      }
      currentSection = 'reviewer';
      currentContent = [];
    } else if (line.startsWith('# Updater Agent') || line.startsWith('## Updater Agent')) {
      if (currentSection) {
        sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
      }
      currentSection = 'updater';
      currentContent = [];
    } else if (line.startsWith('# Final Agent') || line.startsWith('## Final Agent')) {
      if (currentSection) {
        sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
      }
      currentSection = 'finalAgent';
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection as keyof AgentSpecs] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * Read file from workspace
 */
async function readWorkspaceFile(workspacePath: string, filename: string): Promise<string> {
  const filePath = path.join(workspacePath, filename);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    return '';
  }
}

/**
 * Write file to workspace
 */
async function writeWorkspaceFile(
  workspacePath: string,
  filename: string,
  content: string
): Promise<void> {
  const filePath = path.join(workspacePath, filename);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Call LLM with prompt
 */
async function callLLM(client: GrokClient, prompt: string): Promise<string> {
  return await client.chat(prompt);
}

/**
 * Check if reviewer indicates completion
 */
function isGoalComplete(reviewerContent: string): boolean {
  // Look for YAML block with completion: true
  const completionMatch = reviewerContent.match(/completion:\s*true/i);
  if (completionMatch) {
    return true;
  }

  // Also check for GOAL_SATISFIED flag
  const goalSatisfiedMatch = reviewerContent.match(/GOAL_SATISFIED\s*=\s*true/i);
  return !!goalSatisfiedMatch;
}

/**
 * Run planner agent
 */
async function runPlanner(
  client: GrokClient,
  workspacePath: string,
  specs: AgentSpecs
): Promise<void> {
  const goalContent = await readWorkspaceFile(workspacePath, 'goal.md');
  const previousResult = await readWorkspaceFile(workspacePath, 'result.md');

  const prompt = `${specs.planner}

# Goal
${goalContent}

${previousResult ? `# Previous Result\n${previousResult}` : ''}

Generate a task plan to achieve this goal.`;

  const plannerOutput = await callLLM(client, prompt);
  await writeWorkspaceFile(workspacePath, 'planner.md', plannerOutput);
}

/**
 * Run executor agent
 */
async function runExecutor(
  client: GrokClient,
  workspacePath: string,
  specs: AgentSpecs
): Promise<void> {
  const plannerContent = await readWorkspaceFile(workspacePath, 'planner.md');
  const goalContent = await readWorkspaceFile(workspacePath, 'goal.md');

  const prompt = `${specs.executor}

# Goal
${goalContent}

# Plan
${plannerContent}

Execute the tasks and provide the result.`;

  const executorOutput = await callLLM(client, prompt);
  await writeWorkspaceFile(workspacePath, 'executor.md', executorOutput);

  // For now, executor output goes directly to result.md
  // In a more sophisticated implementation, this would execute actual tasks
  await writeWorkspaceFile(workspacePath, 'result.md', executorOutput);
}

/**
 * Run reviewer agent
 */
async function runReviewer(
  client: GrokClient,
  workspacePath: string,
  specs: AgentSpecs
): Promise<boolean> {
  const goalContent = await readWorkspaceFile(workspacePath, 'goal.md');
  const resultContent = await readWorkspaceFile(workspacePath, 'result.md');

  const prompt = `${specs.reviewer}

# Goal
${goalContent}

# Result
${resultContent}

Review whether the goal is satisfied. Output:
- completion: true (if goal is satisfied)
- completion: false (if improvements needed)
- List any required improvements`;

  const reviewerOutput = await callLLM(client, prompt);
  await writeWorkspaceFile(workspacePath, 'reviewer.md', reviewerOutput);

  return isGoalComplete(reviewerOutput);
}

/**
 * Run updater agent
 */
async function runUpdater(
  client: GrokClient,
  workspacePath: string,
  specs: AgentSpecs
): Promise<void> {
  const reviewerContent = await readWorkspaceFile(workspacePath, 'reviewer.md');
  const resultContent = await readWorkspaceFile(workspacePath, 'result.md');

  const prompt = `${specs.updater}

# Reviewer Feedback
${reviewerContent}

# Current Result
${resultContent}

Apply the reviewer's corrections and generate an updated result.`;

  const updatedResult = await callLLM(client, prompt);
  await writeWorkspaceFile(workspacePath, 'result.md', updatedResult);
}

/**
 * Generate final report
 */
async function generateFinalReport(
  client: GrokClient,
  workspacePath: string,
  specs: AgentSpecs
): Promise<void> {
  const goalContent = await readWorkspaceFile(workspacePath, 'goal.md');
  const resultContent = await readWorkspaceFile(workspacePath, 'result.md');
  const reviewerContent = await readWorkspaceFile(workspacePath, 'reviewer.md');

  const prompt = `${specs.finalAgent}

# Goal
${goalContent}

# Result
${resultContent}

# Review
${reviewerContent}

Generate a polished final report.`;

  const finalReport = await callLLM(client, prompt);
  await writeWorkspaceFile(workspacePath, 'final_report.md', finalReport);
}

/**
 * Run the full agent loop
 */
async function runAgentLoop(
  workspace: WorkspaceInfo,
  grokApiKey: string
): Promise<AgentLoopResult> {
  const client = new GrokClient(grokApiKey);
  const specs = parseAgentsSpec(workspace.agentsSpec);
  const maxLoops = 5;

  let meta = workspace.meta;
  let isComplete = false;

  for (let i = 0; i < maxLoops; i++) {
    // Increment loop count
    meta.loop_count = i + 1;
    meta.timestamp = new Date().toISOString();
    await saveMeta(meta);

    // Step 1: Planner
    await runPlanner(client, workspace.workspacePath, specs);

    // Step 2: Executor
    await runExecutor(client, workspace.workspacePath, specs);

    // Step 3: Reviewer
    isComplete = await runReviewer(client, workspace.workspacePath, specs);

    if (isComplete) {
      // Goal achieved - generate final report
      await generateFinalReport(client, workspace.workspacePath, specs);
      return {
        status: 'done',
        loops: meta.loop_count
      };
    }

    // Step 4: Updater (apply corrections)
    if (i < maxLoops - 1) {
      await runUpdater(client, workspace.workspacePath, specs);
    }
  }

  // Loop limit reached - generate best-effort final report
  await generateFinalReport(client, workspace.workspacePath, specs);

  return {
    status: 'incomplete',
    loops: meta.loop_count
  };
}

export { runAgentLoop, parseAgentsSpec, AgentLoopResult, WorkspaceInfo };
