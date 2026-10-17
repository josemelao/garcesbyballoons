/* ==========================================================================
   Luxo / Bloco 6 — spotlight dos cards (#como-funciona)

   O glow do hover é CSS puro; o JS só move a luz para debaixo do cursor.
   As invariantes que este teste protege:

   1. só liga em ponteiro fino com hover (touch não recebe listener);
   2. escreve `--mx`/`--my` em px RELATIVOS ao card (não à viewport);
   3. no máximo uma escrita por quadro (rAF) — nunca uma por evento;
   4. desligado em `prefers-reduced-motion: reduce`;
   5. não injeta nada no DOM (o glow é CSS: sem JS o card fica como está).

   O stub de matchMedia precisa responder POR CONSULTA: o do Bloco 5 devolve o
   mesmo objeto para toda query e, com ele, o spotlight nunca ligaria — o teste
   passaria vazio. Aqui `prefers-reduced-motion` e `(hover: hover) and
   (pointer: fine)` são respondidos separadamente.

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
const mainJs = readFileSync(resolve(root, 'assets/js/main.js'), 'utf8').replace(/\r\n/g, '\n');
const configJs = readFileSync(resolve(root, 'assets/js/config.js'), 'utf8');

function boot({ reduced = false, finePointer = true, comMain = true } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;

  window.matchMedia = (q) => ({
    matches: /prefers-reduced-motion/.test(q) ? reduced : finePointer,
    media: q,
    onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent() { return false; },
  });

  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {};
  }

  for (const s of window.document.querySelectorAll('script')) {
    if (s.type === 'application/ld+json') continue;
    if (s.getAttribute('src')) continue;
    window.eval(s.textContent);
  }
  window.eval(configJs);
  if (comMain) { window.eval(mainJs); }

  return dom;
}

/* o rAF do jsdom dispara em ~16ms: 40ms garantem o quadro */
const flush = () => new Promise((r) => setTimeout(r, 40));

const cards = (dom) => Array.from(dom.window.document.querySelectorAll('.card'));
const card = (dom, i = 0) => cards(dom)[i];
const alvos = (dom, sel) => Array.from(dom.window.document.querySelectorAll(sel));

/* conta as escritas de --mx/--my feitas pelo main.js */
function espiao(dom) {
  const proto = dom.window.CSSStyleDeclaration.prototype;
  const orig = proto.setProperty;
  const calls = [];
  proto.setProperty = function (k, v) {
    if (k === '--mx' || k === '--my') { calls.push({ el: this, k, v }); }
    return orig.call(this, k, v);
  };
  return calls;
}

function mover(dom, el, x, y) {
  const ev = new dom.window.MouseEvent('pointermove', { clientX: x, clientY: y, bubbles: true });
  el.dispatchEvent(ev);
}

/* ------------------------------------------------------------- positivo --- */

test('luxo/6 · ponteiro fino: o card recebe --mx/--my do cursor', async () => {
  const dom = boot();
  const primeiro = card(dom);

  mover(dom, primeiro, 120, 40);
  await flush();

  assert.equal(primeiro.style.getPropertyValue('--mx'), '120px');
  assert.equal(primeiro.style.getPropertyValue('--my'), '40px');
  dom.window.close();
});

test('luxo/6 · a posição é relativa ao card, não à viewport', async () => {
  const dom = boot();
  const primeiro = card(dom);
  primeiro.getBoundingClientRect = () => ({ left: 40, top: 10, width: 300, height: 200, right: 340, bottom: 210, x: 40, y: 10 });

  mover(dom, primeiro, 140, 60);
  await flush();

  assert.equal(primeiro.style.getPropertyValue('--mx'), '100px', 'clientX - left do card');
  assert.equal(primeiro.style.getPropertyValue('--my'), '50px', 'clientY - top do card');
  dom.window.close();
});

test('luxo/6 · vários eventos no mesmo quadro viram UMA escrita (rAF)', async () => {
  const dom = boot();
  const primeiro = card(dom);
  const calls = espiao(dom);

  mover(dom, primeiro, 10, 10);
  mover(dom, primeiro, 20, 20);
  mover(dom, primeiro, 30, 30);
  await flush();

  /* cada rodada grava --mx e --my: o invariante é o número de RODADAS (--mx) */
  const rodadas = calls.filter((c) => c.k === '--mx');
  assert.equal(rodadas.length, 1, 'uma rodada por quadro, não uma por evento');
  assert.equal(calls.filter((c) => c.k === '--my').length, 1, '--my anda junto com --mx');
  assert.equal(primeiro.style.getPropertyValue('--mx'), '30px', 'vale a última posição');
  dom.window.close();
});

/* ------------------------------------------- mesmo spotlight nas outras seções --- */

test('luxo/6 · #formacao: o .program também recebe --mx/--my', async () => {
  const dom = boot();
  const primeiro = alvos(dom, '#formacao .program')[0];

  mover(dom, primeiro, 88, 24);
  await flush();

  assert.equal(primeiro.style.getPropertyValue('--mx'), '88px');
  assert.equal(primeiro.style.getPropertyValue('--my'), '24px');
  dom.window.close();
});

test('luxo/6 · #servicos: o .service também recebe --mx/--my', async () => {
  const dom = boot();
  const primeiro = alvos(dom, '#servicos .service')[0];

  mover(dom, primeiro, 60, 15);
  await flush();

  assert.equal(primeiro.style.getPropertyValue('--mx'), '60px');
  dom.window.close();
});

test('luxo/6 · #servicos: o card destacado (.service--feature) também recebe', async () => {
  const dom = boot();
  const destaque = alvos(dom, '#servicos .service--feature')[0];

  mover(dom, destaque, 33, 12);
  await flush();

  assert.equal(destaque.style.getPropertyValue('--mx'), '33px');
  dom.window.close();
});

/* --------------------------------------------------------------- guardas --- */

test('luxo/6 · desligado em movimento reduzido (e ligado quando não é)', async () => {
  const com = boot();
  mover(com, card(com), 50, 50);
  await flush();
  assert.equal(card(com).style.getPropertyValue('--mx'), '50px', 'controle: sem reduced-motion o spotlight funciona');
  com.window.close();

  const sem = boot({ reduced: true });
  mover(sem, card(sem), 50, 50);
  await flush();
  assert.equal(card(sem).style.getPropertyValue('--mx'), '', 'reduced-motion: nenhuma variável escrita');
  sem.window.close();
});

test('luxo/6 · desligado em ponteiro grosso (touch), ligado em ponteiro fino', async () => {
  const fino = boot();
  mover(fino, card(fino), 50, 50);
  await flush();
  assert.equal(card(fino).style.getPropertyValue('--mx'), '50px', 'controle: ponteiro fino funciona');
  fino.window.close();

  const touch = boot({ finePointer: false });
  mover(touch, card(touch), 50, 50);
  await flush();
  assert.equal(card(touch).style.getPropertyValue('--mx'), '', 'touch: nenhum listener ligado');
  touch.window.close();
});

/* ------------------------------------------------------------- invariantes --- */

test('luxo/6 · o spotlight não injeta nada no DOM (o glow é CSS)', async () => {
  const dom = boot();
  const antes = cards(dom).map((c) => c.children.length);

  cards(dom).forEach((c) => mover(dom, c, 30, 30));
  await flush();

  assert.deepEqual(cards(dom).map((c) => c.children.length), antes, 'nenhum filho novo');
  dom.window.close();
});

test('luxo/6 · sem main.js os cards seguem como no HTML (conteúdo nunca escondido)', () => {
  const dom = boot({ comMain: false });
  const primeiro = card(dom);

  assert.equal(primeiro.style.getPropertyValue('--mx'), '');
  assert.match(primeiro.textContent, /Orçamento/, 'o texto do card está lá, sem depender de JS');
  dom.window.close();
});
