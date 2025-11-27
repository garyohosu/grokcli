# Agent Workflow Specification

This document explains each phase of the agent loop.

## 1. Requirements Gathering

The agent collects missing information to build a clear goal.

## 2. Goal Generation

goal.md is created or updated based on user intent.

## 3. Planning

planner.md defines tasks needed to achieve the goal.

## 4. Execution

executor.md provides execution instructions; results go to result.md.

## 5. Review

reviewer.md checks whether the goal is satisfied.

## 6. Final Report

final_report.md is generated when the goal is complete.

## 7. Goal Change Detection

If goal.md changes, all auto-generated files are deleted.
