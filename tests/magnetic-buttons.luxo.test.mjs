/* ==========================================================================
   Luxo / Bloco 9 — botões magnéticos (item 2 do bloco opcional)

   O botão acompanha o ponteiro por no máximo 4px. As invariantes que este
   teste protege:

   1. o deslocamento é PUBLICADO em `--mag-x`/`--mag-y` (o CSS compõe no
      transform do botão; escrever `style.transform` daqui apagaria o CSS,
      como o Bloco 8 aprendeu no hero);
   2. o deslocamento satura em 4px (o botão nunca "foge" do clique; o teto
      nasceu em 6px e caiu para 4px no gate visual do Bloco 9);
   3. no centro do botão, deslocamento zero;
   4. ao sair (`pointerleave`) as variáveis somem — o botão volta ao lugar;
   5. só liga em ponteiro fino com hover; touch não recebe listener;
   6. desligado em `prefers-reduced-motion: reduce`.

   jsdom não tem layout: o `getBoundingClientRect` dos botões é fixado no boot
   (200x48 na origem), senão a conta do centro daria NaN e o teste mentiria.

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

/* Caixa fixa: 200x48 na origem. Centro = (100, 24). */
const CAIXA = {
  left: 0, top: 0, width: 200, height: 48,
  right: 200, bottom: 48, x: 0, y: 0,
  toJSON() { return this; },
};

function boot({ reduced = false, finePointer = true } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;

  /* stub POR CONSULTA: responder o mesmo para toda query faria o caminho
     testado nem rodar (o mesmo cuidado do teste dos cards) */
  window.matchMedia = (q) => ({
    matches: /prefers-reduced-motion/.test(q)
      ? reduced
      : (/hover: hover/.test(q) || /pointer: fine/.test(q)) ? finePointer : false,
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
  window.eval(mainJs);

  window.document.querySelectorAll('.btn').forEach((el) => {
    el.getBoundingClientRect = () => CAIXA;
  });

  return dom;
}

/* o rAF do jsdom dispara em ~16ms: 40ms garantem o quadro */
const flush = () => new Promise((r) => setTimeout(r, 40));

function apontar(dom, tipo, x, y) {
  const alvo = dom.window.document.querySelector('.btn');
  alvo.dispatchEvent(new dom.window.MouseEvent(tipo, {
    clientX: x, clientY: y, bubbles: true,
  }));
}

const magX = (dom) =>
  dom.window.document.querySelector('.btn').style.getPropertyValue('--mag-x');
const magY = (dom) =>
  dom.window.document.querySelector('.btn').style.getPropertyValue('--mag-y');

test('luxo/9 · o ponteiro na borda leva o botão aos 4px (e o JS não escreve transform)', async () => {
  const dom = boot();

  apontar(dom, 'pointermove', 200, 48);
  await flush();

  assert.equal(magX(dom), '4.00px', 'borda direita: satura em 4px');
  assert.equal(magY(dom), '4.00px', 'borda inferior: satura em 4px');
  assert.equal(
    dom.window.document.querySelector('.btn').style.transform,
    '',
    'o transform é do CSS — um inline apagaria o que o CSS decide'
  );
  dom.window.close();
});

test('luxo/9 · no centro do botão o deslocamento é zero', async () => {
  const dom = boot();

  apontar(dom, 'pointermove', 100, 24);
  await flush();

  assert.equal(magX(dom), '0.00px');
  assert.equal(magY(dom), '0.00px');
  dom.window.close();
});

test('luxo/9 · ao sair, as variáveis somem (o botão volta ao lugar)', async () => {
  const dom = boot();

  apontar(dom, 'pointermove', 200, 48);
  await flush();
  assert.equal(magX(dom), '4.00px', 'antes de sair, deslocado');

  apontar(dom, 'pointerleave', 200, 48);
  await flush();

  assert.equal(magX(dom), '', 'sem var, o transform cai no default 0px do CSS');
  assert.equal(magY(dom), '');
  dom.window.close();
});

test('luxo/9 · em touch (sem hover fino) não há listener nenhum', async () => {
  const dom = boot({ finePointer: false });

  apontar(dom, 'pointermove', 200, 48);
  await flush();

  assert.equal(magX(dom), '');
  dom.window.close();
});

test('luxo/9 · em movimento reduzido o botão fica parado', async () => {
  const dom = boot({ reduced: true });

  apontar(dom, 'pointermove', 200, 48);
  await flush();

  assert.equal(magX(dom), '');
  dom.window.close();
});
