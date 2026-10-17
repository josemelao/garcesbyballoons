/* ==========================================================================
   Luxo / Bloco 3 — split-text do H1 (hero)

   O split é a única parte do passe de luxo com comportamento testável: ele
   reescreve os filhos do H1. Estes testes garantem que a coreografia preserva
   o markup inline (o <em> com ouro metálico do Bloco 1) e que o fallback sem
   JS / com movimento reduzido continua mostrando o título inteiro.

   Rode com: npm test
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const html = readFileSync(resolve(root, 'index.html'), 'utf8');
/* o repo usa CRLF; normalizar deixa os regexes de substituição legíveis */
const mainJs = readFileSync(resolve(root, 'assets/js/main.js'), 'utf8').replace(/\r\n/g, '\n');
const configJs = readFileSync(resolve(root, 'assets/js/config.js'), 'utf8');

const TITULO = 'Decoração com balões que transforma o seu evento em cenário';

/* Mesmo harness do form.block3.test.mjs, reduzido ao que o hero precisa. */
function boot({ reduced = false, runMain = true, mainSource = mainJs } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;

  window.matchMedia = () => ({
    matches: reduced, media: '', onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent() { return false; },
  });
  window.fetch = () => Promise.resolve({ ok: true, status: 200 });
  window.open = () => ({});
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {};
  }

  for (const s of window.document.querySelectorAll('script')) {
    if (s.type === 'application/ld+json') continue;
    if (s.getAttribute('src')) continue;
    window.eval(s.textContent);
  }

  if (runMain) {
    window.eval(configJs);
    window.eval(mainSource);
  }
  return dom;
}

const wordsOf = (dom) => Array.from(dom.window.document.querySelectorAll('.hero__title .word'));
const flatText = (dom) =>
  dom.window.document.querySelector('.hero__title').textContent.replace(/\s+/g, ' ').trim();

/* ---------------------------------------------------------------- split --- */

test('luxo/3 · com JS, o H1 vira .word > .word__inner', () => {
  const dom = boot();
  const words = wordsOf(dom);

  assert.equal(words.length, 10, 'o H1 tem 10 palavras');
  for (const word of words) {
    assert.ok(word.querySelector(':scope > .word__inner'), 'cada .word embrulha um .word__inner');
  }
  dom.window.close();
});

test('luxo/3 · o split preserva o <em>cenário</em> (ouro metálico do Bloco 1)', () => {
  const dom = boot();
  const em = dom.window.document.querySelector('.hero__title em');

  assert.ok(em, 'o <em> não pode ser destruído pelo split (era o risco do textContent)');
  assert.equal(em.textContent, 'cenário');
  assert.ok(em.closest('.word__inner'), 'o <em> entra na coreografia dentro de .word__inner');
  dom.window.close();
});

test('luxo/3 · nenhuma palavra se perde nem muda de ordem', () => {
  const dom = boot();

  assert.equal(flatText(dom), TITULO);
  assert.ok(flatText(dom).endsWith('em cenário'), 'o <em> continua no fim do título');
  dom.window.close();
});

test('luxo/3 · o stagger usa --i sequencial (0..9)', () => {
  const dom = boot();
  const indices = wordsOf(dom).map((w) => w.style.getPropertyValue('--i'));

  assert.deepEqual(indices, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  dom.window.close();
});

test('luxo/3 · rodar o main.js duas vezes não duplica o split', () => {
  const dom = boot();
  dom.window.eval(mainJs);

  assert.equal(wordsOf(dom).length, 10, 'o split é idempotente');
  dom.window.close();
});

/* ------------------------------------------------------------- fallbacks --- */

test('luxo/3 · sem JS o H1 fica inteiro, sem .word (fallback)', () => {
  const dom = boot({ runMain: false });

  assert.equal(wordsOf(dom).length, 0, 'nenhum split sem JS');
  assert.equal(flatText(dom), TITULO);
  assert.ok(dom.window.document.querySelector('.hero__title em'), 'o <em> intacto no HTML');
  dom.window.close();
});

test('luxo/3 · com movimento reduzido não há split (título estático)', () => {
  const dom = boot({ reduced: true });

  assert.equal(wordsOf(dom).length, 0, 'reduced-motion não anima palavra por palavra');
  assert.equal(flatText(dom), TITULO);
  dom.window.close();
});

/* -------------------------------------------------- a regressão evitada --- */

test('luxo/3 · a versão ingênua do plano (textContent) apagaria o <em> — o teste pega isso', () => {
  const naive = mainJs.replace(
    /\/\* -+\s*\n\s*6a\. Split-text do H1[\s\S]*?\n    \}\n\n(?=\s*\/\* -+\s*\n\s*6\. Reveal on scroll)/,
    `var h1 = $('.hero__title');
    if (h1 && !prefersReduced()) {
      h1.innerHTML = h1.textContent.trim().split(/\\s+/).map(function (w, i) {
        return '<span class="word" style="--i:' + i + '"><span class="word__inner">' + w + '</span></span>';
      }).join(' ');
    }

`
  );
  assert.notEqual(naive, mainJs, 'o snippet ingênuo do plano precisa substituir o bloco real');

  const dom = boot({ mainSource: naive });
  assert.equal(wordsOf(dom).length, 10, 'o snippet ingênuo também produz 10 palavras');
  assert.equal(
    dom.window.document.querySelector('.hero__title em'), null,
    'e é exatamente por isso que ele apagaria o ouro do Bloco 1'
  );
  dom.window.close();
});
