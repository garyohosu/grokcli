import * as fs from 'fs/promises';
import * as path from 'path';
import { GrokClient } from '../grok-client';
import {
  readFile,
  writeFile,
  loadMeta,
  saveMeta,
  hashGoal,
  WORKSPACE_DIR
} from './workspace';

interface RunnerResult {
  success: boolean;
  loops: number;
  finalReportPath?: string;
  error?: string;
}

/**
 * Load template from src/agent/templates
 */
async function loadTemplate(templateName: string): Promise<string> {
  const templatePath = path.join(__dirname, 'templates', templateName);
  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load template: ${templateName}`);
  }
}

/**
 * Generate content from template with variable substitution
 */
function generateFromTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;

  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(value);
  }

  return result;
}

/**
 * Run LLM with prompt using Grok client
 */
async function runLLM(client: GrokClient, prompt: string): Promise<string> {
  return await client.chat(prompt);
}

/**
 * Check if reviewer indicates goal is achieved
 */
function isGoalAchieved(reviewerContent: string): boolean {
  // Check for legacy "GOAL ACHIEVED" string
  if (reviewerContent.includes('GOAL ACHIEVED')) {
    return true;
  }

  // Check for YAML format with completion: true
  const yamlMatch = reviewerContent.match(/completion:\s*true/);
  return yamlMatch !== null;
}

/**
 * Run the complete agent workflow
 */
export async function runAgentWorkflow(grokApiKey: string): Promise<RunnerResult> {
  const client = new GrokClient(grokApiKey);
  const maxLoops = 5;

  // Load goal
  const goalContent = await readFile('goal.md');
  if (!goalContent) {
    return {
      success: false,
      loops: 0,
      error: 'goal.md not found. Please run interview mode first.'
    };
  }

  // Load or create meta
  let meta = await loadMeta();
  const currentGoalHash = hashGoal(goalContent);

  // Check if goal changed
  if (meta.goal_hash !== currentGoalHash) {
    meta = {
      goal_hash: currentGoalHash,
      loop_count: 0,
      timestamp: new Date().toISOString()
    };
    await saveMeta(meta);
  }

  // Load templates
  const plannerTemplate = await loadTemplate('planner_template.md');
  const executorTemplate = await loadTemplate('executor_template.md');
  const reviewerTemplate = await loadTemplate('reviewer_template.md');
  const finalReportTemplate = await loadTemplate('final_report_template.md');

  let previousResult = '';
  let goalAchieved = false;

  // Main agent loop
  for (let i = 0; i < maxLoops; i++) {
    console.log(`\n=== Loop ${i + 1}/${maxLoops} ===\n`);

    // Update loop count
    meta.loop_count = i + 1;
    meta.timestamp = new Date().toISOString();
    await saveMeta(meta);

    // Step 1: Planner
    console.log('Running Planner Agent...');
    const plannerPrompt = generateFromTemplate(plannerTemplate, {
      goal: goalContent,
      previous_result: previousResult || 'No previous result'
    });
    const plannerContent = await runLLM(client, plannerPrompt);
    await writeFile('planner.md', plannerContent);

    // Step 2: Executor
    console.log('Running Executor Agent...');
    const executorPrompt = generateFromTemplate(executorTemplate, {
      goal: goalContent,
      planner_content: plannerContent
    });
    const executorContent = await runLLM(client, executorPrompt);
    await writeFile('executor.md', executorContent);

    // Step 3: Execute and produce result
    console.log('Generating result...');
    const resultContent = await runLLM(client, `Execute the following tasks and produce result.md:\n\n${executorContent}`);
    await writeFile('result.md', resultContent);
    previousResult = resultContent;

    // Step 4: Reviewer
    console.log('Running Reviewer Agent...');
    const reviewerPrompt = generateFromTemplate(reviewerTemplate, {
      goal: goalContent,
      previous_result: resultContent,
      loop_count: String(meta.loop_count)
    });
    const reviewerContent = await runLLM(client, reviewerPrompt);
    await writeFile('reviewer.md', reviewerContent);

    // Step 5: Check if goal is achieved
    if (isGoalAchieved(reviewerContent)) {
      console.log('\n✓ Goal achieved!');
      goalAchieved = true;
      break;
    }

    console.log('Goal not yet achieved. Continuing to next iteration...');
  }

  // Generate final report
  console.log('\nGenerating final report...');
  const finalReportPrompt = generateFromTemplate(finalReportTemplate, {
    goal: goalContent,
    previous_result: previousResult,
    reviewer_notes: await readFile('reviewer.md') || 'No reviewer notes'
  });
  const finalReport = await runLLM(client, finalReportPrompt);
  await writeFile('final_report.md', finalReport);

  const finalReportPath = path.join(WORKSPACE_DIR, 'final_report.md');

  return {
    success: goalAchieved,
    loops: meta.loop_count,
    finalReportPath
  };
}
