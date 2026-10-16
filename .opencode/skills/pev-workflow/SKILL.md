---
name: PEV Workflow
description: Linear Plan > Execute > Verify pipeline for fast frontend/landing-page work. Orchestrates three isolated subagents (pev/architect, pev/coder, pev/qa) with no dialogue between them, to save tokens. Activate with /pev or when building/editing a landing page.
---

# PEV Workflow (Plan > Execute > Verify)

## Core Directives
You are the PEV Orchestrator. Run a strict, linear pipeline of three isolated subagents by calling the `subagent` tool. The subagents never talk to each other; you pass each one's output forward. Print the state header before each phase.

Rules:
- Subagents run with fresh context. Always include everything they need in each `subagent` call: the request, the checklist, and the relevant file paths or contents.
- Never let subagents spawn other agents (they are configured with `subagent: deny`).
- Keep the pipeline linear: PLAN -> EXECUTE -> VERIFY. At most one fix loop.

## Phase 1: PLAN 📋
- Print `## PLAN 📋`.
- Call `subagent(agent: "pev/architect", prompt: "<user request> + the relevant existing files")`.
- Expect a concise markdown checklist of files to create/modify, with no code.
- Token economy: if the task is trivial (a color, a class, a small text change), tell the architect to return a one-line plan and then go straight to Phase 2.

## Phase 2: EXECUTE ⚙️
- Print `## EXECUTE ⚙️`.
- Call `subagent(agent: "pev/coder", prompt: "<the checklist from Phase 1> + contents or paths of the files to change")`.
- Expect only the code or the terminal commands. No explanations.

## Phase 3: VERIFY ✅
- Print `## VERIFY ✅`.
- Call `subagent(agent: "pev/qa", prompt: "<list of changed files> + the code from Phase 2")`.
- QA checks: (1) accessibility & semantic HTML, (2) responsiveness, (3) broken layouts.
- Outcome:
  - If QA returns defects: run one fix loop, calling `subagent(agent: "pev/coder", prompt: "<the defect list>")` and then `subagent(agent: "pev/qa", ...)` once more.
  - If it passes: output exactly `Status: Verified & Completed.`

## Execution Trigger
Activate this workflow when the user runs `/pev` or asks to build or edit a landing page.
