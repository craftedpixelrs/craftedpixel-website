/**
 * Highlights the sub-nav link that matches the section currently in view
 * (.service-detail-jump-inner + in-page #anchors).
 */
(function initServiceDetailJumpSpy() {
  const inner = document.querySelector('.service-detail-jump-inner');
  if (!inner) return;

  const jumpBar = document.querySelector('.service-detail-jump');
  const links = Array.prototype.slice.call(inner.querySelectorAll('a[href^="#"]'));
  const sections = [];

  links.forEach(function (link) {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    var id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch (_) {}
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  if (!sections.length) return;

  function pickActiveId() {
    var mark = 120;
    if (jumpBar) {
      var r = jumpBar.getBoundingClientRect();
      mark = r.bottom + 10;
    }

    var scrollBottom = window.scrollY + window.innerHeight;
    var docH = document.documentElement.scrollHeight;
    if (docH - scrollBottom < 100) {
      return sections[sections.length - 1].id;
    }

    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.getBoundingClientRect().top;
      if (top <= mark) current = sections[i].id;
      else break;
    }
    return current;
  }

  var lastId = null;
  function apply() {
    var id = pickActiveId();
    if (id === lastId) return;
    lastId = id;

    sections.forEach(function (s) {
      var on = s.id === id;
      s.link.classList.toggle('is-active', on);
      if (on) s.link.setAttribute('aria-current', 'location');
      else s.link.removeAttribute('aria-current');
    });
  }

  var raf = 0;
  function onScrollOrResize() {
    if (raf) return;
    raf = window.requestAnimationFrame(function () {
      raf = 0;
      apply();
    });
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  function firstApply() {
    window.requestAnimationFrame(function () {
      apply();
    });
  }
  if (document.readyState === 'complete') {
    firstApply();
  } else {
    window.addEventListener('load', firstApply, { once: true });
  }
})();
