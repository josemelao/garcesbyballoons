# Garcês by Balloons — Passada de Luxo · Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Cada bloco é autocontido e termina com um gate de validação visual do humano antes do próximo começar.**

**Goal:** Elevar a sensação de elegância/luxo do site — ouro metálico, fundo "vivo" procedural, movimento cinematográfico e micro-interações — sem mudar identidade, conteúdo ou stack.

**Architecture:** Site estático (HTML + CSS + JS vanilla, zero dependências de runtime; `node` só para testes). Todo o trabalho é apresentação: tokens novos em `tokens.css`, regras novas em `styles.css`, pequenos comportamentos progressivos em `main.js`. Nada de frameworks, nada de GSAP por padrão. Só se anima `transform`/`opacity`; tudo respeita `prefers-reduced-motion` e o fallback sem JS (classe `.js`).

**Tech Stack:** HTML5, CSS3 (custom properties, `background-clip:text`, `backdrop-filter`, keyframes, `@property` quando suportado), JavaScript vanilla (IIFE em `assets/js/main.js`), `node --test` + jsdom para testes existentes.

**Spec:** esta conversa (decisões de 16/10/2026) + o resumo de design abaixo. Não há arquivo de spec separado.

---

## Status de execução (atualizado em 16/10/2026)

**Branch:** `feat/luxo` · **Blocos 0 a 6 executados e com gate visual aprovado pelo humano.**

| Bloco | Commit | Estado |
| --- | --- | --- |
| 0. Tokens de movimento/material + grão | `972ec39` | ✅ aprovado |
| 1. Ouro metálico (hero + hairline) | `290f773` | ✅ aprovado |
| 1b. Palavras em ouro nos títulos (extensão do passo opcional do Bloco 1) | `d45dbf4` | ✅ aprovado |
| 2. Fundo vivo — piloto em `#como-funciona` | `b847b7b` | ✅ aprovado |
| 2. Fundo vivo — réplica nas 4 seções dark | `3d59547` | ✅ aprovado |
| 3. Reveals cinematográficos + split-text do H1 | `82761f4` | ✅ aprovado |
| 3. Fix da máscara das imagens (abre no `load`) | `31005de` | ✅ aprovado |
| 4. Botões e links (micro-interações) | `7ec317f` | ✅ aprovado |
| 5. Galeria e lightbox (abertura sem animação, por decisão do gate) | `aab0aea` | ✅ aprovado |
| 6. Cards, superfícies e vidro fumê (+ adendo "featured no hover"; spotlight seguindo o cursor nas 3 seções) | `e003f97` | ✅ aprovado |
| — (documentação da suíte de testes) | `b19b1db` | — |

**Testes:** `npm test` → **39/39** (6 originais + 12 em `tests/hero-split.luxo.test.mjs` + 11 em `tests/lightbox-abertura.luxo.test.mjs` + 10 novos em `tests/spotlight-cards.luxo.test.mjs`).

**Contratos estáticos** (em `.superpowers/sdd/2026-10-16-garces-luxo-plano/`, fora do site): bloco1 20/20, bloco1b 25/25, bloco2 18/18, bloco3 21/21, bloco4 63/63, bloco5 54/54, bloco6 52/52 - verificam a presença/forma das regras, os fallbacks e as contas de contraste.

### Decisões tomadas durante a execução (divergências do plano)

- **Split do H1 preserva markup inline** (percorre `childNodes`, não `textContent`): o snippet do Bloco 3 apagaria o `<em>cenário</em>` e, com ele, o ouro metálico do Bloco 1. Um teste roda o snippet literal do plano e comprova a perda.
- **`.word__inner` anima via `@keyframes` com `from` + `fill: both`** em vez de `transform: translateY(110%)` na regra base: se a animação não rodar, a palavra fica visível (constraint "conteúdo nunca invisível"). `.word` ganhou `padding-inline`/`margin-inline` de 0.06em para o itálico do `<em>` não ser cortado pela máscara.
- **A máscara das imagens abre no `load`** (`img.is-loaded`), e não junto com o reveal: com `--ease-cinema` (expo-out) ela se esgotava na mesma janela do fade e, como o retrato do Sobre é `loading="lazy"`, rodava sobre uma caixa vazia. Rede de segurança: `complete` no boot, `error` e timeout de 1,2s. `reduced-motion` → `clip-path: none`.
- **Fallbacks extras para o texto com `background-clip: text`** (não previstos no plano): `@supports not (-webkit-background-clip: text)`, `@media (forced-colors: active)` e reset dentro do `@media print` existente. Sem eles, `color: transparent` deixaria títulos e wordmark invisíveis no papel.
- **Wordmark `.brand__name` em ouro** com `--gold-metal-sm` (9,39:1). O token `--gold-metal` puro dá ≈4,0:1, abaixo dos 4,5:1 exigidos em 1.18rem.
- **`--gold-metal-deep`** = `#B45309 → #A16207 → #7C4A00` (4,55:1 no creme) para `#sobre`. O `#C98A0B` cogitado dava 2,73:1 e seria reprovado.
- **Aura replicada nas 4 seções `--dark`** restantes (`#servicos`, `#formacao`, `#atendimento`, `#contato`), com o `div.container` verificado como único filho direto de cada seção antes de aplicar. As 4 `--soft` e a `#sobre` (creme) ficam sem aura, de propósito: alternância entre faixa escura "viva" e faixa soft chapada.
- **Ouro em 1 palavra por título** (8 títulos): `#galeria` balões · `#formacao` decora · `#atendimento` atende · `#como-funciona` montagem · `#depoimentos` contratou · `#contato` seu evento · `#diferenciais` sustenta · `#sobre` balões (`--deep`). `#duvidas` sem ouro; `#servicos` mantém o título inteiro (eco do hero).
- **`will-change: transform` das auras omitido**: a animação perpétua já mantém a camada composta; com a réplica em 5 seções, ele criaria camadas promovidas permanentes.
- **`privacidade.html` não foi tocado** (constraint): o wordmark da página legal segue dourado sólido — inconsistência conhecida e aceita.
- **`graphify-out/` é atualizado a cada bloco** (`graphify update .`), mas fica **fora dos commits de bloco**; o commit do grafo entra na revisão global.
- **Sublinhado dos `.section-cta a` mantém uma camada em repouso** (ouro a 55%, 3,49:1): o plano removia o `text-decoration` e deixaria o link distinguível só pela cor (ouro × texto muted = 1,2:1), o que quebra o WCAG 1.4.1 em link inline. A camada clara (`--gold-light`) se desenha 0%→100% no hover.
- **O sublinhado anima `background-size`** (como o plano pede) e não `transform`: as duas ocorrências são links **inline** dentro de uma frase e podem quebrar em duas linhas, caso em que um `::after` com `scaleX` cobriria só o primeiro fragmento. `background-size` não dispara layout/reflow (pintura de 1px, 0,3s, só no hover).
- **Transição da seta na base `.btn svg`** (o plano punha dentro do `:hover`), para o ícone voltar suave ao sair do botão.
- **`@media print` devolve o `text-decoration` dos `.section-cta a`**: o sublinhado desenhado é um background e não imprime; mesmo padrão do fallback de impressão do Bloco 1.
- **O sheen branco do Bloco 4 foi substituído por um preenchimento da esquerda para a direita** (revisão pedida no gate, 16/10): o lustro branco a 50% era "brilho forte demais". Entrou uma camada `.btn::before` que abre com `transform: scaleX(0)` → `scaleX(1)` (`transform-origin: left`, 0,5s `--ease-cinema`) atrás do rótulo, e o `box-shadow` dourado do hover caiu à metade (literal `0 12px 28px rgba(212,175,55,.10)` em vez de `var(--shadow-gold)`).
- **O rótulo não se move mais no hover**: o "tilt da letra" reclamado vinha do `transform: translateY(-2px)` **pré-existente** do `.btn:hover` (levantava a pílula inteira), não do Bloco 4. A regra foi removida — junto com o `.btn:active { transform: none }`, que perdeu função — e o feedback de pressão virou `opacity: .88` na camada de preenchimento (só `opacity`, nada de `scale`: o humano é sensível a rótulo que se move).
- **A cor do preenchimento é escolhida pela cor do próprio rótulo**, para o texto nunca cair sobre a parte ainda não varrida: `.btn--gold` preenche com `--gold-light` (rótulo escuro, 12,58:1); `.btn--ghost` (fundo escuro) preenche com `--gold-deep` (rótulo claro, 4,55:1); `.band-light .btn--ghost` preenche com `--gold-light` (rótulo escuro, 11,14:1). Se o fantasma preenchesse com `--gold` e o texto escurecesse, ficaria texto escuro sobre fundo escuro por ~300ms a cada hover.
- **O fundo base não muda no hover** (nem `--btn-bg` do dourado, nem o `--gold-wash` do fantasma): `background-color` transiciona em `--dur-hover` (180ms) e acenderia a pílula inteira antes de a varredura de 0,5s terminar. A borda pode acompanhar o preenchimento (1px não compete com o efeito).
- **`position: relative` + `overflow: hidden` + `isolation: isolate` subiram para a base `.btn`**: o `isolation` é o que faz o `z-index: -1` do `::before` pintar **acima** do fundo do próprio botão (senão o preenchimento ficaria escondido sob o ouro) e **abaixo** do rótulo.
- **`--sheen` e `--shadow-gold` ficam definidos sem consumidor** no `styles.css`: o Bloco 4 era o único. Não foram removidos porque a constraint proíbe alterar tokens existentes e o Bloco 0 é entregável fechado.
- **O ícone dos botões não se move mais** (revisão 2, pedido do humano): o `translateX(3px)` do `.btn:hover svg` saiu, junto com a transição que existia só para ele. O seletor pegava **todo** `<svg>` do botão, então além da seta (à direita) ele deslocava o glifo do WhatsApp, que fica à **esquerda** do rótulo — dois ícones andando em direções diferentes. Sobrou `.btn svg { flex: none; }`.
- **`.tile img` deixou de animar `filter`** (Bloco 5): a declaração já existia com `filter ... var(--ease-reveal)` na transition, contra a constraint explícita "nunca animar `filter`". O bloco reescrevia essa linha de qualquer forma, então a violação foi removida: a saturação (`.88 → 1`) agora troca na hora. Contrato verifica que nenhuma `transition` do arquivo anima `filter`.
- **O overlay do tile sobe 4px com `inset: auto 0 -4px 0`** (Bloco 5): o bloco do rótulo fica 4px abaixo e, no hover, sobe para o lugar. Sem esse `-4px` a subida abriria uma fresta de 4px sem gradiente na base do tile (apareceria a imagem crua); com ele, o excesso recortado pelo `overflow: hidden` cai na parte opaca do gradiente e é invisível.
- **O selo "Ampliar" é `aria-hidden` e vive dentro do overlay** (Bloco 5): o HTML já trazia `aria-label="Ampliar: …"` nos 8 tiles, então o selo é a contrapartida **visual** de uma informação que o leitor de tela já recebe — o nome acessível não muda. Fica absoluto no canto inferior direito (não cresce o overlay, não depende da imagem por baixo, não é recortado pelo canto arredondado).
- **Hairline e selo também aparecem em `:focus-visible`** (Bloco 5), não só no hover: o tile é um `<button>` e quem navega por teclado merece a mesma afordância.
- **O lightbox não anima nada — a abertura é instantânea** (ruling do gate, 16/10): a entrada em `scale`/`fade` do diálogo e o sobe-e-desce da legenda foram **removidos** a pedido do humano, depois de a entrada engasgar no primeiro quadro mesmo com a correção da imagem. O `::backdrop` nunca foi animado (a regra global de reduced-motion cobre `*`, `*::before` e `*::after`, **não** `::backdrop` — animá-lo abriria um furo no "congelar em estado final legível") e agora segue estático junto com o resto.
- **A abertura do lightbox passou a pintar com o bitmap que o tile já mostra** (correção do gate, 16/10): o diálogo abria apontando para `data-full` (w=1600) — uma URL que o srcset do tile nunca pede (o tile para em w=1200) — então os primeiros quadros da animação rodavam sobre uma caixa vazia; e no fechamento `src = ''` resolve para a URL do documento (o navegador pedia a própria página como imagem), o load falhava e o handler de erro da seção 13 injetava a **imagem de reserva** — que era o que aparecia no começo da abertura seguinte. Agora o diálogo abre com a imagem do tile e a versão grande entra por cima só **depois do `decode()`**; no fechamento o `src` é removido, não zerado.
- **`@media (forced-colors: active)` devolve o sublinhado dos `.section-cta a`**: em modo de cores forçadas (Alto Contraste do Windows) o navegador anula `background-image` de gradiente, então o sublinhado desenhado desaparece e o link voltaria a ser distinguível **só pela cor** — regressão de WCAG 1.4.1 que este bloco introduziria ao remover o `text-decoration`. Mesmo padrão do fallback do Bloco 1.
- **O glow da pele featured mora num `::after` por card, com o spotlight fundido** (Bloco 6): uma camada só para `.card`, `.service`, `.service--feature` e `.program`; no `.card` o mesmo pseudo é o spotlight do Step 3 (`--mx/--my`). O plano deixava fundir ou separar — separar somaria brilho com a `section--aura` (Review Focus #3).
- **Vidro fumê em 2 pontos, nenhum a mais** (Bloco 6): `.nav` refinado **sem** a classe (`rgba(12,10,9,.55)` + `blur(16px) saturate(140%)` + fio de luz interno; `.is-scrolled` segue `.94` e o painel mobile intocado) e `.about__badge` com `.glass`. Ficaram fora o painel do menu mobile e os controles do lightbox: seria blur dentro do blur do `::backdrop` — invisível na prática e com o custo de raster que é a hipótese (B) do engasgo do Bloco 5.
- **O alpha da barra caiu de `.72` para `.55`** (Bloco 6): o "fumê" de verdade. Medido antes de mexer — a barra translúcida só existe no topo, sobre o scrim do hero (`rgba(12,10,9,.88)` com a mídia a `opacity .5`), e o texto muted ali dá 6,57:1.
- **A hairline dourada do `.service--feature` foi para o hover** (Bloco 6, `opacity 0→1`), coerente com "hierarquia só no hover".
- **O minor deferido do Bloco 4 foi resolvido no Bloco 6**: `.service__link:hover svg { translateX(4px) }` saiu — o repo não tem mais nenhum `translateX`.
- **`.program--featured` perdeu a regra inteira** (borda + radial) e a classe fica **inerte** no HTML, como gancho (o diff do HTML no bloco é 1 linha: a classe do badge).
- **O glow é uma regra compartilhada de `520px 320px`** (Bloco 6): no `#formacao` o hover fica um pouco mais largo que os `420px 220px` do antigo repouso featured; em `#servicos` preserva exatamente o desenho aprovado.
- **Sem glow permanente em reduced-motion** (Bloco 6): o snippet do Step 3 deixava `opacity: .6` sempre ligado — brilho perpétuo nos 3 cards. O bloco global da seção 20 já zera as durações, então a troca hover/foco é instantânea e nada fica piscando.
- **O `.glass` testa os DOIS prefixos de `backdrop-filter`** no `@supports` (Bloco 6) — o snippet testava só o padrão, e header e badge declaram os dois.
- **Fallback de impressão do badge** (Bloco 6): o fundo escuro não imprime e o texto é claro (`--text`); sem `.about__badge { background: none; color: #000 }` ele sumiria no papel. Defeito **pré-existente** que o bloco herdou ao virar dono daquela superfície.
- **Spotlight também em `#formacao` e `#servicos`** (Bloco 6, pedido no gate): o CSS já lia `--mx/--my` nos quatro tipos; faltava o **listener**, que estava preso em `$$('.card')` — e `.card` só existe em `#como-funciona`. Uma linha de seletor, zero CSS novo.
- **Sem revisão de contexto fresco por bloco** (Blocos 5 e 6): em execução inline o revisor único é o da branch inteira, na "Revisão global" do plano, depois do Bloco 9.
- **Commits dos Blocos 4, 5 e 6 amendados** quando o gate pediu mudança antes de aprovar (`00aa182` → `e003f97` no Bloco 6): a constraint é 1 commit por bloco, e as versões antigas ficam no reflog.

### Pendências conhecidas (minors deferidos)

- **Hairline do `.eyebrow::before` nas faixas claras** parte de `--gold` (≈2,0:1 sobre o creme) em vez de `--gold-deep` (≈4,6:1). É filete decorativo de 1px — não é texto (WCAG 1.4.3) nem gráfico necessário (1.4.11). Nenhuma ação necessária; ajuste opcional de 1 linha: `.band-light .eyebrow::before { background: linear-gradient(90deg, var(--gold-on-cream), transparent); }`.
- **Replicar a aura nas seções `--soft`** ficou de fora por decisão (alternância intencional). Se quiser depois, avaliar `--aura-gold` em 0.06 nelas, uma por vez.
- **`.service__link:hover svg { transform: translateX(4px) }`** (linha ~784) era um deslize de ícone **pré-existente**, fora do Bloco 4. **RESOLVIDO no Bloco 6**: o deslize saiu (o Bloco 4 já havia removido todo movimento de ícone dos botões).
- **O `:focus-within` de `.card` e `.program` é CSS morto hoje** (Bloco 6): nenhum desses cards tem elemento focável (só o `.service--feature`, que tem o `.service__link`). Fica como gancho para quando um card ganhar link; nada regride.
- **A costura de 1px usa `--border-gold`** (~1,6:1 sobre o creme, Bloco 6). É filete decorativo de 1px no topo da faixa — não é texto (1.4.3) nem gráfico necessário (1.4.11). Mesma classe do minor do Bloco 1; ajuste opcional de 1 linha (`--gold-on-cream`).
- **As demais seções escuras seguem sem fallback de impressão** (texto claro sobre papel branco, Bloco 6). Pré-existente e fora do escopo; só o badge do Sobre foi corrigido, porque o bloco passou a ser dono daquela superfície.
- **`.band-light .btn--ghost` é CSS morto hoje**: a única seção `.band-light` é `#sobre`, que não tem botão nenhum. As duas regras seguem coerentes (preenchimento `--gold-light` × texto `--cream-ink` = 11,14:1) para uma eventual faixa clara.
- **`--shadow-gold` ficou órfão** (o hover do dourado agora usa um literal `rgba(212,175,55,.10)`); `--sheen` já estava órfão antes deste bloco. Não removidos: a constraint proíbe alterar tokens existentes.
- **No fantasma preenchido o contraste fica em 4,55:1** — passa, mas por 0,05. Só reprovaria se `--text` ou `--gold-deep` mudassem.
- **O selo "Ampliar" pode encostar num nome de tile muito longo** em larguras estreitas (o selo é absoluto no canto inferior direito e o nome cresce da esquerda). Nos 8 nomes atuais há folga; se entrar um nome longo, é só encurtar o selo ou subir o nome.

### Próximo bloco

**Bloco 7 — Layout editorial (respiro, full-bleed, depoimentos, marquee).** *(O Bloco 6 está commitado em `e003f97` e **aprovado** pelo gate visual — "tudo validado até então", 16/10.)*

---

## Design acordado (resumo)

- **Identidade preservada:** preto `#0C0A09` + dourado `#D4AF37`; Playfair Display / Inter. Nada disso muda.
- **Três recursos aprovados pelo humano:**
  1. **Brilho dourado metálico** em pontos escolhidos (hero `<em>cenário</em>`, alguns títulos, wordmark).
  2. **Fundo "vivo" procedural em CSS** (auras douradas lentas + grão fino, ~3–6% opacidade) — sem vídeo.
  3. **Sem extração de Instagram.** Imagens seguem placeholders; originais podem entrar depois.
- **Caminho técnico:** zero dependências; motion em CSS + JS vanilla; Ken Burns no hero (sem vídeo real, já que não há ffmpeg nem clipe).
- **Ainda em aberto (defaults propostos aqui):** quais seções recebem o fundo vivo (piloto em 1 e depois replicar); vídeo real no hero (slot preparado, sem arquivo); nível de ousadia do movimento. → **Resolvido na execução dos Blocos 1 a 3; ver "Status de execução" no topo deste arquivo.**

## Global Constraints

- **Zero dependências novas** de runtime. Não adicionar `node_modules` ao site nem CDNs. GSAP é proibido fora do Bloco 9 (opcional).
- **Só animar `transform` e `opacity`** (e `background-position` apenas onde explicitamente indicado). Nunca animar `width/height/top/left/filter`.
- **`prefers-reduced-motion: reduce`** → todo movimento para em estado final legível (congelar, não esconder).
- **Fallback sem JS:** o conteúdo nunca pode ficar invisível se `main.js` falhar (o padrão atual de remover `.js` deve ser mantido).
- **Contraste:** texto normal ≥ 4.5:1, texto grande/negrito ≥ 3:1, contra o fundo composto real. O gradiente dourado não pode derrubar título abaixo de 3:1.
- **Não alterar conteúdo textual, dados, SEO, formulário nem `privacidade.html`.**
- **Não alterar `--gold` nem os nomes de token existentes** — só adicionar.
- **Cada bloco termina com commit próprio** e um **gate de validação visual** do humano.
- **Autocontido por bloco:** um agente novo deve conseguir executar um bloco lendo apenas o Bloco 0 (tokens) + o bloco em questão.

## Review Focus (falhas prováveis que os testes automáticos não pegam)

1. **Jank de `backdrop-filter` no mobile** — muitas superfícies de vidro roláveis; esperado: no máximo 1–2 por tela.
2. **Contraste**: gradiente dourado claro sobre fundo claro (`band-light`) fica ilegível. Esperado: títulos em faixa clara manterem contraste.
3. **Movimento sempre-ligado** — sheen/aura contínuos cansam e gastam bateria; esperado: congelar em reduced-motion e manter baixa intensidade.
4. **Overflow horizontal** com auras full-bleed; esperado: nada de barra horizontal.
5. **Reveal falhando** e deixando conteúdo oculto (se `.js` não for removida no erro); esperado: texto sempre visível.
6. **Conflito de `transform`** entre parallax do hero (JS inline) e Ken Burns (CSS); esperado: nenhum "pulo" ao rolar.

---

## Como validar (gate visual de cada bloco)

1. Abrir `index.html` no navegador. (Alternativa com servidor: `npx --yes serve .` na pasta do projeto.)
2. Testar em janela larga **e** estreita (arraste até ~375px).
3. Testar com **"Reduzir movimento"** ligado no SO (ou DevTools → Rendering → Emulate `prefers-reduced-motion`).
4. Testar **sem JS** (DevTools → desabilitar JavaScript) — conteúdo deve aparecer normalmente.
5. Conferir: sem barra de rolagem horizontal; texto legível; nada "piscando" sem parar.
6. Rodar `npm test` (garante que o formulário/JS existente segue verde).

---

## Bloco 0 — Fundação: tokens de movimento/material + grão cinematográfico

**Objetivo:** criar os tokens que todos os blocos usam e inserir o grão de filme global (primeira mudança visível, sutil).

**Arquivos:**
- Modify: `assets/css/tokens.css` (`:root`, após o bloco "Motion", ~linha 95)
- Modify: `assets/css/styles.css` (nova seção "2b. Grão", após o reset ~linha 61)

**Interfaces:**
- Produces (tokens novos em `:root`):
  - Movimento: `--ease-cinema: cubic-bezier(0.16,1,0.3,1)`, `--ease-soft: cubic-bezier(0.65,0,0.35,1)`, `--dur-reveal-lg: 760ms`, `--dur-icon: 220ms`
  - Ouro metálico: `--gold-hi: #F3E1A3`, `--gold-metal: linear-gradient(135deg,#F3E1A3 0%,#D4AF37 38%,#A16207 72%,#E8CD6B 100%)`, `--sheen: linear-gradient(105deg,transparent 30%,rgba(255,255,255,.5) 48%,transparent 66%)`
  - Material: `--grain-opacity: .035`, `--aura-gold: rgba(212,175,55,.10)`

- [x] **Step 1:** Em `tokens.css`, adicionar os tokens acima logo após o bloco `/* --- Motion --- */` existente.
- [x] **Step 2:** Em `styles.css`, na seção de reset, adicionar o grão global (tile SVG pequeno, repetido — barato):

```css
body::after {
  content: ""; position: fixed; inset: 0; z-index: 5; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  background-size: 140px 140px;
  opacity: var(--grain-opacity);
  mix-blend-mode: overlay;
}
```

- [x] **Step 3:** Adicionar clamp em reduced-motion (não é movimento, mas manter coerência): nada a fazer — o grão é estático.
- [x] **Step 4 (validação):** Executar o checklist do topo. Esperado: textura fina quase imperceptível; nada mais muda.

**Validação visual (gate):** o grão aparece sutil, sem sujar o texto nem escurecer demais. Intensidade ajustável via `--grain-opacity` (propor 0.025–0.05).

**Commit:** `feat(ux): tokens de movimento/material e grão cinematográfico global`

---

## Bloco 1 — Ouro metálico (gradiente + brilho)

**Objetivo:** dourado com aparência de metal, com um brilho lento passando.

**Arquivos:**
- Modify: `assets/css/styles.css` (novos utilitários; ajuste em `.hero__title em` ~linha 460 e `.eyebrow::before` ~linha 140)
- Modify: `index.html` (adicionar classe `text-gold-metal` a `.brand__name` e a 1–2 `.section-title` — opcional, validar com o humano)

**Interfaces:**
- Consumes: `--gold-metal`, `--sheen`, `--gold-hi`, `--gold-deep`, `--ease-cinema` (Bloco 0).
- Produces: utilitário `.text-gold-metal` e keyframe `@keyframes gold-sheen`.

- [x] **Step 1:** Adicionar o utilitário (gradiente estático; já é o "metal"):

```css
.text-gold-metal {
  background-image: var(--gold-metal);
  background-size: 220% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
```

- [x] **Step 2:** Aplicar no `<em>cenário</em>` do hero: `.hero__title em { background-image: var(--gold-metal); ... -webkit-background-clip:text; color:transparent; }` (substituindo o `color: var(--gold)` atual).

- [x] **Step 3:** Brilho lento **só no hero** (1 elemento animado por view). Animar a posição do gradiente:

```css
@keyframes gold-sheen { 0%{background-position:180% 50%} 100%{background-position:-80% 50%} }
.hero__title em { animation: gold-sheen 9s linear infinite; }
@media (prefers-reduced-motion: reduce) { .hero__title em { animation: none; background-position: 35% 50%; } }
```

- [x] **Step 4:** Hairlines douradas com fade: `.eyebrow::before { background: linear-gradient(90deg, var(--gold), transparent); }`.
- [x] **Step 5 (validação):** checklist + verificar contraste do `<em>` (o stop mais escuro é `#A16207`; sobre o scrim escuro passa). Ajustar duração (6–12s) conforme preferir.

**Validação visual (gate):** o "cenário" parece metal sob luz, sem virar "neon". Se exagerado, reduzir amplitude do gradiente.

**Commit:** `feat(ux): dourado metálico com brilho sutil no hero e hairlines`

---

## Bloco 2 — Fundo "vivo" procedural (auras douradas)

**Objetivo:** dar vida a uma seção com auras douradas que derivam lentamente + o grão (já global). **Piloto em 1 seção**, depois replicar para as escolhidas.

**Arquivos:**
- Modify: `assets/css/styles.css` (nova seção "8b. Aura")

**Interfaces:**
- Consumes: `--aura-gold`, `--ease-soft` (Bloco 0).
- Produces: classe `.section--aura` (aplicável a qualquer `.section`).

- [x] **Step 1:** Implementar com pseudo-elementos (sem tocar no HTML), usando gradientes radiais **pré-suavizados** (sem `filter: blur`, que é caro):

```css
.section--aura { position: relative; overflow: hidden; isolation: isolate; }
.section--aura > .container { position: relative; z-index: 1; }
.section--aura::before,
.section--aura::after {
  content: ""; position: absolute; inset: -20%;
  z-index: 0; pointer-events: none; will-change: transform;
  background:
    radial-gradient(38% 42% at 22% 28%, var(--aura-gold), transparent 70%),
    radial-gradient(32% 36% at 78% 70%, var(--aura-gold), transparent 72%);
}
.section--aura::after { background:
    radial-gradient(30% 34% at 70% 22%, rgba(232,205,107,.07), transparent 72%),
    radial-gradient(34% 38% at 28% 78%, rgba(212,175,55,.09), transparent 74%); }
@keyframes aura-drift { from{transform:translate3d(-2%,-1.5%,0) scale(1)} to{transform:translate3d(2%,1.5%,0) scale(1.08)} }
.section--aura::before { animation: aura-drift 46s var(--ease-soft) infinite alternate; }
.section--aura::after  { animation: aura-drift 62s var(--ease-soft) infinite alternate-reverse; }
@media (prefers-reduced-motion: reduce) { .section--aura::before, .section--aura::after { animation: none; } }
```

- [x] **Step 2:** Aplicar `section--aura` em **uma** seção piloto (sugestão: `#como-funciona` ou `#formacoes`). Validar intensidade.
- [x] **Step 3:** Após aprovação, replicar nas demais seções escuras escolhidas pelo humano (uma por vez, validando).
- [x] **Step 4 (validação):** conferir overflow horizontal e legibilidade do texto sobre a aura.

**Validação visual (gate):** "vivo" mas quase imperceptível (mire em 3–6%). Se aparecer como mancha, baixar para `--aura-gold: rgba(212,175,55,.06)`.

**Commit:** `feat(ux): fundo vivo com auras douradas (piloto em uma seção)`

---

## Bloco 3 — Movimento de entrada (reveals + split-text do H1)

**Objetivo:** melhorar a coreografia de entrada da página com o ease "cinema" e revelar o H1 palavra por palavra.

**Arquivos:**
- Modify: `assets/css/styles.css` (seção "19. Reveal" ~linha 1415)
- Modify: `assets/js/main.js` (novo passo: split do H1; ~antes do bloco de reveals existente)
- Modify: `index.html` (nada obrigatório — o split é aplicado por JS)

**Interfaces:**
- Consumes: `--ease-cinema`, `--dur-reveal-lg`, `--dur-stagger` (Bloco 0).
- Produces: classes `.word` / `.word__inner`; comportamento só quando `.js` presente.

- [x] **Step 1:** Trocar o ease dos reveals para `--ease-cinema` e alongar: `.js [data-reveal] { transition: opacity var(--dur-reveal-lg) var(--ease-cinema), transform var(--dur-reveal-lg) var(--ease-cinema); }`.
- [x] **Step 2:** Reveal de imagem com máscara: aplicar em `.about__media img` e `.hero__media` via clip-path animado (`inset(0 0 100% 0)` → `inset(0)`), dentro de `[data-reveal]`.
- [x] **Step 3:** Split-text do H1 em JS (palavra por palavra, inline-block → reflui sozinho):

```js
/* só quando há JS e não há reduced-motion */
var h1 = $('.hero__title');
if (h1 && !prefersReduced()) {
  h1.innerHTML = h1.textContent.trim().split(/\s+/).map(function (w, i) {
    return '<span class="word" style="--i:' + i + '"><span class="word__inner">' + w + '</span></span>';
  }).join(' ');
}
```

```css
.word { display: inline-block; overflow: hidden; vertical-align: top; }
.word__inner { display: inline-block; transform: translateY(110%); animation: word-up .8s var(--ease-cinema) forwards; animation-delay: calc(var(--i) * 60ms); }
@keyframes word-up { to { transform: none; } }
@media (prefers-reduced-motion: reduce) { .word__inner { transform: none; animation: none; } }
```

- [x] **Step 4:** Garantir fallback: se `main.js` falhar, o H1 permanece como está (o split só roda dentro de `main()`).
- [x] **Step 5 (validação):** checklist (inclui **sem JS** → H1 visível inteiro; reduced-motion → sem movimento).

**Validação visual (gate):** o título "monta" palavra a palavra; reveals chegam desacelerando (não "batendo").

**Commit:** `feat(ux): coreografia de entrada com split-text e reveals cinematográficos`

---

## Bloco 4 — Botões e links (micro-interações)

**Objetivo:** dar lustro e resposta tátil aos botões dourados e aos links.

**Arquivos:**
- Modify: `assets/css/styles.css` (seção "5. Botões" ~linha 186; `.section-cta a`)

**Interfaces:**
- Consumes: `--sheen`, `--dur-hover`, `--dur-icon` (Bloco 0); `.btn`, `.btn--gold` existentes.
- Produces: nenhum token novo.

- [x] **Step 1 (revisado em 16/10 no gate):** Preenchimento do botão da esquerda para a direita no hover — camada `.btn::before` atrás do rótulo, só com `transform`. Substituiu o sheen branco do plano original (que era "brilho forte demais"):

```css
.btn {
  --btn-fill: transparent; /* cada variante escolhe o tom */
  position: relative; overflow: hidden; isolation: isolate;
}
.btn::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: var(--btn-fill);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s var(--ease-cinema), opacity var(--dur-icon) var(--ease-hover);
  pointer-events: none;
}
.btn:hover::before { transform: scaleX(1); }
.btn:active::before { opacity: 0.88; }  /* pressão sem mover o rótulo */

.btn--gold  { --btn-fill: var(--gold-light); }                    /* rótulo escuro segue legível */
.btn--ghost { --btn-fill: var(--gold-deep); }                     /* rótulo claro segue legível */
.band-light .btn--ghost { --btn-fill: var(--gold-light); }        /* rótulo escuro segue legível */
```

> O `translateY(-2px)` que o `.btn:hover` trazia de antes foi **removido** (era ele que fazia a palavra "subir" no hover). O fundo base não muda no hover — quem clareia é a varredura.

- [x] **Step 2 (REMOVIDO em 16/10 no gate):** o micro-movimento da seta (`translateX(3px)`) foi retirado a pedido do humano. O seletor `.btn:hover svg` pegava também o glifo do WhatsApp, que fica à *esquerda* do rótulo — dois ícones andando em direções diferentes. Sobrou só `.btn svg { flex: none; }`.
- [x] **Step 3:** Sublinhado desenhado nos links de texto: `.section-cta a { background: linear-gradient(var(--gold),var(--gold)) left bottom / 0% 1px no-repeat; transition: background-size .3s var(--ease-cinema); } .section-cta a:hover { background-size: 100% 1px; }` (remover o `text-decoration`).
- [x] **Step 4:** reduced-motion: a varredura é `transform` e o bloco global de `prefers-reduced-motion` já a congela no estado final (preenchido); a seta fica parada. Nada a desativar além disso.
- [x] **Step 4b (divergência):** `@media (forced-colors: active) { .section-cta a { text-decoration: underline } }` — no Alto Contraste o `background-image` é anulado e o sublinhado desenhado sumiria, deixando o link distinguível só pela cor (WCAG 1.4.1).
- [ ] **Step 5 (validação):** hover nos botões do hero, header e formulário.

**Validação visual (gate):** o botão **se preenche de dourado da esquerda para a direita**, sem brilho forte e **sem a palavra se mover** no hover.

**Commit:** `feat(ux): micro-interações de botões e links`

---

## Bloco 5 — Galeria e lightbox

**Objetivo:** hover rico e "premium" nos tiles; lightbox mais cinematográfico.

**Arquivos:**
- Modify: `assets/css/styles.css` (seção "10. Galeria" ~linha 729; "Lightbox" ~linha 809)
- Modify: `index.html` (adicionar `<span class="tile__zoom">Ampliar</span>` em cada `.tile` — 8 repetições) *(opcional; validar)*

**Interfaces:**
- Consumes: `--ease-cinema`, `--dur-slow` (Bloco 0); `.tile`, `.tile__overlay` existentes.
- Produces: `.tile__zoom`, estados de abertura do lightbox.

- [x] **Step 1 (ajustado):** hover do tile — imagem com zoom `scale(1.06)` em `--dur-slow` + `--ease-cinema`, overlay subindo 4px com fade (`opacity .94 → 1`) e o halo do rótulo. *(O zoom já existia em `1.04` com `--ease-reveal`; o bloco ajusta.)*
- [x] **Step 2:** Hairline dourada que varre a base no hover: `.tile::after` (`scaleX(0)`→`scaleX(1)`, `transform-origin: left`, `0.4s var(--ease-cinema)`).
- [x] **Step 3:** Afordância "Ampliar": `.tile__zoom` escondido (`opacity 0`, `translateY(6px)`) → visível no hover/foco. Selo **decorativo** (`aria-hidden`): o nome acessível do tile já começa com "Ampliar: ".
- [x] ~~**Step 4:** Animação de abertura do lightbox: `.lightbox[open] { animation: lb-in … }` + legenda subindo~~ — **revertido no gate (16/10)**: o humano viu a entrada engasgar e pediu para retirá-la. O lightbox entra **instantâneo**, sem animação nenhuma (o `::backdrop` também é estático). Ver "Regressão corrigida" abaixo.
- [x] **Step 5:** reduced-motion: sem zoom do tile (`transform: none`, já existia) e sem varredura animada. Com a abertura do lightbox sem animação (Step 4 revertido), não há mais nada a congelar lá.
- [x] **Step 6 (validação):** passar o mouse nos 8 tiles; abrir/fechar o lightbox com teclado (Esc) e clique no fundo. — **validado pelo humano em 16/10** ("validado"), na versão sem animação de abertura.

**Regressão corrigida (revisão do gate, 16/10):** o item "ao abrir o lightbox parece dar uma travadinha" virou investigação de causa raiz. Causas medidas: (a) o diálogo abria apontando o `<img>` para a versão grande (`data-full`, w=1600) — uma URL que o **srcset do tile nunca pede** (o tile para em w=1200) — então os primeiros quadros da animação de entrada rodavam sobre uma caixa **sem imagem** e a foto chegava no meio deles; (b) no fechamento, `src = ''` resolve para a **URL do documento**, então o navegador pedia a própria página como imagem, o load falhava e o handler de erro do `main.js` injetava a **imagem de reserva** — que era justamente o que aparecia no começo da abertura seguinte; (c) o `<img>` do lightbox declara 1200x800 (3:2) e cinco das oito fotos não são 3:2, então onde o `max-height: 76vh` não segura a caixa o diálogo ainda mudava de altura quando a imagem chegava. Agora o diálogo abre **já com o bitmap que o tile está mostrando** (mesma foto, mesma proporção, já decodificada) e a versão grande entra por cima **depois do `decode()`**; no fechamento o atributo `src` é **removido** em vez de zerado. Coberto por `tests/lightbox-abertura.luxo.test.mjs` (11 testes, RED-first: 6 falhavam). **Segunda rodada, mesmo dia:** mesmo com a correção o humano ainda viu o engasgo e pediu para retirar a animação — feito: a entrada em `scale`/`fade` do diálogo e o sobe-e-desce da legenda saíram, junto com o reset de `animation-delay` que só existia por causa deles. O lightbox agora abre instantâneo. *(A correção do `main.js` ficou: ela conserta defeitos medidos — a imagem de reserva que piscava antes da foto, a mudança de altura e o pedido da própria página como imagem —, não "movimento".)*

**Validação visual (gate):** o tile "respira" e convida ao clique; o lightbox **abre instantâneo**, sem animação de entrada, sem piscar a imagem de reserva antes da foto e sem mudar de altura. — **✅ aprovado pelo humano em 16/10** ("validado").

**Commit:** `feat(ux): galeria e lightbox com hover rico e abertura cinematográfica`

---

## Bloco 6 — Cards, superfícies e vidro fumê

**Objetivo:** spotlight dourado seguindo o cursor nos cards; vidro fumê nos poucos lugares certos; costura entre faixas.

**Arquivos:**
- Modify: `assets/css/styles.css` (seção "9. Grades e cartões" ~linha 500; nova seção "Glass" — ficou como "19c", no fim)
- Modify: `assets/js/main.js` (spotlight: setar `--mx/--my` nos cards via `pointermove` com rAF — alvos: `.card`, `.service`, `.service--feature`, `.program`)
- Modify: `index.html` (aplicar `.glass` — **só** no `.about__badge`; o `.lightbox__caption` não recebe vidro e o header usa o mesmo idioma por declaração própria, sem a classe)

**Interfaces:**
- Consumes: `.card`, `.about__badge`, `.lightbox__caption` existentes e tokens **anteriores** (`--dur-hover`, `--ease-hover`, `--border-gold`, `--border-gold-strong`, `--surface-2`, `--shadow-md`). **Correção:** ao contrário do que este bloco supunha, ele **não** consome nenhum token novo do Bloco 0 — o glow usa o literal `rgba(212,175,55,.12)` herdado do featured, e `--aura-gold` continua consumido só pelas auras (Bloco 2).
- Produces: classe `.glass` (hoje com 1 consumidor: o badge do Sobre).

**Adendo (16/10/2026, pedido do humano): featured no hover**

Os cards de `#servicos` (`.service`), `#formacao` (`.program`) e `#como-funciona` (`.card`)
passam a ter o **visual padrão em repouso** e recebem a **pele do featured no hover /
`:focus-within`**, com transição suave: borda ouro forte + glow radial dourado no topo (o mesmo
idioma de `.service--feature` / `.program--featured`). `#como-funciona` não tem variante featured
hoje — o visual featured é **estendido ao `.card`**.

Notas de execução (a resolver neste bloco, antes de escrever):
- **Só a pele, não o layout.** O hover troca cor/borda/glow. `.service--feature` é vertical e
  `.service` é horizontal; `.program` vive numa grade de 3 colunas — nada disso muda no hover.
- **Como transicionar.** Gradiente não é animável → a camada de glow vai num pseudo-elemento com
  `opacity: 0 → 1` (respeita "só animar `transform`/`opacity`"); a `border-color` transiciona só.
- **Quirk de especificidade a corrigir.** Hoje `.program:hover` (0,2,0) sobrepõe
  `.program--featured` (0,1,0): passar o mouse no card featured **apaga** o glow radial e achata o
  fundo em `--surface-2`, além de enfraquecer a borda (`--border-gold` < `--border-gold-strong`).
  Mesmo risco latente em `.card:hover` / `.service:hover` quando ganharem glow.
- **Pseudo-elementos.** O glow do featured **não pode** usar `.card::before` (reservado ao
  spotlight do cursor, Step 3). Usar `::after` para o glow — **ou** fundir glow e spotlight no
  mesmo `::before` (o spotlight já é um radial dourado no cursor: é quase o mesmo efeito).
  Decidir antes de escrever.
- **Touch/teclado.** Sem hover no touch → abrir também em `:focus-within`.
- **Decisão do humano (16/10/2026).** `#servicos` e `#formacao` tinham **1 card destacado de
  propósito** ("hierarquia, sem card soup"); com todos padrão em repouso, a hierarquia passa a
  existir **só no hover**. Aceito.
- **Contenção.** As 3 seções já têm `section--aura` (Bloco 2); o glow do featured deve ficar
  discreto para não somar com a aura (Review Focus #3).

**Resolvido na execução (16/10):** o glow ficou num `::after` por card (spotlight fundido nele, não no `::before`); o vidro entrou em 2 pontos (`.nav` refinado por declaração, **sem** a classe, e `.about__badge` com `.glass`); o alpha da barra caiu de `.72` para `.55`; a hairline do `.service--feature` foi junto para o hover; o `.program--featured` perdeu a regra (classe inerte no HTML); o glow é uma regra só, de `520px 320px`, para os quatro tipos; e **sem** glow permanente em reduced-motion (o snippet do Step 3 seria brilho perpétuo). Detalhes e custos em `.superpowers/sdd/2026-10-16-garces-luxo-plano/progress.md` (Task 6 e Task 6 rev 1).

- [x] **Step 1:** Utilitário de vidro fumê (feito; o `@supports` testa os **dois** prefixos e o badge ganhou fallback de `@media print`):

```css
.glass {
  background: rgba(12,10,9,.55);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid transparent;
  background-clip: padding-box;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06), var(--shadow-md);
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: rgba(12,10,9,.92); } }
```

- [x] **Step 2:** Vidro fumê **apenas em 1–2 pontos por tela**: header (o `.nav` foi refinado para o mesmo idioma, **sem** a classe `.glass` — para não brigar com `.is-scrolled` a `.94` nem com o painel do menu mobile) e `.about__badge` (com a classe, mantendo a borda ouro forte). Os **controles do lightbox ficaram fora**: seria blur dentro do blur do `::backdrop`, invisível na prática e com o custo de raster que é a hipótese (B) do engasgo do Bloco 5. O painel do menu mobile (`.98` + blur 14) também ficou intocado. **Não** aplicado em `.card`, `.form`, `.program`, `.coverage__cta-banner` (ficam sobre fundo chapado) — como previsto.
- [x] **Step 3:** Spotlight dourado no hover dos `.card` (JS seta variável; CSS desenha). **Executado com duas divergências do snippet abaixo:** (a) o glow/spotlight mora num `::after` (o `::before` ficou livre), com `z-index: -1` + `isolation: isolate` no card; (b) a regra é **única** para `.card`, `.service`, `.service--feature` e `.program` (`radial-gradient(520px 320px at var(--mx, 50%) var(--my, 0%), rgba(212,175,55,.12), transparent 70%)`), e **a pedido do gate o cursor segue nos três** — `#servicos`, `#formacao` e `#como-funciona` (o listener deixou de ser `$$('.card')`). Em reduced-motion **não** há glow permanente: o bloco global da seção 20 zera as durações e a troca hover/foco é instantânea. Snippet original, mantido para referência:

```css
.card::before { content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background: radial-gradient(220px 220px at var(--mx,50%) var(--my,50%), var(--aura-gold), transparent 70%);
  opacity: 0; transition: opacity var(--dur-hover) var(--ease-hover); }
.card:hover::before { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .card::before { opacity: .6; } }
```

- [x] **Step 4:** Costura entre faixas (escuro↔claro): `::before` de 1px em gradiente (`transparent → var(--border-gold) → transparent`) no topo de `.section--soft` **e** `.band-light` (a `border-top` cinza da soft saiu — a costura a substitui). `position: relative` nas duas faixas para ancorar o pseudo.
- [x] **Step 5 (validação):** testar no mobile (vidro pesado!) e no desktop. — **✅ aprovado pelo humano em 16/10** ("tudo validado até então"), já com o spotlight seguindo o cursor nas três seções.

**Validação visual (gate):** card acompanha o cursor com um brilho discreto; o vidro aparece só onde há fundo rico; e os cards de `#servicos`, `#formacao` e `#como-funciona` recebem a pele featured **no hover** (borda + glow), voltando ao padrão em repouso. — **✅ aprovado pelo humano em 16/10.** Números medidos: muted sobre o glow no pior ponto 4,73:1; título sobre o glow 11,02:1; texto do badge sobre o vidro 16,63:1 (18,04:1 no fallback); muted da barra a `.55` sobre o scrim do hero 6,57:1.

**Commit:** `feat(ux): spotlight nos cards, vidro fumê e costura entre faixas` → em ASCII, pela convenção do repo: `e003f97 feat(ux): spotlight nos cards, vidro fume e costura entre faixas` *(amendado de `00aa182` quando o gate pediu o spotlight também em `#servicos`/`#formacao`; `00aa182` fica no reflog)*.

---

## Bloco 7 — Layout editorial (respiro, full-bleed, depoimentos, marquee)

**Objetivo:** dar "revista de luxo" — mais espaço, uma quebra full-bleed, depoimentos editoriais e (opcional) um marquee.

**Arquivos:**
- Modify: `assets/css/tokens.css` (`--section-y`)
- Modify: `assets/css/styles.css` (`#depoimentos`, nova seção full-bleed, `.marquee`)
- Modify: `index.html` (nova seção `.bleed` entre `#galeria` e `#formacao`; marquee opcional)

**Interfaces:**
- Consumes: tokens do Bloco 0.
- Produces: `.bleed`, `.marquee`.

- [ ] **Step 1:** Reverter o respiro para mais generoso: `--section-y: clamp(72px, 9vw, 128px);` (validar; foi reduzido no último commit remoto).
- [ ] **Step 2:** Seção full-bleed com uma imagem (parallax leve, opcional) ocupando a largura total — usar um `<figure class="bleed">` com `width:100vw; margin-inline: calc(50% - 50vw)`.
- [ ] **Step 3:** Depoimentos editoriais: aspas grandes decorativas, mais respiro, avatar opcional, stagger do Bloco 3.
- [ ] **Step 4 (opcional):** marquee lento de tipos de evento (pausável no hover/focus; estático em reduced-motion).
- [ ] **Step 5 (validação):** conferir ritmo vertical e overflow.

**Validação visual (gate):** a página "respira"; a quebra full-bleed cria pausa dramática.

**Commit:** `feat(ux): layout editorial com respiro, full-bleed e depoimentos`

---

## Bloco 8 — Hero: Ken Burns + slot de vídeo

**Objetivo:** fazer o hero "se mexer" de leve (Ken Burns) e deixar **pronto** o espaço para um vídeo futuro (sem arquivo agora).

**Arquivos:**
- Modify: `index.html` (envolver a mídia num wrapper `.hero__mediawrap`; comentário de slot de vídeo)
- Modify: `assets/css/styles.css` (`.hero__mediawrap`, Ken Burns)
- Modify: `assets/js/main.js` (reconciliar: parallax seta **variável** em vez de sobrescrever `transform`)

**Interfaces:**
- Consumes: nada novo.
- Produces: `.hero__mediawrap`; variável `--hero-y`.

- [ ] **Step 1:** Criar o wrapper para evitar conflito de `transform` entre parallax (JS) e Ken Burns (CSS).
- [ ] **Step 2:** Ken Burns no wrapper (movimento lento e alternado, 24s):

```css
.hero__mediawrap { position:absolute; inset:0; z-index:-1; overflow:hidden; }
.hero__mediawrap .hero__media { position:absolute; inset:0; }
.js .hero__mediawrap { animation: kb 24s var(--ease-soft) infinite alternate; will-change: transform; }
@keyframes kb { from { transform: scale(1.06); } to { transform: scale(1.14) translateY(-1.5%); } }
@media (prefers-reduced-motion: reduce) { .js .hero__mediawrap { animation: none; } }
```

- [ ] **Step 3:** Ajustar o JS do parallax para setar `--hero-y` no wrapper e compor no CSS (`transform: translate3d(0,var(--hero-y,0),0)` num contexto que não conflite com a animação do wrapper — parallax no `img`, Ken Burns no wrapper).
- [ ] **Step 4:** Adicionar o slot de vídeo comentado (poster = imagem atual, `muted loop playsinline preload="none"`), **sem** fonte — para ativar quando houver clipe.
- [ ] **Step 5 (validação):** rolar o hero devagar; checar que não há "pulo" nem vão nas bordas; testar reduced-motion.

**Validação visual (gate):** o fundo do hero se move com vida, sem distrair; rolagem fluida no mobile.

**Commit:** `feat(ux): hero com Ken Burns sutil e slot de vídeo preparado`

---

## Bloco 9 — Extras opcionais (só se o humano quiser)

**Objetivo:** assinaturas avançadas, uma a uma, com validação.

- [ ] **Step 1:** Cursor dourado custom (ponto/anel que cresce sobre a galeria) — **desligado em touch e reduced-motion**.
- [ ] **Step 2:** Botões magnéticos (magnetic cursor follow) — só em ponteiro fino.
- [ ] **Step 3:** `view-transition` ao abrir/fechar o lightbox (progressive enhancement).
- [ ] **Step 4:** Se (e só se) quiser coreografia avançada: avaliar GSAP — isto **quebra** a constraint de zero dependências e precisa de aprovação explícita.

**Commit:** por item, `feat(ux): <item>`.

---

## Ordem, dependências e riscos

- **Ordem recomendada:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → (9).
- **Dependência:** todos os blocos 1–9 dependem do **Bloco 0** (tokens). Se um bloco for feito em sessão nova, incluir o Bloco 0 no contexto.
- **Pode parar em qualquer ponto:** cada bloco entrega valor isolado; nenhum deixa o site "quebrado".
- **Riscos principais:** jank de vidro no mobile (Bloco 6), conflito de transform no hero (Bloco 8), excesso de movimento (todos). Mitigações estão dentro de cada bloco.
- **Rollback:** cada bloco é um commit; `git revert <hash>` desfaz só aquele bloco.

## Revisão global (depois do último bloco aprovado)

- [ ] Rodar `npm test` (verde).
- [ ] Passar por todo o **Review Focus** (6 itens do topo).
- [ ] Verificar `prefers-reduced-motion` em todas as animações novas.
- [ ] Verificar fallback sem JS em cada bloco.
- [ ] Rodar `graphify update .` (conforme `AGENTS.md`) após mexer no código.
