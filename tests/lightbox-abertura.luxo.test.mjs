/* ==========================================================================
   Luxo / Bloco 5 — abertura do lightbox

   O que fazia a abertura parecer "travada" era o <img> do diálogo não ter
   bitmap nenhum quando ele aparecia:

   1. o diálogo abria apontando para `data-full` (w=1600) — uma URL que o srcset
      do tile nunca pede (o tile para em w=1200) — então os primeiros quadros da
      animação de entrada rodavam sobre uma caixa vazia, e a foto chegava depois,
      no meio da animação;
   2. no fechamento, `src = ''` resolvia para a URL do documento: o navegador
      pedia a PRÓPRIA PÁGINA como imagem, o load falhava e o handler de erro do
      main.js (seção 13) injetava a imagem de reserva — que era o que aparecia no
      começo da abertura seguinte, antes da foto real;
   3. o <img> do lightbox declara 1200x800 (3:2) e cinco das oito fotos reais não
      são 3:2, então em telas onde o `max-height: 76vh` não segura a caixa o
      diálogo ainda mudava de altura quando a imagem chegava.

   A abertura agora pinta com o bitmap que o tile JÁ mostra (mesma foto, mesma
   proporção, já decodificada) e a versão grande entra por cima quando estiver
   baixada e decodificada.

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

/* O jsdom não implementa <dialog> nem `img.decode()`: os dois são dublados aqui
   para que o caminho real do main.js seja exercitado (sem eles ele cai no
   fallback de `window.open`, que é outro caminho). */
function boot({ reduced = false, semDialog = false, decode } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;

  window.matchMedia = () => ({
    matches: reduced, media: '', onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent() { return false; },
  });
  window.__openCalls = [];
  window.open = (...args) => { window.__openCalls.push(args); return {}; };
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {};
  }

  if (!semDialog) {
    window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    window.HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
      this.dispatchEvent(new window.Event('close'));
    };
  }

  Object.defineProperty(window.HTMLImageElement.prototype, 'decode', {
    configurable: true, writable: true,
    value() { return (decode || (() => Promise.resolve()))(this.getAttribute('src')); },
  });

  for (const s of window.document.querySelectorAll('script')) {
    if (s.type === 'application/ld+json') continue;
    if (s.getAttribute('src')) continue;
    window.eval(s.textContent);
  }
  window.eval(configJs);
  window.eval(mainJs);

  return dom;
}

const tick = () => new Promise((r) => setTimeout(r, 0));

const el = (dom, sel) => dom.window.document.querySelector(sel);
const tileOf = (dom, i) => dom.window.document.querySelectorAll('#gallery .tile')[i];
const imgOf = (dom, i) => tileOf(dom, i).querySelector('img');
const srcOf = (dom) => el(dom, '#lightbox-img').getAttribute('src');

/* --------------------------------------------------------------- abertura --- */

test('luxo/5 · o diálogo abre JÁ com o bitmap do tile, não com a versão grande', () => {
  const dom = boot();
  const tile = tileOf(dom, 0);
  const tileSrc = imgOf(dom, 0).src;

  tile.click();

  assert.equal(srcOf(dom), tileSrc, 'o <img> do lightbox recebe a imagem que o tile está mostrando');
  assert.ok(!srcOf(dom).includes('w=1600'), 'não é a URL grande (que o srcset do tile nunca pede)');
  dom.window.close();
});

test('luxo/5 · a abertura é síncrona: o clique não fica esperando rede', () => {
  const dom = boot();
  const dialog = el(dom, '#lightbox');

  tileOf(dom, 0).click();

  assert.ok(dialog.hasAttribute('open'), 'showModal() é chamado no próprio clique');
  dom.window.close();
});

test('luxo/5 · a versão grande entra por cima quando estiver decodificada', async () => {
  const dom = boot();
  const full = tileOf(dom, 2).getAttribute('data-full');

  tileOf(dom, 2).click();
  assert.notEqual(srcOf(dom), full, 'antes do decode, quem está na tela é o tile');

  await tick();
  assert.equal(srcOf(dom), full, 'decodificada, a versão grande assume');
  dom.window.close();
});

test('luxo/5 · se a imagem grande falhar, fica a do tile (sem caixa quebrada)', async () => {
  const dom = boot({ decode: (url) => (String(url).includes('w=1600') ? Promise.reject(new Error('offline')) : Promise.resolve()) });
  const tileSrc = imgOf(dom, 1).src;

  tileOf(dom, 1).click();
  await tick();

  assert.equal(srcOf(dom), tileSrc);
  dom.window.close();
});

test('luxo/5 · tile sem data-full não troca por nada', async () => {
  const dom = boot();
  const tile = tileOf(dom, 3);
  const tileSrc = imgOf(dom, 3).src;
  tile.removeAttribute('data-full');

  tile.click();
  await tick();

  assert.equal(srcOf(dom), tileSrc);
  dom.window.close();
});

test('luxo/5 · dois cliques seguidos: a troca pendente do primeiro não vaza', async () => {
  const dom = boot();

  tileOf(dom, 0).click();
  tileOf(dom, 5).click();
  const full = tileOf(dom, 5).getAttribute('data-full');

  await tick();
  assert.equal(srcOf(dom), full, 'vale o último tile clicado');
  assert.ok(!srcOf(dom).includes('16985187'), 'a imagem do tile anterior não volta');
  dom.window.close();
});

/* -------------------------------------------------------------- fechamento --- */

test('luxo/5 · ao fechar, o lightbox não aponta para a própria página', () => {
  const dom = boot();

  tileOf(dom, 0).click();
  el(dom, '#lightbox').close();

  assert.equal(srcOf(dom), null, 'sem atributo src: nada é pedido, nada falha, nenhuma reserva é injetada');
  dom.window.close();
});

test('luxo/5 · depois de fechar, reabrir volta a mostrar a foto do tile', async () => {
  const dom = boot();

  tileOf(dom, 0).click();
  el(dom, '#lightbox').close();
  tileOf(dom, 4).click();

  assert.equal(srcOf(dom), imgOf(dom, 4).src);
  await tick();
  assert.equal(srcOf(dom), tileOf(dom, 4).getAttribute('data-full'));
  dom.window.close();
});

test('luxo/5 · troca pendente não escreve num lightbox já fechado', async () => {
  const dom = boot();

  tileOf(dom, 0).click();
  el(dom, '#lightbox').close();
  await tick();

  assert.equal(srcOf(dom), null);
  dom.window.close();
});

/* -------------------------------------------------------------- regressões --- */

test('luxo/5 · legenda e alt continuam vindo do tile', () => {
  const dom = boot();

  tileOf(dom, 6).click();

  assert.equal(el(dom, '#lightbox-title').textContent, tileOf(dom, 6).getAttribute('data-title'));
  assert.equal(el(dom, '#lightbox-cat').textContent, tileOf(dom, 6).getAttribute('data-cat-label'));
  assert.equal(el(dom, '#lightbox-img').alt, imgOf(dom, 6).alt);
  dom.window.close();
});

test('luxo/5 · sem <dialog> nativo o fallback 3.6 abre a versão grande em nova aba', () => {
  const dom = boot({ semDialog: true });

  tileOf(dom, 7).click();

  const full = tileOf(dom, 7).getAttribute('data-full');
  assert.deepEqual(dom.window.__openCalls, [[full, '_blank', 'noopener']]);
  dom.window.close();
});
