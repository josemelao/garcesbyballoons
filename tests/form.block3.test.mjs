/* ==========================================================================
   Bloco 3 — Formulário à prova de JS (P0)
   Testes de comportamento (item 3.4, 3.7 e 4.14 do relatorio.md).

   Executa index.html + assets/js/config.js + assets/js/main.js dentro de um
   DOM (jsdom), sem navegador. Rode com:  npm test
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
const mainJs = readFileSync(resolve(root, 'assets/js/main.js'), 'utf8');
const configJs = readFileSync(resolve(root, 'assets/js/config.js'), 'utf8');

const FOLLOWING = 0x04; // Node.DOCUMENT_POSITION_FOLLOWING

/* Cria um DOM com os stubs que o main.js espera do navegador. */
function makeDom() {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://example.test/',
    virtualConsole: new VirtualConsole(), // silencia ruído do jsdom
  });
  const { window } = dom;

  window.matchMedia = () => ({
    matches: false, media: '', onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent() { return false; },
  });
  window.fetch = () => Promise.resolve({ ok: true, status: 200 });
  window.open = () => ({});
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {};
  }

  // Roda apenas os <script> inline da página (ignora JSON-LD e arquivos externos).
  for (const s of window.document.querySelectorAll('script')) {
    if (s.type === 'application/ld+json') continue;
    if (s.getAttribute('src')) continue;
    window.eval(s.textContent);
  }
  return dom;
}

/* Sobe o site: config + main.js, com override opcional de config e do DOM. */
function boot({ config = {}, prepare } = {}) {
  const dom = makeDom();
  const { window } = dom;
  if (prepare) { prepare(window); }
  window.eval(configJs);
  Object.assign(window.GARCES_CONFIG, config);
  window.eval(mainJs);
  return dom;
}

function submit(window, form) {
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
}

const flush = () => new Promise((r) => setTimeout(r, 5));

/* ------------------------------------------------------------------ 3.4 */

test('3.4 · o HTML não traz novalidate fixo no formulário', () => {
  const dom = makeDom();
  const form = dom.window.document.getElementById('contact-form');
  assert.ok(form, 'o formulário #contact-form deve existir');
  assert.equal(
    form.hasAttribute('novalidate'), false,
    'sem JS o HTML não pode desativar a validação nativa (novalidate)'
  );
  dom.window.close();
});

test('3.4 · o JS aplica novalidate quando assume o formulário', () => {
  const dom = boot({
    // Garante que o teste mede o JS, não o markup: chega sem novalidate.
    prepare: (w) => w.document.getElementById('contact-form').removeAttribute('novalidate'),
  });
  const form = dom.window.document.getElementById('contact-form');
  assert.equal(
    form.hasAttribute('novalidate'), true,
    'com JS ativo o handler precisa assumir e desativar a validação nativa'
  );
  dom.window.close();
});

/* ------------------------------------------------------------------ 3.7 */

test('3.7 · submit inválido revela resumo no topo, focado e anunciado', () => {
  const dom = boot();
  const { window } = dom;
  const doc = window.document;
  const form = doc.getElementById('contact-form');

  submit(window, form);

  const summary = doc.getElementById('form-summary');
  assert.ok(summary, 'deve existir um resumo de erro #form-summary');
  assert.equal(summary.getAttribute('role'), 'alert', 'resumo deve ter role="alert"');
  assert.equal(summary.hasAttribute('hidden'), false, 'resumo deve ficar visível após erro');
  assert.equal(summary.getAttribute('tabindex'), '-1', 'resumo deve ser focável por script');
  assert.equal(doc.activeElement, summary, 'o foco deve ir para o container do resumo');

  const firstField = doc.querySelector('#contact-form .field');
  assert.ok(
    summary.compareDocumentPosition(firstField) & FOLLOWING,
    'o resumo deve vir antes dos campos (no topo do formulário)'
  );

  for (const name of ['nome', 'telefone', 'servico', 'mensagem']) {
    assert.ok(summary.querySelector(`a[href="#${name}"]`), `resumo deve linkar o campo ${name}`);
  }

  assert.equal(
    doc.getElementById('nome').getAttribute('aria-invalid'), 'true',
    'os erros inline devem continuar'
  );
  dom.window.close();
});

test('3.7 · submit válido esconde o resumo e usa status polite', async () => {
  const dom = boot({ config: { formEndpoint: 'https://example.test/endpoint' } });
  const { window } = dom;
  const doc = window.document;
  const form = doc.getElementById('contact-form');

  doc.getElementById('nome').value = 'Maria Silva';
  doc.getElementById('telefone').value = '61999998888';
  doc.getElementById('servico').value = 'Workshop para iniciantes';
  doc.getElementById('mensagem').value = 'Gostaria de um orçamento para o meu evento.';

  submit(window, form);
  await flush();

  const summary = doc.getElementById('form-summary');
  assert.ok(summary, 'deve existir #form-summary');
  assert.equal(summary.hasAttribute('hidden'), true, 'resumo deve ficar escondido sem erros');

  const status = doc.getElementById('form-status');
  assert.equal(status.getAttribute('role'), 'status');
  assert.equal(status.getAttribute('aria-live'), 'polite');
  assert.ok(status.className.includes('form__status--success'), 'status de sucesso deve aparecer');
  dom.window.close();
});

/* ------------------------------------------------------------------ 4.14 */

test('4.14 · erro de recurso NÃO derruba a classe .js', () => {
  const dom = makeDom();
  const { window } = dom;
  const doc = window.document;
  assert.equal(doc.documentElement.classList.contains('js'), true);

  doc.querySelector('img').dispatchEvent(new window.Event('error'));

  assert.equal(
    doc.documentElement.classList.contains('js'), true,
    'erro de carregamento de imagem não pode desligar as animações do site'
  );
  dom.window.close();
});

test('4.14 · erro de execução na window AINDA derruba a classe .js', () => {
  const dom = makeDom();
  const { window } = dom;
  const doc = window.document;

  window.dispatchEvent(new window.ErrorEvent('error', { message: 'boom' }));

  assert.equal(
    doc.documentElement.classList.contains('js'), false,
    'erro real de script deve manter o fallback sem animação'
  );
  dom.window.close();
});
