# Graph Report - Balloons  (2026-10-17)

## Corpus Check
- 19 files · ~33,402 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .css 1, .webmanifest 1)

## Summary
- 191 nodes · 252 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d96de457`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Landing Page Sections & Gaps
- main
- PEV Workflow Orchestration
- Plano de Ação v0 — Garcês by Balloons
- Garcês by Balloons — Passada de Luxo · Plano de Implementação
- lightbox-abertura.luxo.test.mjs
- spotlight-cards.luxo.test.mjs
- hero-split.luxo.test.mjs
- package.json
- magnetic-buttons.luxo.test.mjs
- AGENTS.md
- hero-parallax.luxo.test.mjs
- form.block3.test.mjs

## God Nodes (most connected - your core abstractions)
1. `main()` - 36 edges
2. `Garcês by Balloons — Passada de Luxo · Plano de Implementação` - 18 edges
3. `Plano de Ação v0 — Garcês by Balloons` - 16 edges
4. `index.html — Garcês by Balloons Landing Page` - 8 edges
5. `Relatório de Auditoria — Garcês by Balloons` - 8 edges
6. `jsdom` - 7 edges
7. `PEV Workflow Skill` - 7 edges
8. `Garcês by Balloons — Landing Page README` - 5 edges
9. `prefersReduced()` - 4 edges
10. `applyFilter()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Bloco 3 — Movimento de entrada (reveals + split-text do H1)` --references--> `main()`  [INFERRED]
  PLANO-LUXO.md → assets/js/main.js
- `Pendências conhecidas (minors deferidos)` --references--> `main()`  [INFERRED]
  PLANO-LUXO.md → assets/js/main.js
- `Insights do graphify que moldam o plano` --references--> `main()`  [INFERRED]
  planov0.md → assets/js/main.js
- `PEV QA Agent (Phase 3: VERIFY)` --semantically_similar_to--> `Accessibility and Performance Practices`  [INFERRED] [semantically similar]
  .opencode/agents/pev/qa.md → README.md
- `Bloco 4 — Header & menu (P0/P1)` --references--> `goToContactForm()`  [INFERRED]
  planov0.md → assets/js/main.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PEV Linear Pipeline (Plan > Execute > Verify)** — _opencode_commands_pev, _opencode_skills_pev_workflow_skill, _opencode_agents_pev_architect, _opencode_agents_pev_coder, _opencode_agents_pev_qa [EXTRACTED 1.00]
- **Accessibility and Consistency Audit Findings** — relatorio_non_text_contrast_failure, relatorio_breakpoint_inconsistency, relatorio_social_proof_gap, relatorio_lgpd_gap [INFERRED 0.85]
- **No-JS Resilience and Progressive Enhancement of the Landing Page** — readme_no_js_fallback, index_contact_form, index_gallery_filters, index_lightbox, relatorio_progressive_enhancement_gap [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "Landing Page Sections & Gaps"
Cohesion: 0.16
Nodes (17): index.html — Garcês by Balloons Landing Page, data-cfg-* Config Placeholders (contacts hidden when empty), Contact Form (#contact-form), Gallery Filters (.filters / .tile), JSON-LD LocalBusiness Structured Data, Native <dialog> Lightbox (#lightbox), Garcês by Balloons — Landing Page README, Centralized Design Tokens (tokens.css) (+9 more)

### Community 1 - "main"
Cohesion: 0.08
Nodes (28): formatPhone(), instagramHandle(), main(), applyFilter(), buildWhatsAppMessage(), clearStatus(), closeMenu(), cssTimeMs() (+20 more)

### Community 2 - "PEV Workflow Orchestration"
Cohesion: 0.39
Nodes (5): PEV Architect Agent (Phase 1: PLAN), PEV Coder Agent (Phase 2: EXECUTE), PEV QA Agent (Phase 3: VERIFY), PEV Slash Command (/pev), PEV Workflow Skill

### Community 3 - "Plano de Ação v0 — Garcês by Balloons"
Cohesion: 0.13
Nodes (14): Bloco 0 — Decisões/conteúdo (sem PEV), Bloco 10 — A11y fina, extras & validação (P2), Bloco 1 — Contraste & tokens (P0), Bloco 2 — SEO & conformidade (P0), Bloco 5 — Filtros & lightbox sem JS (P1), Bloco 6 — Conversão/CTA (P1), Bloco 7 — Layout & responsivo (P1/P2), Bloco 8 — Performance (P1) (+6 more)

### Community 4 - "Garcês by Balloons — Passada de Luxo · Plano de Implementação"
Cohesion: 0.09
Nodes (21): Bloco 0 — Fundação: tokens de movimento/material + grão cinematográfico, Bloco 1 — Ouro metálico (gradiente + brilho), Bloco 2 — Fundo "vivo" procedural (auras douradas), Bloco 3 — Movimento de entrada (reveals + split-text do H1), Bloco 4 — Botões e links (micro-interações), Bloco 5 — Galeria e lightbox, Bloco 6 — Cards, superfícies e vidro fumê, Bloco 7 — Layout editorial (respiro, full-bleed, depoimentos, marquee) (+13 more)

### Community 5 - "lightbox-abertura.luxo.test.mjs"
Cohesion: 0.18
Nodes (9): configJs, el(), here, html, imgOf(), mainJs, root, srcOf() (+1 more)

### Community 6 - "spotlight-cards.luxo.test.mjs"
Cohesion: 0.17
Nodes (7): card(), cards(), configJs, here, html, mainJs, root

### Community 8 - "hero-split.luxo.test.mjs"
Cohesion: 0.17
Nodes (5): configJs, here, html, mainJs, root

### Community 9 - "package.json"
Cohesion: 0.18
Nodes (10): description, devDependencies, jsdom, name, private, scripts, test, type (+2 more)

### Community 10 - "magnetic-buttons.luxo.test.mjs"
Cohesion: 0.15
Nodes (6): CAIXA, configJs, here, html, mainJs, root

### Community 12 - "hero-parallax.luxo.test.mjs"
Cohesion: 0.18
Nodes (7): configJs, here, heroY(), html, mainJs, midia(), root

### Community 13 - "form.block3.test.mjs"
Cohesion: 0.20
Nodes (7): boot(), configJs, here, html, mainJs, makeDom(), root

## Knowledge Gaps
- **3 isolated node(s):** `JSON-LD LocalBusiness Structured Data`, `Missing LGPD / Privacy Policy Link`, `PEV Slash Command (/pev)`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 107 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `main` to `Plano de Ação v0 — Garcês by Balloons`, `Garcês by Balloons — Passada de Luxo · Plano de Implementação`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `main()` (e.g. with `closeLightbox()` and `onEnd()`) actually correct?**
  _`main()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `JSON-LD LocalBusiness Structured Data`, `Missing LGPD / Privacy Policy Link`, `PEV Slash Command (/pev)` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main` be split into smaller, more focused modules?**
  _Cohesion score 0.07827260458839407 - nodes in this community are weakly interconnected._
- **Why does `jsdom` connect `package.json` to `lightbox-abertura.luxo.test.mjs`, `spotlight-cards.luxo.test.mjs`, `hero-split.luxo.test.mjs`, `magnetic-buttons.luxo.test.mjs`, `hero-parallax.luxo.test.mjs`, `form.block3.test.mjs`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Plano de Ação v0 — Garcês by Balloons` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Garcês by Balloons — Passada de Luxo · Plano de Implementação` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._