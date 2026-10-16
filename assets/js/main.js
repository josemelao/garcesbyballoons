/* ==========================================================================
   GARCÊS by Balloons — main.js
   Sem dependências. Lê as configurações de assets/js/config.js
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* Imagem de reserva caso alguma referência não carregue */
  var FALLBACK_IMG =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img">' +
      '<rect width="800" height="600" fill="#1C1917"/>' +
      '<path d="M400 168c66 0 120 54 120 120 0 75-78 143-108 172a17 17 0 0 1-24 0c-30-29-108-97-108-172 0-66 54-120 120-120Z" ' +
      'fill="none" stroke="#D4AF37" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M400 468v52" stroke="#D4AF37" stroke-width="5" stroke-linecap="round"/>' +
      '<text x="400" y="566" fill="#A8A29E" font-family="Georgia, serif" font-size="26" text-anchor="middle">' +
      'Imagem de refer\u00eancia</text></svg>'
    );

  /* ---------------------------------------------------------------------
     Configuração
     --------------------------------------------------------------------- */
  var cfg = window.GARCES_CONFIG || {};

  function txt(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  var CFG = {
    whatsapp: txt(cfg.whatsapp).replace(/\D/g, ''),
    telefoneExibicao: txt(cfg.telefoneExibicao),
    email: txt(cfg.email),
    instagram: txt(cfg.instagram),
    formEndpoint: txt(cfg.formEndpoint)
  };

  var hasWhatsApp = CFG.whatsapp.length >= 10;
  var hasAnyContact = hasWhatsApp || !!CFG.email || !!CFG.instagram;
  var previewMode = !hasWhatsApp && !CFG.formEndpoint;

  var DEFAULT_WA_MESSAGE =
    'Olá! Vim pelo site da Garcês by Balloons e gostaria de mais informações.';

  function waLink(message) {
    return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(message || DEFAULT_WA_MESSAGE);
  }

  function formatPhone(digits) {
    if (!digits) { return ''; }
    var d = digits.replace(/^55/, '');
    if (d.length === 11) { return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7); }
    if (d.length === 10) { return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6); }
    return digits;
  }

  function instagramHandle(url) {
    var m = /instagram\.com\/([^/?#]+)/i.exec(url || '');
    return m ? '@' + m[1] : url;
  }

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------------------------------------------------------------------
     Execução protegida: se algo falhar, o conteúdo continua visível
     --------------------------------------------------------------------- */
  function main() {
    window.__garcesReady = true;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* -------------------------------------------------------------------
       1. Ano do rodapé
       ------------------------------------------------------------------- */
    var yearEl = $('#year');
    if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

    /* -------------------------------------------------------------------
       2. Aviso de modo de pré-visualização
       ------------------------------------------------------------------- */
    var noticeEl = $('#preview-notice');
    if (noticeEl && previewMode) {
      noticeEl.className = 'preview-notice';
      noticeEl.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
        '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17.2v.1"/></svg>' +
        '<p><strong>Modo de pré-visualização.</strong> O número de WhatsApp e os dados de contato ' +
        'ainda não foram definidos, então o site <strong>não envia mensagens para nenhum contato</strong>. ' +
        'Antes de publicar, preencha <code>assets/js/config.js</code>.</p>';
      noticeEl.hidden = false;
    }

    /* -------------------------------------------------------------------
       3. Dados de contato: mostra apenas o que estiver configurado
       ------------------------------------------------------------------- */
    var CFG_VALUES = {
      whatsapp: CFG.whatsapp,
      email: CFG.email,
      instagram: CFG.instagram
    };

    function cfgItemVisible(key) {
      if (key === 'any') { return hasAnyContact; }
      return !!CFG_VALUES[key];
    }

    $$('[data-cfg-item]').forEach(function (el) {
      el.hidden = !cfgItemVisible(el.getAttribute('data-cfg-item'));
    });

    $$('[data-cfg-text]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-text');
      var value = '';
      if (key === 'telefoneExibicao') { value = CFG.telefoneExibicao || formatPhone(CFG.whatsapp); }
      else if (key === 'email') { value = CFG.email; }
      else if (key === 'instagramHandle') { value = instagramHandle(CFG.instagram); }
      el.textContent = value;
    });

    $$('[data-cfg-href]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-href');
      var href = '';
      if (key === 'whatsapp') { href = hasWhatsApp ? waLink() : ''; }
      else if (key === 'email') { href = CFG.email ? 'mailto:' + CFG.email : ''; }
      else if (key === 'instagram') { href = CFG.instagram || ''; }

      if (href) {
        el.setAttribute('href', href);
        if (/^https?:/i.test(href)) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener');
        }
      }
    });

    var pendingFooter = $('#footer-contact-pending');
    if (pendingFooter) { pendingFooter.hidden = hasAnyContact; }

    /* -------------------------------------------------------------------
       4. Ações de WhatsApp (data-wa)
       ------------------------------------------------------------------- */
    var bubble = $('#wa-bubble');
    var bubbleLabel = $('#wa-bubble-label');

    if (!hasWhatsApp && bubble) {
      if (bubbleLabel) { bubbleLabel.textContent = 'Enviar mensagem'; }
      bubble.setAttribute('aria-label', 'Ir para o formulário de contato');
    }

    function goToContactForm(message) {
      var form = $('#contact-form');
      if (!form) { return; }
      form.scrollIntoView({ block: 'start', behavior: prefersReduced() ? 'auto' : 'smooth' });

      var box = $('#form-status');
      if (box && message) {
        box.className = 'form__status is-visible form__status--info';
        box.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
          '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>' +
          '<span>' + message + '</span>';
      }
    }

    $$('[data-wa]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        if (hasWhatsApp) {
          event.preventDefault();
          window.open(waLink(), '_blank', 'noopener');
          return;
        }
        if (el.tagName === 'A') { return; } // âncora comum segue o fluxo normal
        goToContactForm(
          'O WhatsApp da marca ainda não foi configurado neste site. ' +
          'Preencha o formulário abaixo que a sua mensagem será registrada para envio.'
        );
      });
    });

    /* -------------------------------------------------------------------
       5. Navegação: scroll, menu mobile e link ativo
       ------------------------------------------------------------------- */
    var nav = $('#nav');
    var navToggle = $('#nav-toggle');

    function onScroll() {
      if (nav) { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* 5.5 — abre/fecha o menu com scroll lock e (opcional) retorno de foco */
    function setMenu(open, moveFocus) {
      if (!nav || !navToggle) { return; }
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      document.body.classList.toggle('menu-open', open);
      if (!open && moveFocus) { navToggle.focus(); }
    }
    function closeMenu() { setMenu(false, false); }

    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        setMenu(!nav.classList.contains('is-open'), false);
      });
    }

    $$('.nav__link, .nav__cta').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false, false); });
    });

    /* 5.6 — Esc fecha o menu e devolve o foco ao botão do menu */
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false, true); }
    });

    /* 5.5 — clique fora do painel fecha o menu (inclui o scrim de fundo) */
    doc.addEventListener('click', function (e) {
      if (!nav || !nav.classList.contains('is-open')) { return; }
      if (e.target.closest && (e.target.closest('.nav__links') || e.target.closest('#nav-toggle'))) { return; }
      setMenu(false, false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) { setMenu(false, false); }
    });

    var navLinks = $$('.nav__link');
    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? $(id) : null;
      })
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var activeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach(function (s) { activeObserver.observe(s); });
    }

    /* -------------------------------------------------------------------
       6. Reveal on scroll
       ------------------------------------------------------------------- */
    var revealTargets = $$('[data-reveal], [data-reveal-group]');

    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      revealTargets.forEach(function (el) {
        revealObserver.observe(el);
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    }

    /* -------------------------------------------------------------------
       7. Galeria: filtros
       ------------------------------------------------------------------- */
    var tiles = $$('#gallery .tile');
    var filterButtons = $$('.filter');
    var emptyMsg = $('#gallery-empty');
    var galleryStatus = $('#gallery-status');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter');
        var visible = 0;

        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        tiles.forEach(function (tile) {
          var match = value === 'all' || tile.getAttribute('data-category') === value;
          tile.hidden = !match;
          if (match) { visible++; }
        });

        if (emptyMsg) { emptyMsg.hidden = visible > 0; }

        /* 3.5 / 5.10 — anuncia a contagem para leitores de tela */
        if (galleryStatus) {
          galleryStatus.textContent = visible > 0
            ? visible + (visible === 1 ? ' referência nesta categoria.' : ' referências nesta categoria.')
            : 'Nenhuma referência nesta categoria.';
        }
      });
    });

    /* -------------------------------------------------------------------
       8. Lightbox (usa <dialog> nativo)
       ------------------------------------------------------------------- */
    var lightbox = $('#lightbox');
    var lightboxImg = $('#lightbox-img');
    var lightboxTitle = $('#lightbox-title');
    var lightboxCat = $('#lightbox-cat');
    var lightboxClose = $('#lightbox-close');
    var lastFocused = null;

    function openLightbox(tile) {
      var img = $('img', tile);
      var full = tile.getAttribute('data-full') || (img ? img.src : '');

      /* 3.6 — navegador sem suporte a <dialog>: abre a imagem em nova aba */
      if (!lightbox || typeof lightbox.showModal !== 'function') {
        if (full) { window.open(full, '_blank', 'noopener'); }
        return;
      }

      lastFocused = tile;
      lightboxImg.src = full;
      lightboxImg.alt = img ? img.alt : '';
      lightboxTitle.textContent = tile.getAttribute('data-title') || '';
      lightboxCat.textContent = tile.getAttribute('data-cat-label') || '';

      lightbox.showModal();
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () { openLightbox(tile); });
    });

    function closeLightbox() {
      if (lightbox && lightbox.open) { lightbox.close(); }
    }

    if (lightboxClose) { lightboxClose.addEventListener('click', closeLightbox); }

    if (lightbox) {
      lightbox.addEventListener('close', function () {
        lightboxImg.src = '';
        if (lastFocused) { lastFocused.focus(); }
      });

      lightbox.addEventListener('click', function (e) {
        var rect = lightbox.getBoundingClientRect();
        var inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inside) { closeLightbox(); }
      });
    }

    /* -------------------------------------------------------------------
       9. Formulário
       ------------------------------------------------------------------- */
    var form = $('#contact-form');

    if (form) {
      /* 3.4 — o JS assume o formulário: aplicamos novalidate só agora.
         Sem JS, o HTML não traz novalidate e o navegador valida nativamente
         (evita o submit vazio por GET que recarregava e perdia os dados). */
      form.setAttribute('novalidate', '');

      var submitBtn = $('#form-submit');
      var submitLabel = $('#form-submit-label');
      var statusBox = $('#form-status');
      var summaryBox = $('#form-summary');

      var rules = {
        nome: function (v) {
          if (!v.trim()) { return 'Informe o seu nome.'; }
          if (v.trim().length < 2) { return 'Nome muito curto.'; }
          return '';
        },
        telefone: function (v) {
          var digits = v.replace(/\D/g, '');
          if (!digits) { return 'Informe o seu telefone com DDD.'; }
          if (digits.length < 10 || digits.length > 13) { return 'Número inválido. Use DDD + número.'; }
          return '';
        },
        servico: function (v) {
          if (!v) { return 'Selecione o serviço de interesse.'; }
          return '';
        },
        mensagem: function (v) {
          if (!v.trim()) { return 'Descreva brevemente o que você precisa.'; }
          if (v.trim().length < 10) { return 'Conte um pouco mais (pelo menos 10 caracteres).'; }
          return '';
        }
      };

      function fieldOf(name) {
        var input = form.elements[name];
        return input ? input.closest('.field') : null;
      }

      function errorOf(name) { return doc.getElementById(name + '-error'); }

      function validateField(name) {
        var input = form.elements[name];
        if (!input || !rules[name]) { return true; }

        var message = rules[name](input.value || '');
        var field = fieldOf(name);
        var error = errorOf(name);

        if (message) {
          if (field) { field.classList.add('has-error'); }
          if (error) { error.textContent = message; }
          input.setAttribute('aria-invalid', 'true');
          return false;
        }

        if (field) { field.classList.remove('has-error'); }
        if (error) { error.textContent = ''; }
        input.removeAttribute('aria-invalid');
        return true;
      }

      function validateAll() {
        var invalid = [];
        Object.keys(rules).forEach(function (name) {
          if (!validateField(name)) { invalid.push(name); }
        });
        return invalid;
      }

      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!input) { return; }
        input.addEventListener('blur', function () { validateField(name); });
        input.addEventListener('input', function () {
          var f = fieldOf(name);
          if (f && f.classList.contains('has-error')) { validateField(name); }
        });
      });

      var ICON_ALERT =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.1"/></svg>';
      var ICON_OK =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/></svg>';

      function setStatus(type, icon, html) {
        if (!statusBox) { return; }
        statusBox.className = 'form__status is-visible form__status--' + type;
        statusBox.innerHTML = icon + '<span>' + html + '</span>';
      }

      function clearStatus() {
        if (!statusBox) { return; }
        statusBox.className = 'form__status';
        statusBox.textContent = '';
      }

      /* 3.7 — Resumo de erro no topo do formulário (focável, role="alert"),
         com link para cada campo inválido. Os erros inline são mantidos. */
      function fieldLabel(name) {
        var label = doc.querySelector('label[for="' + name + '"]');
        var text = label ? label.textContent.replace(/\s*\*\s*$/, '').trim() : name;
        return text || name;
      }

      function showSummary(invalid) {
        if (!summaryBox) { return; }
        var items = invalid.map(function (name) {
          return '<li><a href="#' + name + '">' + fieldLabel(name) + '</a></li>';
        }).join('');
        summaryBox.innerHTML =
          '<p class="form__summary-title">Confira ' +
          (invalid.length > 1 ? 'os campos destacados' : 'o campo destacado') +
          ' para continuar:</p>' +
          '<ul class="form__summary-list">' + items + '</ul>';
        summaryBox.hidden = false;
        summaryBox.focus();
      }

      function hideSummary() {
        if (!summaryBox) { return; }
        summaryBox.hidden = true;
        summaryBox.textContent = '';
      }

      if (summaryBox) {
        summaryBox.addEventListener('click', function (e) {
          var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
          if (!link) { return; }
          var target = doc.getElementById(link.getAttribute('href').slice(1));
          if (target) { e.preventDefault(); target.focus(); }
        });
      }

      function setLoading(loading) {
        if (!submitBtn) { return; }
        submitBtn.classList.toggle('is-loading', loading);
        submitBtn.disabled = loading;
        if (submitLabel) { submitLabel.textContent = loading ? 'Enviando…' : 'Enviar mensagem'; }
      }

      function collect() {
        return {
          nome: (form.elements.nome.value || '').trim(),
          telefone: (form.elements.telefone.value || '').trim(),
          servico: form.elements.servico.value || '',
          mensagem: (form.elements.mensagem.value || '').trim()
        };
      }

      function buildWhatsAppMessage(data) {
        return [
          'Olá! Vim pelo site da Garcês by Balloons.',
          '',
          'Nome: ' + data.nome,
          'Telefone: ' + data.telefone,
          'Serviço de interesse: ' + data.servico,
          '',
          data.mensagem
        ].join('\n');
      }

      function resetForm() {
        form.reset();
        Object.keys(rules).forEach(function (name) {
          var f = fieldOf(name);
          if (f) { f.classList.remove('has-error'); }
          var err = errorOf(name);
          if (err) { err.textContent = ''; }
        });
        hideSummary();
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearStatus();
        hideSummary();

        var invalid = validateAll();
        if (invalid.length) {
          showSummary(invalid);
          return;
        }

        var data = collect();

        /* a) Endpoint configurado: envio real por POST */
        if (CFG.formEndpoint) {
          setLoading(true);
          fetch(CFG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          })
            .then(function (res) {
              if (!res.ok) { throw new Error('HTTP ' + res.status); }
              setStatus('success', ICON_OK, 'Mensagem enviada. Obrigado pelo contato — você receberá um retorno em breve.');
              resetForm();
            })
            .catch(function () {
              setStatus('error', ICON_ALERT,
                'Não foi possível enviar agora. Tente novamente em alguns instantes' +
                (hasWhatsApp ? ' ou fale pelo <a href="' + waLink(buildWhatsAppMessage(data)) + '" target="_blank" rel="noopener">WhatsApp</a>.' : '.'));
            })
            .then(function () { setLoading(false); });
          return;
        }

        /* b) Sem endpoint, mas com WhatsApp: abre a conversa já preenchida */
        if (hasWhatsApp) {
          setLoading(true);
          var url = waLink(buildWhatsAppMessage(data));

          window.setTimeout(function () {
            var opened = window.open(url, '_blank', 'noopener');
            setLoading(false);

            if (!opened) {
              setStatus('error', ICON_ALERT,
                'O navegador bloqueou a abertura automática. ' +
                '<a href="' + url + '" target="_blank" rel="noopener">Clique aqui para abrir o WhatsApp</a>.');
              return;
            }

            setStatus('success', ICON_OK,
              'Abrimos o WhatsApp com a sua mensagem. Se não abriu, ' +
              '<a href="' + url + '" target="_blank" rel="noopener">clique aqui</a>.');
            resetForm();
          }, prefersReduced() ? 0 : 400);
          return;
        }

        /* c) Nada configurado: informa sem simular envio */
        setStatus('info', ICON_ALERT,
          '<strong>Envio ainda não configurado.</strong> Os dados do formulário não foram enviados a ' +
          'nenhum destino. Antes de publicar, defina <code>formEndpoint</code> ou <code>whatsapp</code> ' +
          'em <code>assets/js/config.js</code>.');
      });
    }

    /* -------------------------------------------------------------------
       10. Máscara simples de telefone
       ------------------------------------------------------------------- */
    var phone = doc.getElementById('telefone');
    if (phone) {
      phone.addEventListener('input', function () {
        var d = phone.value.replace(/\D/g, '').slice(0, 11);
        var out = '';

        if (d.length) { out = '(' + d.slice(0, 2); }
        if (d.length > 2) { out += ') ' + d.slice(2, d.length > 10 ? 7 : 6); }
        if (d.length > (d.length > 10 ? 7 : 6)) { out += '-' + d.slice(d.length > 10 ? 7 : 6); }

        phone.value = out;
      });
    }

    /* -------------------------------------------------------------------
       11. Reserva para imagens que não carregarem
       ------------------------------------------------------------------- */
    $$('img').forEach(function (img) {
      img.addEventListener('error', function handleError() {
        img.removeEventListener('error', handleError);
        img.src = FALLBACK_IMG;
      });
    });
  }

  try {
    main();
  } catch (err) {
    document.documentElement.classList.remove('js');
    if (window.console && console.error) {
      console.error('[Garcês by Balloons] Falha ao inicializar:', err);
    }
  }
})();
