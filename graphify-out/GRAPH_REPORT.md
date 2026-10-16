# Graph Report - Balloons  (2026-10-15)

## Corpus Check
- Corpus is ~10,778 words - fits in a single context window. You may not need a graph.

## Summary
- 51 nodes · 71 edges · 8 communities (5 shown, 3 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Landing Page Sections & Gaps
- Main App Controller
- PEV Workflow Orchestration
- Audit & Design Direction
- Main.js Helper Utilities
- Form Validation Logic
- Nav & Motion Helpers

## God Nodes (most connected - your core abstractions)
1. `main()` - 21 edges
2. `index.html — Garcês by Balloons Landing Page` - 8 edges
3. `Relatório de Auditoria — Garcês by Balloons` - 8 edges
4. `PEV Workflow Skill` - 7 edges
5. `Garcês by Balloons — Landing Page README` - 5 edges
6. `validateField()` - 4 edges
7. `prefersReduced()` - 3 edges
8. `fieldOf()` - 3 edges
9. `errorOf()` - 3 edges
10. `resetForm()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `PEV QA Agent (Phase 3: VERIFY)` --semantically_similar_to--> `Accessibility and Performance Practices`  [INFERRED] [semantically similar]
  .opencode/agents/pev/qa.md → README.md
- `Progressive Enhancement Gap (Form and Filters Die Without JS)` --semantically_similar_to--> `Fallback Without JavaScript`  [INFERRED] [semantically similar]
  relatorio.md → README.md
- `PEV Workflow Skill` --references--> `PEV Architect Agent (Phase 1: PLAN)`  [EXTRACTED]
  .opencode/skills/pev-workflow/SKILL.md → .opencode/agents/pev/architect.md
- `PEV Coder Agent (Phase 2: EXECUTE)` --conceptually_related_to--> `Token Economy (No Dialogue Between Phases)`  [INFERRED]
  .opencode/agents/pev/coder.md → .opencode/skills/pev-workflow/SKILL.md
- `PEV Slash Command (/pev)` --references--> `PEV Workflow Skill`  [EXTRACTED]
  .opencode/commands/pev.md → .opencode/skills/pev-workflow/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PEV Linear Pipeline (Plan > Execute > Verify)** — _opencode_commands_pev, _opencode_skills_pev_workflow_skill, _opencode_agents_pev_architect, _opencode_agents_pev_coder, _opencode_agents_pev_qa [EXTRACTED 1.00]
- **No-JS Resilience and Progressive Enhancement of the Landing Page** — readme_no_js_fallback, index_contact_form, index_gallery_filters, index_lightbox, relatorio_progressive_enhancement_gap [INFERRED 0.85]
- **Accessibility and Consistency Audit Findings** — relatorio_non_text_contrast_failure, relatorio_breakpoint_inconsistency, relatorio_social_proof_gap, relatorio_lgpd_gap [INFERRED 0.85]

## Communities (8 total, 3 thin omitted)

### Community 0 - "Landing Page Sections & Gaps"
Cohesion: 0.23
Nodes (10): index.html — Garcês by Balloons Landing Page, data-cfg-* Config Placeholders (contacts hidden when empty), Contact Form (#contact-form), Gallery Filters (.filters / .tile), JSON-LD LocalBusiness Structured Data, Native <dialog> Lightbox (#lightbox), Garcês by Balloons — Landing Page README, Preview Mode for Unconfigured Contacts (+2 more)

### Community 2 - "PEV Workflow Orchestration"
Cohesion: 0.39
Nodes (5): PEV Architect Agent (Phase 1: PLAN), PEV Coder Agent (Phase 2: EXECUTE), PEV QA Agent (Phase 3: VERIFY), PEV Slash Command (/pev), PEV Workflow Skill

### Community 3 - "Audit & Design Direction"
Cohesion: 0.38
Nodes (7): Centralized Design Tokens (tokens.css), Relatório de Auditoria — Garcês by Balloons, Seven Inconsistent Breakpoints, Dark Luxury Editorial Positioning (Black + Gold + White), Missing LGPD / Privacy Policy Link, Missing Social Proof / Conversion Gaps, ui-ux-pro-max Skill Knowledge Base

### Community 4 - "Main.js Helper Utilities"
Cohesion: 0.40
Nodes (3): formatPhone(), instagramHandle(), waLink()

### Community 5 - "Form Validation Logic"
Cohesion: 0.50
Nodes (5): errorOf(), fieldOf(), resetForm(), validateAll(), validateField()

## Knowledge Gaps
- **3 isolated node(s):** `PEV Slash Command (/pev)`, `JSON-LD LocalBusiness Structured Data`, `Missing LGPD / Privacy Policy Link`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 15 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `Main App Controller` to `Main.js Helper Utilities`, `Form Validation Logic`, `Nav & Motion Helpers`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `main()` (e.g. with `closeLightbox()` and `closeMenu()`) actually correct?**
  _`main()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PEV Slash Command (/pev)`, `JSON-LD LocalBusiness Structured Data`, `Missing LGPD / Privacy Policy Link` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Garcês by Balloons — Landing Page README` connect `Landing Page Sections & Gaps` to `Audit & Design Direction`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `index.html — Garcês by Balloons Landing Page` connect `Landing Page Sections & Gaps` to `Audit & Design Direction`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._