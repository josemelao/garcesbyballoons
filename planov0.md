# Plano de Ação v0 — Garcês by Balloons

Plano de implementação em **blocos**, derivado do `relatorio.md` e da análise com **graphify** (grafo em `graphify-out/`). Cada bloco é pensado para rodar com o workflow **PEV** (`/pev`), um bloco de cada vez.

---

## Como executar (regras por bloco)

1. **Um bloco = um `/pev`** (Plan → Execute → Verify). Revise o diff antes do próximo.
2. Passe **escopo fechado**: número dos itens + arquivos. Ex.:
   `/pev bloco 1 — contraste, itens 3.1/3.2/3.3/4.11/3.12 em tokens.css e styles.css`
3. **Um commit por bloco.** (O projeto ainda não é um repo git — vale `git init` antes de começar.)
4. O QA do PEV cobre **acessibilidade, responsividade e layout quebrado** — **não** roda Lighthouse. A validação Lighthouse fica no Bloco 10.
5. Blocos marcados com **depende de** só devem rodar depois do bloco indicado.

---

## Insights do graphify que moldam o plano

- **`main()` é o hub** (21 arestas, betweenness 0.171): liga *Main App Controller* → helpers, validação e nav/motion. Evitar rodar dois blocos que mexem em funções diferentes do mesmo `main.js` no mesmo run.
- **`Gallery Filters` ↔ `Lightbox`** têm `shares_data_with` e ambos ligam ao *Progressive Enhancement Gap* → itens **3.5 e 3.6 são acoplados**.
- **Cluster "Form Validation Logic"** isolado (`validateAll / validateField / errorOf / fieldOf / resetForm`) → itens **3.4 e 3.7 formam um bloco natural**.
- **`tokens.css` é o hub de tokens** → o bloco de contraste tem altíssima alavancagem em 1 arquivo.
- ⚠️ `assets/css/tokens.css` ficou **fora do grafo** (`skipped_sensitive` — provável falso-positivo). O grafo não o vê, mas o plano o inclui.

---

## Visão geral dos blocos

| # | Bloco | Prioridade | Arquivos | Itens (relatório) |
|---|-------|-----------|----------|-------------------|
| 0 | Decisões/conteúdo *(sem PEV)* | pré-req | — | config.js, og:image, LGPD, copy, fotos |
| 1 | Contraste & tokens | **P0** | `tokens.css`, `styles.css` | 3.1, 3.2, 3.3, 4.11, 3.12 (+4.12) |
| 2 | SEO & conformidade | **P0** | `index.html` | 2.2 (#7–10), 4.15, 2.3 |
| 3 | Formulário à prova de JS | **P0** | `index.html`, `main.js` | 3.4, 3.7, 4.14 |
| 4 | Header & menu | P0/P1 | `index.html`, `styles.css`, `main.js` | 2.1#5, 5.4, 5.5, 5.6 |
| 5 | Filtros & lightbox sem JS | P1 | `index.html`, `main.js`, `styles.css` | 3.5, 3.6, 5.10 |
| 6 | Conversão/CTA | P1 | `index.html` | 2.1 #1,2,3,6 |
| 7 | Layout & responsivo | P1/P2 | `styles.css`, `index.html` | 4.2, 4.3, 3.11, 5.1, 5.2, 5.3, 5.7, 5.8 |
| 8 | Performance | P1 | `index.html` | 3.9, 3.10 |
| 9 | Consistência & limpeza | P1/P2 | `index.html`, `styles.css` | 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.13 |
| 10 | A11y fina, extras & validação | P2 | `index.html`, `main.js`, `styles.css` | 3.8, 5.9, 2.4 + Lighthouse |

---

## Bloco 0 — Decisões/conteúdo (sem PEV)

**Objetivo:** reunir tudo que é decisão/conteúdo antes de mexer no código.

- [ ] `assets/js/config.js`: número de WhatsApp e/ou `formEndpoint` (sem isso o site não envia nada — P0)
- [ ] `og:image` 1200×630 (asset de compartilhamento)
- [ ] Texto da Política de Privacidade / LGPD + destino do link
- [ ] Copy dos depoimentos (prova social) e da seção "Como funciona" (3 passos)
- [ ] 12–18 fotos reais da galeria (múltiplo de 3)
- [ ] Decidir sobre `.card__index` (4.12): remover ou enfatizar (~0.10–0.14)
- [ ] Decidir intenção do herói (3.13): subir `opacity` para ~.5 ou manter

**DoD:** valores/textos/arquivos prontos para alimentar os blocos de código.

---

## Bloco 1 — Contraste & tokens (P0)

**Arquivos:** `assets/css/tokens.css`, `assets/css/styles.css`
**Itens:** 3.1 (borda de controles ≥3:1 / `--border-control`), 3.2 (`.eyebrow` → ~`#7C4A00`), 3.3 (`color-scheme: dark` + autofill), 4.11 (`--bg-soft` mais perceptível), 3.12 (scrim atrás de `.tile__cat`), 4.12 (se decidido no Bloco 0).
**Por que junto:** tokens são o hub — tudo se resolve no mesmo lugar (1 arquivo alavanca o tema todo).

- [ ] 3.1 Contraste de bordas de inputs/chips/ícones
- [ ] 3.2 `.eyebrow` na faixa clara
- [ ] 3.3 `color-scheme: dark` + tratamento de autofill
- [ ] 4.11 Diferenciar `--bg-soft`
- [ ] 3.12 Scrim atrás do `.tile__cat`
- [ ] 4.12 `.card__index` (conforme decisão)

**DoD:** controles ≥3:1, eyebrow ≥4.5:1, `color-scheme:dark` sem lista/scrollbar/autofill claros, faixas de seção perceptíveis.

---

## Bloco 2 — SEO & conformidade (P0)

**Arquivo:** `index.html`  ·  **Depende de:** Bloco 0 (og:image, texto LGPD)
**Itens:** 2.2 (#7 `canonical`+`og:url`, #8 `og:image`+`twitter:image`, #9 completar JSON-LD `url/image/telephone/priceRange/geo`, #10 `FAQPage`), 4.15 (twitter card), 2.3 (link Política de Privacidade/LGPD).

- [ ] 2.2#7 `canonical` + `og:url` (remover comentários)
- [ ] 2.2#8 `og:image` + `twitter:image` (1200×630)
- [ ] 2.2#9 JSON-LD completo (`url`, `image`, `telephone`, `priceRange`, `geo`)
- [ ] 2.2#10 Schema `FAQPage` (6 perguntas em `<details>`)
- [ ] 4.15 Twitter card válido
- [ ] 2.3 Link de Política de Privacidade / LGPD

**DoD:** rich result `LocalBusiness` válido, `twitter:card` com imagem, `FAQPage` presente, link de privacidade visível.

---

## Bloco 3 — Formulário à prova de JS (P0)

**Arquivos:** `index.html`, `assets/js/main.js`
**Itens:** 3.4 (`novalidate` via JS), 3.7 (resumo de erro no topo + foco no container + `role="alert"`), 4.14 (filtrar handler de erro por `e.target === window`).
**Grafo:** cluster *Form Validation Logic* + `buildWhatsAppMessage`/`clearStatus` (Main App Controller).

- [ ] 3.4 Remover `novalidate` do HTML e aplicar via JS
- [ ] 3.7 Resumo de erro acessível (topo, `role="alert"`, errors inline mantidos)
- [ ] 4.14 Restringir o handler global de erro

**DoD:** submit íntegro com e sem JS; erro focado e anunciado no topo.

---

## Bloco 4 — Header & menu (P0/P1)

**Arquivos:** `index.html`, `assets/css/styles.css`, `assets/js/main.js`
**Itens:** 2.1#5 (CTA no menu mobile aberto), 5.4 (header apertado 1081–1150px), 5.5 (scroll lock + scrim no menu), 5.6 (retorno de foco ao toggle).
**Grafo:** `closeMenu()` / `goToContactForm()` (cluster Nav & Motion). *(4.1 já concluído.)*

- [ ] 2.1#5 CTA visível no menu mobile aberto
- [ ] 5.4 Corrigir/ajustar header entre 1081–1150px
- [ ] 5.5 Scroll lock + scrim atrás do painel
- [ ] 5.6 Devolver foco ao toggle ao fechar com `Esc`

**DoD:** menu mobile com CTA; sem corte de header; foco devolvido.

---

## Bloco 5 — Filtros & lightbox sem JS (P1)

**Arquivos:** `index.html`, `assets/js/main.js`, `assets/css/styles.css`
**Itens:** 3.5 (filtros só com `.js`, `aria-live`/`role="status"` em `#gallery-empty`), 3.6 (fallback do lightbox sem `<dialog>`), 5.10 (`role="status"` na contagem).
**Grafo:** filters ↔ lightbox acoplados (`shares_data_with`).

- [ ] 3.5 Filtros ocultos sem JS + live region de contagem
- [ ] 3.6 Fallback do lightbox (nova aba / `@supports not (dialog: modal)`)
- [ ] 5.10 `role="status"` na contagem de filtros

**DoD:** sem JS os filtros não aparecem e a interação não "morre"; contagem anunciada.

---

## Bloco 6 — Conversão/CTA (P1)

**Arquivo:** `index.html`  ·  **Depende de:** Bloco 0 (copy + fotos)
**Itens:** 2.1 #1 (depoimentos), #2 ("Como funciona" 3 passos), #3 (faixa de preço), #6 (galeria 12–18 imagens).

- [ ] 2.1#1 Seção de depoimentos / prova social (antes do CTA final)
- [ ] 2.1#2 Seção "Como funciona" (orçamento → projeto → montagem)
- [ ] 2.1#3 Transparência de investimento ("a partir de…"/mínimo)
- [ ] 2.1#6 Galeria com 12–18 imagens (múltiplo de 3)

**DoD:** prova social antes do CTA; 3 passos; faixa de preço; galeria múltipla de 3.

---

## Bloco 7 — Layout & responsivo (P1/P2)

**Arquivos:** `assets/css/styles.css`, `index.html`
**Itens:** 4.2 (4 breakpoints), 4.3 (alinhar grids), 3.11 (alvos 44px), 5.1 (galeria 3 col/8 itens), 5.2 (margem negativa), 5.3 (`.about__badge` em 320px), 5.7 (`.lightbox__img` com w/h), 5.8 (clique-fora no lightbox).

- [ ] 4.2 Padronizar breakpoints em 1080 / 900 / 620 / 560
- [ ] 4.3 Alinhar comportamento das grades equivalentes
- [ ] 3.11 Alvos de toque 44px em mobile
- [ ] 5.1 Balancear a galeria (com fotos do Bloco 6)
- [ ] 5.2 Remover hack de margem negativa
- [ ] 5.3 Verificar `.about__badge` em 320–360px
- [ ] 5.7 `width`/`height` na `.lightbox__img`
- [ ] 5.8 Melhorar "clicar fora" no lightbox

**DoD:** 4 breakpoints canônicos; grids consistentes; zero overflow em 320–1920.

---

## Bloco 8 — Performance (P1)

**Arquivo:** `index.html`
**Itens:** 3.9 (reduzir fontes de 13 → 4 arquivos), 3.10 (`srcset` w=400/800/1200 + `sizes`).

- [ ] 3.9 Reduzir pesos de fonte (Inter 400/600; Playfair 600 + 600 itálico)
- [ ] 3.10 `srcset` + `sizes` (mantendo `width`/`height`)

**DoD:** 4 arquivos de fonte; imagens adaptativas com dimensões mantidas.

---

## Bloco 9 — Consistência & limpeza (P1/P2)

**Arquivos:** `index.html`, `assets/css/styles.css`
**Itens:** 4.4 (ritmo do stagger), 4.5 (renomear `.hero__places`), 4.6 (nomenclatura DF), 4.7 ("Formação"), 4.8 (nav header ≠ rodapé), 4.9 (inline styles), 4.10 (regra redundante), 4.13 (tracking do `.hero__places`).

- [ ] 4.4 Unificar o passo do stagger (token `--dur-stagger`)
- [ ] 4.5 Renomear `.hero__places` → `.hero__tags`/`.hero__services`
- [ ] 4.6 Padronizar "Distrito Federal (Brasília e RAs)"
- [ ] 4.7 Unificar "Formação" / "Consultoria e formação"
- [ ] 4.8 Definir arquitetura de informação canônica (header × rodapé)
- [ ] 4.9 Mover inline styles para classes/utilitários
- [ ] 4.10 Remover regra redundante (`styles.css:523`)
- [ ] 4.13 Ajustar tracking/encurtar item do `.hero__places`

**DoD:** sem inline styles, nomenclatura unificada, stagger constante.

---

## Bloco 10 — A11y fina, extras & validação (P2)

**Arquivos:** `index.html`, `assets/js/main.js`, `assets/css/styles.css`
**Itens:** 3.8 (nome acessível dos tiles), 5.9 (print do FAQ), 2.4 (`apple-touch-icon`, `manifest`, `robots.txt`, `sitemap.xml`), + validação final.

- [ ] 3.8 `img alt=""` no tile + `aria-label` no botão
- [ ] 5.9 Corrigir print do FAQ (forçar abertura dos `<details>`)
- [ ] 2.4 `apple-touch-icon`, `manifest`, `robots.txt`, `sitemap.xml`
- [ ] Validação Lighthouse (Performance / Acessibilidade / SEO)
- [ ] Teste em 320 / 375 / 414 / 768 / 1024 / 1280 / 1920 px
- [ ] Teste com *reduced motion* ativo e zoom 200%
- [ ] Teste do menu mobile aberto e do lightbox em telas pequenas

**DoD:** Lighthouse ≥90 nas 3 categorias; testes da seção 7 do relatório passam.

---

## Ordem & dependências

```
Bloco 0 (decisões)
   └─► 1 (tokens) ─► 2 (SEO) ─► 3 (form) ─► 4 (header/menu)          [P0]
                          └─► 5 (filtros/lightbox) ─► 6 (conteúdo) ─► 7 (layout)
                                                              └─► 8 (perf) ─► 9 (limpeza) ─► 10 (a11y+validação)
```

- **P0 — antes de publicar:** Bloco 0 (`config.js`) + Blocos 1, 2, 3.
- **P1 — primeiros 30 dias:** Blocos 4, 5, 6, 7, 8.
- **P2 — polimento:** Blocos 9, 10.
- **Cortes opcionais:** se um bloco ficar grande, divida — ex. Bloco 7 em "breakpoints/grids" e "lightbox/galeria"; Bloco 6 em "copy" e "galeria".

---

*Base: `relatorio.md` + grafo `graphify-out/` (51 nós · 71 arestas · 8 comunidades). Gerado em 2026-10-15.*
