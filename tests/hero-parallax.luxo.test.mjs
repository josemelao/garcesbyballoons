/* ==========================================================================
   Luxo / Bloco 8 — parallax do hero publicando variável (--hero-y)

   O Ken Burns mora no wrapper (.hero__mediawrap) e o CSS passou a ser dono do
   transform da imagem. O JS só publica o deslocamento em `--hero-y`. As
   invariantes que este teste protege:

   1. escreve a VARIÁVEL, nunca `style.transform` (inline transform sobrescreve
      o CSS e mataria o Ken Burns a cada quadro de rolagem);
   2. o deslocamento sai do scroll (y * 0.05, em px);
   3. passado o fim do hero o valor CONGELA (não acumula);
   4. desligado em `prefers-reduced-motion: reduce` (nem a variável).

   jsdom não tem layout: `offsetHeight` do hero é forçado no boot, senão o
   early-return do parallax sairia fora e o teste passaria vazio.

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

function boot({ reduced = false, alturaDoHero = 900 } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;

  /* stub POR CONSULTA: responder o mesmo para toda query faria o caminho
     testado nem rodar (o hero tem dois matchMedia em jogo) */
  window.matchMedia = (q) => ({
    matches: /prefers-reduced-motion/.test(q) ? reduced : false,
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

  Object.defineProperty(window.document.querySelector('.hero'), 'offsetHeight', {
    value: alturaDoHero,
    configurable: true,
  });

  return dom;
}

/* o rAF do jsdom dispara em ~16ms: 40ms garantem o quadro */
const flush = () => new Promise((r) => setTimeout(r, 40));

function rolar(dom, y) {
  Object.defineProperty(dom.window, 'scrollY', { value: y, writable: true, configurable: true });
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
}

const midia = (dom) => dom.window.document.querySelector('.hero__media');
const heroY = (dom) => midia(dom).style.getPropertyValue('--hero-y');

test('luxo/8 · a rolagem publica --hero-y em px (e o JS não escreve transform)', async () => {
  const dom = boot();

  rolar(dom, 300);
  await flush();

  assert.equal(heroY(dom), '15.00px', 'y * 0.05, em px');
  assert.equal(
    midia(dom).style.transform,
    '',
    'o transform é do CSS — um inline mataria o Ken Burns do wrapper'
  );
  dom.window.close();
});

test('luxo/8 · passado o fim do hero o deslocamento congela (não acumula)', async () => {
  const dom = boot({ alturaDoHero: 900 });

  rolar(dom, 400);
  await flush();
  const noFimDoHero = heroY(dom);
  assert.equal(noFimDoHero, '20.00px');

  rolar(dom, 5000);
  await flush();

  assert.equal(heroY(dom), noFimDoHero, 'depois do hero, o valor para onde estava');
  dom.window.close();
});

test('luxo/8 · em movimento reduzido não existe --hero-y nenhum', async () => {
  const dom = boot({ reduced: true });

  rolar(dom, 300);
  await flush();

  assert.equal(heroY(dom), '', 'reduced-motion não move o hero');
  dom.window.close();
});
