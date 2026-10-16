# Garcês by Balloons — Landing Page

Página única, estática e responsiva para a **Garcês by Balloons** — decoração com balões
para eventos, consultoria e workshops, com base em Cidade Ocidental–GO.

Feita em **HTML + CSS + JavaScript puro**, sem build e sem dependências além do
Google Fonts. As imagens vêm de uma CDN externa (referências provisórias).

---

## Como executar

Dê duplo clique em `index.html` — funciona direto no navegador.

Para desenvolver com servidor local (evita cache agressivo e melhora o teste no celular):

```bash
npx serve .
# ou, se tiver Python:
python -m http.server 5173
```

E acesse `http://localhost:5173` (ou a porta indicada).

---

## ⚠️ O que precisa ser preenchido antes de publicar

### 1. Contatos — `assets/js/config.js`

Este é o **único arquivo obrigatório**. Enquanto ele estiver vazio, o site mostra um
aviso de *modo de pré-visualização* no topo e **não envia nada para nenhum contato**.

```js
window.GARCES_CONFIG = {
  whatsapp: '',          // "5561999999999"  (só dígitos, com 55 + DDD)
  telefoneExibicao: '',  // "(61) 99999-9999" (opcional)
  email: '',             // "contato@dominio.com.br"
  instagram: '',         // "https://instagram.com/usuario"
  formEndpoint: '',      // opcional: endpoint que recebe o formulário
  ...
};
```

**Comportamento automático:**

| Situação | O que acontece |
|---|---|
| `formEndpoint` preenchido | O formulário envia os dados por `POST` (JSON) e mostra confirmação na página |
| Só `whatsapp` preenchido | O formulário abre o WhatsApp com a mensagem já montada |
| Nenhum dos dois | O formulário avisa que o envio não está configurado — **nada é enviado** |
| `whatsapp` ausente | O botão flutuante leva ao formulário em vez de abrir um contato inexistente |

Campos de contato vazios (telefone, e-mail, Instagram) ficam **ocultos** automaticamente,
inclusive no rodapé. Não há links quebrados.

### 2. Imagens — referências provisórias

As fotos são **imagens de referência de banco gratuito** (Pexels, licença livre para uso
comercial), usadas apenas para demonstrar o layout. Elas **não são trabalhos da marca** e
por isso a galeria traz um aviso visível ao visitante.

Para substituir pelas fotografias reais:

1. Crie a pasta `assets/img/`.
2. Troque os `src` das imagens (e, na galeria, também os `data-full` do lightbox).
3. **Mantenha** `width`, `height` e `alt` — evitam salto de layout e atendem acessibilidade.
4. Se quiser garantir o aviso correto, remova o bloco `.gallery__note` do `index.html`.
5. Formatos recomendados: WebP, largura máxima ~1600 px, com compressão.

Imagens usadas hoje (todas em `index.html`):

| Onde | ID Pexels |
|---|---|
| Hero | `36231146` |
| Galeria | `34260120`, `37803981`, `34708809`, `35042459`, `36352341`, `37803982`, `15396818`, `16985187` |
| Seção Sobre | `37382220` |

> A seção "Sobre" usa uma foto de **decoração**, não uma foto de pessoa — para não
> atribuir uma identidade falsa ao Caleb. Substitua por um retrato real quando houver.

### 3. SEO — domínio real

No `<head>` do `index.html` há um bloco comentado com `canonical` e `og:url`.
Descomente e aponte para o domínio real **depois** que ele existir. Enquanto isso,
essas tags ficam desativadas de propósito (não apontamos para domínio inventado).

---

## Estrutura de arquivos

```
Balloons/
├─ index.html                 → a página completa + SEO + dados estruturados
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css           → cores, tipografia, espaçamento e animação (design tokens)
│  │  └─ styles.css           → componentes e layout responsivo
│  └─ js/
│     ├─ config.js            → ✅ ÚNICO arquivo a editar antes de publicar
│     └─ main.js              → interações (menu, filtros, lightbox, formulário, contato)
└─ README.md
```

Ordem de carregamento: `tokens.css` → `styles.css` → `config.js` → `main.js` (`defer`).

---

## Seções da página

1. **Cabeçalho** — marca, navegação objetiva e botão de orçamento
2. **Hero** — título, texto curto, imagem de impacto e chamadas para ação
3. **Serviços** — as quatro modalidades (decoração, consultoria, workshop iniciantes, workshop aperfeiçoamento)
4. **Galeria** — composições filtráveis por tipo de evento, com lightbox
5. **Consultoria e formação** — destaque para orientação e capacitação
6. **Diferenciais** — apenas o que as informações fornecidas sustentam
7. **Sobre** — Caleb Garcês e a marca (sem histórico inventado)
8. **Área de atendimento** — Cidade Ocidental, cidades próximas e DF
9. **Dúvidas frequentes** — perguntas comuns, em `<details>` nativo
10. **Contato** — formulário validado + informações de contato
11. **Rodapé** — marca, navegação, atendimento e contato
12. **Botão flutuante** — WhatsApp (ou formulário, se o número não estiver configurado)

---

## Acessibilidade e desempenho

- HTML semântico, `lang="pt-BR"`, *skip link* e hierarquia correta de títulos (h1 → h3)
- Foco visível, contraste de texto conforme WCAG AA e alvos de toque ≥ 40 px
- `prefers-reduced-motion` respeitado: sem parallax e sem transições
- Fallback sem JavaScript: o conteúdo **não** fica invisível se o script falhar
- Ícones em SVG inline, sem emojis como elemento de interface
- Imagens com `width`/`height`, `loading="lazy"` e texto alternativo descritivo
- `<dialog>` nativo no lightbox (fecha com `Esc`, clique fora ou botão) com retorno de foco
- Fontes com `preconnect` e `font-display: swap`

> ℹ️ A paleta escura/dourada foi escolhida para posicionar a marca como decoração
> autoral e sofisticada, evitando o visual infantil que o segmento de balões costuma ter.

---

## Personalização de estilo

Praticamente tudo vem de variáveis em **`assets/css/tokens.css`**:

```css
--bg / --surface / --text / --gold / --wa     /* cores */
--font-display / --font-body                   /* Playfair Display + Inter */
--sp-4 … --sp-32 / --section-y                 /* espaçamento */
--dur-hover / --dur-reveal / --ease-*          /* animação */
```

Trocar a identidade visual inteira normalmente exige mexer só nesse arquivo.

---

## Checklist antes de publicar

- [ ] Preencher `assets/js/config.js` (WhatsApp e/ou `formEndpoint`)
- [ ] Preencher e-mail e Instagram (ou deixar vazio — somem sozinhos)
- [ ] Confirmar que o aviso de pré-visualização **desapareceu** do topo
- [ ] Testar o envio do formulário no celular e conferir se a mensagem chega certa
- [ ] Substituir as imagens de referência pelas fotos reais da marca
- [ ] Remover o aviso `.gallery__note` após trocar as imagens
- [ ] Descomentar e apontar `canonical` / `og:url` para o domínio real
- [ ] Revisar o `og:title` / `og:description` e adicionar `og:image` com uma foto real
- [ ] Conteúdo: revisar os textos de "Diferenciais" e "Sobre" com o Caleb
- [ ] Rodar Lighthouse (Desempenho / Acessibilidade / SEO)
- [ ] Testar em 375 px, 768 px, 1280 px e 1920 px, e com "reduzir movimento" ativo
