/**
 * Custom tooltips for pricing comparison tables: reads text from title (then removes it),
 * renders a fixed-position panel with smooth motion. Hover + keyboard on desktop; tap toggle on touch.
 */
(function () {
  var tips = document.querySelectorAll('.pricing-compare-tip');
  if (!tips.length) return;

  var layer = document.createElement('div');
  layer.id = 'pricing-compare-tooltip-root';
  layer.className = 'pricing-compare-tooltip-layer';
  layer.setAttribute('role', 'tooltip');
  layer.hidden = true;

  var inner = document.createElement('div');
  inner.className = 'pricing-compare-tooltip-layer__inner';
  var arrow = document.createElement('span');
  arrow.className = 'pricing-compare-tooltip-layer__arrow';
  arrow.setAttribute('aria-hidden', 'true');
  layer.appendChild(inner);
  layer.appendChild(arrow);
  document.body.appendChild(layer);

  var activeBtn = null;
  var leaveTimer = null;
  var prefersHover = window.matchMedia('(hover: hover)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hideDelayMs = reduceMotion ? 0 : 200;

  function clearLeave() {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  }

  function hide() {
    clearLeave();
    layer.classList.remove('is-visible');
    layer.dataset.placement = '';
    layer.style.left = '';
    layer.style.top = '';
    window.setTimeout(function () {
      if (!layer.classList.contains('is-visible')) layer.hidden = true;
    }, hideDelayMs);
    if (activeBtn) {
      activeBtn.setAttribute('aria-expanded', 'false');
      activeBtn = null;
    }
  }

  function layout() {
    if (!activeBtn) return;
    var text = activeBtn.getAttribute('data-pricing-tip') || '';
    inner.textContent = text;

    layer.hidden = false;
    layer.classList.add('is-visible');
    layer.style.visibility = 'hidden';
    layer.style.left = '-9999px';
    layer.style.top = '0';

    function measureAndPlace() {
      if (!activeBtn) return;
      var rect = activeBtn.getBoundingClientRect();
      var margin = 12;
      var gap = 8;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var w = layer.offsetWidth;
      var h = layer.offsetHeight;

      var left = rect.left + rect.width / 2 - w / 2;
      left = Math.max(margin, Math.min(left, vw - w - margin));

      var spaceAbove = rect.top - margin;
      var spaceBelow = vh - rect.bottom - margin;
      var placeAbove = spaceAbove >= h + gap || spaceAbove > spaceBelow;

      var top;
      if (placeAbove) {
        top = rect.top - h - gap;
        if (top < margin) top = margin;
        layer.dataset.placement = 'above';
      } else {
        top = rect.bottom + gap;
        if (top + h > vh - margin) top = Math.max(margin, vh - h - margin);
        layer.dataset.placement = 'below';
      }

      var arrowLeft = rect.left + rect.width / 2 - left;
      arrowLeft = Math.max(18, Math.min(arrowLeft, w - 18));
      arrow.style.left = arrowLeft + 'px';

      layer.style.left = left + 'px';
      layer.style.top = top + 'px';
      layer.style.visibility = '';
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(measureAndPlace);
    });
  }

  function show(btn) {
    clearLeave();
    if (activeBtn && activeBtn !== btn) activeBtn.setAttribute('aria-expanded', 'false');
    activeBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    layout();
  }

  function toggle(btn) {
    if (activeBtn === btn && layer.classList.contains('is-visible')) hide();
    else show(btn);
  }

  tips.forEach(function (btn) {
    var t = btn.getAttribute('title');
    if (t) {
      btn.setAttribute('data-pricing-tip', t);
      btn.removeAttribute('title');
    }
    btn.setAttribute('aria-expanded', 'false');
    if (!btn.hasAttribute('aria-controls')) btn.setAttribute('aria-controls', 'pricing-compare-tooltip-root');
  });

  if (prefersHover) {
    tips.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        show(btn);
      });
      btn.addEventListener('mouseleave', function () {
        leaveTimer = window.setTimeout(hide, 160);
      });
      btn.addEventListener('focus', function () {
        show(btn);
      });
      btn.addEventListener('blur', function () {
        leaveTimer = window.setTimeout(hide, 120);
      });
    });
    layer.addEventListener('mouseenter', clearLeave);
    layer.addEventListener('mouseleave', function () {
      leaveTimer = window.setTimeout(hide, 80);
    });
  } else {
    tips.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle(btn);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(btn);
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.pricing-compare-tip') && !e.target.closest('.pricing-compare-tooltip-layer')) {
        hide();
      }
    });
  }

  window.addEventListener(
    'scroll',
    function () {
      if (activeBtn && !layer.hidden) layout();
    },
    true
  );
  window.addEventListener('resize', function () {
    if (activeBtn && !layer.hidden) layout();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
})();
