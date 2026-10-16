# Relatório de Auditoria — Garcês by Balloons

**Data:** 15/10/2026
**Escopo:** landing page estática (HTML + CSS + JS puro)
**Arquivos analisados:** `index.html`, `assets/css/tokens.css`, `assets/css/styles.css`, `assets/js/main.js`, `assets/js/config.js`
**Metodologia:** leitura completa do código + base de conhecimento do skill `ui-ux-pro-max` (`products.csv`, `landing.csv`, `ux-guidelines.csv`, `html-tailwind.csv`) + verificação HTTP das 10 imagens externas.

**Nota geral: 7,5/10** — base técnica e visual muito acima da média (tokens centralizados, fallback sem JS, acessibilidade pensada), com falhas concentradas em **contraste de componentes**, **consistência de breakpoints**, **progressive enhancement** e **lacunas de conversão/SEO**.

---

## 1. Resumo executivo

| Dimensão | Nota | Situação |
|---|---|---|
| Identidade visual / tipografia | 9/10 | Dark Luxury Editorial coerente, tokens centralizados |
| Layout / grid | 6,5/10 | Boa base, mas 7 breakpoints diferentes e grid da galeria desbalanceado |
| Acessibilidade (WCAG AA) | 7/10 | Semântica e foco bons; **contraste não-textual falha** |
| Conversão (CRO) | 5,5/10 | Falta prova social, processo e faixa de preço |
| Performance | 7,5/10 | Bom, mas fontes pesadas e imagens sem `srcset` |
| SEO | 5,5/10 | Meta bons, mas **sem canonical/og:image e JSON-LD incompleto** |
| Robustez (sem JS / fallbacks) | 6/10 | Fallback de animação ótimo, mas formulário e filtros morrem sem JS |
| Consistência de código | 6,5/10 | Inline styles e nomes enganosos espalhados |

**Referência do skill aplicada:** `products.csv` → **#33 Luxury/Premium Brand** (Black + Gold + White, "elegance paramount, premium imagery, storytelling"), **#39 Wedding/Event Planning** e **#161 Home Decoration & Interior Design**. A paleta escolhida (`--gold #D4AF37`) está correta e o posicionamento "antiformal-infantil" está bem executado. O que falta é o eixo **storytelling + prova visual real**.

---

## 2. O que falta fazer (itens ausentes)

### 2.1 Conversão (prioridade alta)

1. **Seção de prova social / depoimentos** — o `landing.csv` (patterns 1, 2 e 33) recomenda prova social *antes* do CTA final. Não existe nenhuma seção de depoimento, avaliação ou contagem de eventos atendidos.
2. **Seção "Como funciona" (3 passos)** — orçamento → projeto → montagem. Reduz a fricção de quem nunca contratou o serviço.
3. **Transparência de investimento** — nem faixa de preço, nem "mínimo de X", nem "a partir de". Para serviço local B2C, é a dúvida nº 1 antes do contato.
4. **CTA de WhatsApp no header** — hoje o header só leva a `#contato`. O canal primário do negócio é WhatsApp (existe o botão flutuante, mas o header não oferece).
5. **CTA no menu mobile** — quando o menu abre (`≤1080px`), o botão "Solicitar orçamento" é escondido (`styles.css:379`) e o menu só tem links. O mobile fica **sem CTA visível com o menu aberto**.
6. **Galeria com massa crítica** — 8 imagens em grid de 3 colunas. O `landing.csv` pattern 26 (Portfolio Grid) pede "visuals first, filter by category". Recomendado **12–18 imagens** (múltiplos de 3) para preencher linhas e sustentar credibilidade.

### 2.2 SEO

7. **`canonical` + `og:url`** continuam comentados (`index.html:11-17`).
8. **`og:image` e `twitter:image` ausentes** — `twitter:card=summary_large_image` (`index.html:23`) **sem imagem é inválido**; compartilhamento sai sem preview.
9. **JSON-LD incompleto** (`index.html:49-74`): falta `url`, `image`, `telephone`, `priceRange`, `geo`. Sem `url` e `image`, o rich result de `LocalBusiness` costuma ser rejeitado.
10. **Schema `FAQPage` ausente** — há 6 perguntas em `<details>`, mas nenhum markup `FAQPage`. Oportunidade de rich result perdida.
11. **Sem `sitemap.xml` / `robots.txt`** (opcional para 1 página, mas trivial de adicionar).

### 2.3 Conformidade / jurídico

12. **Nenhum link de Política de Privacidade / LGPD** — o formulário coleta *nome, telefone e mensagem* e só há uma nota de rodapé (`index.html:771-773`). É a lacuna de conformidade mais visível para site brasileiro.
13. **Sem aviso de cookies** (necessário apenas quando houver analytics — anotar no backlog).

### 2.4 Ativos e produção

14. Sem `og:image` (1200×630), sem `apple-touch-icon`, sem `manifest`.
15. Sem `<noscript>` para as interações que dependem de JS (filtros).

---

## 3. O que precisa ser alterado

### 3.1 Contraste de componentes — falha WCAG 1.4.11 (não-textual, 3:1) — prioridade alta

`--border: #2E2A27` sobre `--bg: #0C0A09` dá **≈1,45:1**. Isso é aceitável para bordas decorativas (cards), mas **não** para a fronteira de controles interativos:

| Elemento | Onde | Problema |
|---|---|---|
| `input / select / textarea` | `styles.css:954-967` | borda 1,45:1 **e** preenchimento `--bg` sobre card `--surface` = 1,13:1 → campo quase indistinguível |
| `.filter` (chips da galeria) | `styles.css:550-560` | borda 1,45:1 sobre `--bg-soft` |
| `.nav__toggle` | `styles.css:344-352` | borda 1,45:1 |
| `.socials a/button` | `styles.css:1098-1107` | borda 1,45:1 |
| `.lightbox__close` | `styles.css:668-677` | borda 1,45:1 |

**Ação:** subir o `--border` para ~`#3F3A36` (≈3:1 sobre `--bg`) ou criar um token `--border-control` dedicado para inputs/chips/ícones. Nos inputs, aumentar também a diferença de preenchimento (ex.: `--bg-soft` ou `--surface-2`).

### 3.2 `.eyebrow` na faixa clara — contraste limítrofe

`--gold-deep #A16207` sobre `--cream #FAF5F2` = **4,55:1** (`styles.css:141`). Passa por 0,05. Em texto de 12px em caixa alta com tracking, isso é frágil.

**Ação:** escurecer para ~`#7C4A00` (≈6:1) e reservar `--gold-deep` para ícones.

### 3.3 `color-scheme` ausente — artefatos claros no tema escuro

Não há `color-scheme: dark`. Consequências reais: **lista do `<select>` branca**, **scrollbar clara** e **autofill amarelo do Chrome** estourando o dark theme.

**Ação:**
```css
:root { color-scheme: dark; }
input:-webkit-autofill {
  -webkit-text-fill-color: var(--text);
  -webkit-box-shadow: 0 0 0 100px var(--surface-2) inset;
}
```

### 3.4 `novalidate` fixo no HTML — quebra sem JS

`index.html:723` tem `novalidate` no markup. Se o JS falhar, o submit faz **GET, recarrega e perde os dados**, sem validação alguma.

**Ação:** remover `novalidate` do HTML e aplicá-lo via JS (`form.setAttribute('novalidate','')`) só quando o handler estiver ativo.

### 3.5 Filtros da galeria são inertes sem JS

Os botões `.filter` não fazem nada sem JS, e a mensagem `#gallery-empty` não é anunciada.

**Ação:** `.filters { display: none }` em CSS puro e `.js .filters { display: flex }`. Adicionar `role="status"` / `aria-live="polite"` no `#gallery-empty` para anunciar "N referências nesta categoria" (skill `ux-guidelines.csv` linha 118 — *Contextual Live Badge Updates*).

### 3.6 Lightbox sem fallback

`main.js:311` — `if (typeof lightbox.showModal !== 'function') { return; }`. Em navegador sem `<dialog>`, clicar no tile **não faz nada** (interação morta).

**Ação:** fallback para abrir `data-full` em nova aba, ou CSS `@supports not (dialog: modal)`.

### 3.7 Resumo de erro do formulário fora do padrão recomendado

O status (`#form-status`, `index.html:762`) fica **abaixo** do último campo e o foco vai para o primeiro campo inválido. O `ux-guidelines.csv` (linha 109 — *Focusable Error Summary*) recomenda: resumo **no topo do formulário**, com foco no container + links para cada campo inválido, mantendo os erros inline.

**Ação:** mover/duplicar um resumo no topo do formulário após falha de submit e usar `role="alert"` (assertive) para erro, mantendo `polite` no sucesso.

### 3.8 Nome acessível duplicado nos tiles

Cada `.tile` é um `<button>` contendo `<img alt="...">` **mais** `.tile__overlay` com categoria e nome. O leitor de tela anuncia tudo duas vezes.

**Ação:** `img alt=""` dentro do tile e `aria-label` no botão (ex.: `"Ampliar: Painel de balões — Aniversário"`).

### 3.9 Fontes pesadas

`index.html:30` carrega **Inter 300/400/500/600/700** + **Playfair Display 6 pesos + 2 itálicos** = 13 arquivos.

**Ação:** reduzir para Inter 400/600 e Playfair 600 + 600 itálico (4 arquivos). `font-display: swap` já está corretamente configurado.

### 3.10 Imagens sem `srcset`/`sizes`

As URLs Pexels usam `&w=800` / `w=1600` fixos. No mobile o usuário baixa 800px para slots de ~340px.

**Ação:** adicionar `srcset` (`w=400,800,1200`) + `sizes` por breakpoint; manter `width`/`height` (já está, ótimo).

### 3.11 Alvos de toque

`.btn--sm` e `.filter` têm `min-height: 40px` (`styles.css:229`, `552`); `.socials` tem 42px. A web exige 24px (WCAG 2.5.8), mas 44px é o confortável.

**Ação:** 44px mínimo nos `.filter` em mobile (skill `html-tailwind.csv` linha 34).

### 3.12 `.tile__cat` (dourado) sobre o gradiente do tile

O gradiente vai de transparente a `rgba(12,10,9,.94)` a partir de 55% (`styles.css:606`); o label dourado fica **na parte transparente**, sobre a foto. O contraste depende da imagem → pode falhar.

**Ação:** subir a posição inicial do gradiente ou aplicar um scrim fixo atrás do label.

### 3.13 Herói com imagem quase invisível

`.hero__media { opacity: .36; filter: ... brightness(.72) }` (`styles.css:401-410`) → a foto praticamente desaparece sob o scrim (`linear-gradient` até `.88` de opacidade).

**Ação:** validar a intenção. Se o herói é "imagem de impacto", subir `opacity` para ~.5 e aliviar o scrim superior; hoje parece um fundo vazio.

---

## 4. Varredura de inconsistências

### 4.1 Header duplica "Serviços"

`index.html:100` (`.nav__link Serviços` → `#servicos`) **e** `index.html:109` (`btn--ghost Serviços` → `#servicos`). No desktop aparecem **dois "Serviços" lado a lado** apontando para o mesmo lugar. É o achado visual mais óbvio.

→ **Corrigir:** remover o `btn--ghost` ou trocar por outro destino.

### 4.2 Sete breakpoints diferentes

`1080, 1040, 900, 820, 640, 620, 560` (mais `720` no `.wa-bubble`). Isso gera comportamento imprevisível.

→ **Padronizar em 4:** `1080 (nav) / 900 (2 colunas) / 620 (1 coluna) / 560 (galeria 1 coluna)`.

### 4.3 Grids de 3 colunas com regras diferentes

`.grid--3` faz `3 → 2 → 1` (`styles.css:468-477`), mas `.programs` faz `3 → 1` direto no `900` (`styles.css:688`) e `.gallery` faz `3 → 2 → 1` em `900/560`.

→ Alinhar o comportamento entre grades equivalentes.

### 4.4 Stagger da animação com ritmo quebrado

`styles.css:1188-1196`: delays `0, 70, 140, 210` e depois `250, 290, 330, 370, 410` — o passo muda de **70ms para 40ms** no meio. Visualmente o stagger "acelera" sem motivo.

→ Unificar num passo (60 ou 70ms) ou transformar em token `--dur-stagger` (hoje está hardcoded).

### 4.5 Nomes enganosos no HTML

`.hero__places` (`index.html:150-154`) contém **serviços** ("Decoração de eventos", "Consultoria", "Workshops"), não lugares. O eyebrow acima é que tem lugares.

→ Renomear para `.hero__tags` / `.hero__services`.

### 4.6 "Brasília-DF" vs "Distrito Federal"

O herói diz `"Brasília-DF"` (`index.html:130`); todas as outras 8 menções usam "Distrito Federal". Inconsistência de nomenclatura da área de atendimento.

→ Padronizar (sugestão: "Distrito Federal (Brasília e RAs)").

### 4.7 Rótulo "Formação" vs "Consultoria e formação"

Menu: `Formação` (`index.html:102`); eyebrow e link do rodapé: `Consultoria e formação`. Mesma seção, dois nomes.

→ Unificar.

### 4.8 Navegação do header ≠ rodapé

O header tem 6 itens; o rodapé tem 8 (inclui **Diferenciais** e **Área de atendimento**). Ou o header está incompleto, ou o rodapé duplica demais.

→ Definir a arquitetura de informação canônica.

### 4.9 Inline styles espalhados

- `index.html:484` — `style="margin-top: var(--sp-6)"`
- `index.html:738` e `754` — `style="margin-top: var(--sp-5)"`
- `index.html:838` — `style="margin-top: var(--sp-8)"`
- `styles.css:790` — `!important` no `.signature`

→ Mover para classes utilitárias (`.u-mt-6` etc.) ou para o CSS do componente. Hoje o sistema de tokens é parcialmente contornado.

### 4.10 Regra redundante

`styles.css:523` → `.grid--4 > .card { justify-content: flex-start; }` — `.card` já tem `justify-content: flex-start` (`styles.css:481-483`). Remover.

### 4.11 Faixas de seção quase invisíveis

`--bg-soft #141110` sobre `--bg #0C0A09` = **1,13:1**. O alternar `section--dark` / `section--soft` praticamente não se percebe — a página lê como um bloco único, enfraquecendo o ritmo vertical.

→ Diferenciar um pouco mais o `--bg-soft` (ex.: `#171412`) ou reforçar o `border-top` entre seções.

### 4.12 `.card__index` (números "01–04") invisíveis

`opacity: 0.06` (`styles.css:511-520`) → contraste ~1,1:1. Na prática parece sujeira/artefato de renderização.

→ Decidir: remover, ou subir para ~0.10–0.14 e virar elemento intencional.

### 4.13 `.hero__places` tipograficamente apertado

`text-transform: uppercase` + `letter-spacing: .14em` + item "Workshops para iniciantes e aperfeiçoamento" (`styles.css:449-451`) → texto longo em caixa alta com tracking fica pesado e quebra mal.

→ Reduzir tracking ou encurtar o item.

### 4.14 Fallback de erro do JS é amplo demais

`index.html:39-41` registra `window.addEventListener('error', ..., true)` em fase de captura: **erros de carregamento de imagem/script também disparam** e removem a classe `.js` (desliga todas as animações do site). Na prática o guard `__garcesReady` cobre a maioria dos casos, mas o intento "se o script falhar" ficou mais amplo.

→ Filtrar por `e.target === window` ou checar `e.error`.

### 4.15 `og:image` / Twitter card inválido

`twitter:card = summary_large_image` sem `twitter:image` (`index.html:23`) — inconsistência de meta tags.

---

## 5. Erros de layout / bugs

1. **Galeria 3 colunas com 8 itens** (`index.html:252-348`) → última linha com 1 item + 2 vazios. Composição desbalanceada num grid simétrico. *Erro de layout visível.*
2. **Margem negativa como hack** — `.gallery__note { margin: calc(-1 * var(--sp-8)) 0 ... }` (`styles.css:533`) puxa o aviso por baixo do `section-head` (que já tem `margin-bottom: 64px`). Frágil: qualquer mudança no `section-head` quebra o espaçamento.
3. **`.about__badge` em telas estreitas** — `position: absolute` com `padding: 12px 20px` e texto "RESPONSÁVEL PELA MARCA" em uppercase `.14em` (`styles.css:775-780`) pode exceder a largura da imagem em 320–360px. *Verificar em 320px.*
4. **Header apertado entre 1081–1150px** — os três grupos (brand ~120px + 6 links ~455px + 2 botões ~300px + gaps) somam ~920px, contra ~985px úteis em 1081px (gutter = 48px). Folga de ~60px; com `white-space: nowrap` nos botões e `overflow-x: hidden` no body, o CTA pode ser **cortado** se as fontes renderizarem mais largas. *Verificar e/ou subir o breakpoint para 1120px.*
5. **Sem lock de scroll no menu mobile** — com o menu aberto o body continua rolando e não há scrim atrás do painel (`styles.css:360-372`).
6. **`Escape` fecha o menu mas não devolve o foco ao toggle** (`main.js:218-220`) — o foco se perde.
7. **`.lightbox__img` sem `width`/`height`** (`index.html:872`) → pequeno deslocamento de layout ao abrir o lightbox.
8. **Clique-fora no lightbox** — o `<dialog>` tem `width: 100%` + `max-width: min(1080px, 92vw)` (`styles.css:630-636`); em telas pequenas ele ocupa quase tudo, então quase não sobra área para "clicar fora" fechar. O botão Fechar / `Esc` salvam, mas o gesto esperado falha.
9. **Print do FAQ** — `@media print { .faq__a { display: block !important } }` (`styles.css:1237`) não força a abertura de `<details>` fechado no Chrome (o conteúdo permanece oculto). Imprimir a página omite as respostas.
10. **Sem `role="status"` na contagem de filtros** (coberto em 3.5).

---

## 6. Pontos fortes (não mexer)

- Tokens centralizados (`tokens.css`) — trocar a identidade visual é 1 arquivo.
- Fallback de animação sem JS (`index.html:35-47` + classe `.js`) — bem pensado.
- Skip link, `:focus-visible`, `prefers-reduced-motion` completo (`styles.css:1201-1229`), `scroll-padding-top` para o header sticky (atende *Focus Not Obscured*, `ux-guidelines.csv` linha 100).
- `<dialog>` nativo, retorno de foco, `Esc`, `aria-pressed` nos filtros, `aria-live` no status do formulário, `required` + labels + `aria-describedby`.
- Imagens com `width`/`height`, `loading="lazy"` abaixo da dobra, `fetchpriority="high"` no herói (bom para LCP).
- Ícones SVG inline coerentes (mesma família, stroke 1.6–1.8), **zero emoji como ícone**.
- `text-wrap: balance` nos títulos e `pretty` nos parágrafos.
- Todas as 10 imagens externas retornam **HTTP 200** — nenhuma imagem quebrada.

---

## 7. Plano de ação priorizado

### P0 — antes de publicar

- [ ] Preencher `assets/js/config.js` (WhatsApp e/ou `formEndpoint`) — sem isso o site **não envia nada**
- [ ] Corrigir contraste de bordas de inputs/chips/ícones (3.1)
- [ ] `color-scheme: dark` + tratamento de autofill (3.3)
- [ ] `novalidate` via JS (3.4)
- [ ] `canonical`, `og:url`, `og:image`, `twitter:image` (2.2)
- [ ] Completar JSON-LD (`url`, `image`, `telephone`) + `FAQPage` (2.2)
- [ ] Link de Política de Privacidade / LGPD (2.3)
- [ ] Remover o "Serviços" duplicado no header (4.1)

### P1 — primeiros 30 dias

- [ ] Seção de depoimentos + "Como funciona" (2.1)
- [ ] CTA de WhatsApp no header e no menu mobile aberto (2.1)
- [ ] Galeria com 12–18 imagens reais (2.1, 5.1)
- [ ] Padronizar breakpoints em 4 e alinhar grids (4.2, 4.3)
- [ ] Filtros com fallback sem JS + live region (3.5)
- [ ] Fallback do lightbox sem `<dialog>` (3.6)
- [ ] Resumo de erro acessível no formulário (3.7)
- [ ] Reduzir pesos de fonte (3.9) + `srcset`/`sizes` (3.10)
- [ ] Corrigir o ritmo do stagger e a faixa `--bg-soft` (4.4, 4.11)
- [ ] Limpar inline styles e nomes enganosos (4.9, 4.5)
- [ ] Padronizar nomenclatura DF / "Formação" (4.6, 4.7)

### P2 — polimento

- [ ] Alvos de toque 44px em mobile (3.11)
- [ ] Scrim atrás do `tile__cat` (3.12)
- [ ] Decidir sobre `.card__index` (4.12)
- [ ] Scroll lock + retorno de foco no menu mobile (5.5, 5.6)
- [ ] Corrigir print do FAQ (5.9)
- [ ] `apple-touch-icon`, `manifest`, `robots.txt`, `sitemap.xml`
- [ ] Substituir os `alt` das fotos de banco pelo conteúdo real da imagem

### Validação final

- [ ] Lighthouse (Performance / Acessibilidade / SEO)
- [ ] Teste em **320, 375, 414, 768, 1024, 1280, 1920 px**
- [ ] Teste com *reduced motion* ativo e zoom 200%
- [ ] Teste do menu mobile aberto e do lightbox em telas pequenas

*(Referência: `ux-guidelines.csv` linhas 65–66 — teste de breakpoints.)*
