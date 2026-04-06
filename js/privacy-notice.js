/**
 * CraftedPixel privacy / consent UI (file: privacy-notice.js — neutral name so Brave
 * Shields and other lists do not block the script URL like they do for *cookie-consent*).
 * Stores preferences in localStorage; dispatches "cookieconsentupdate" for analytics hooks.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'craftedpixel_cookie_consent';
  var VERSION = 1;

  function safeParse() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || o.v !== VERSION) return null;
      return o;
    } catch (e) {
      return null;
    }
  }

  function persist(prefs) {
    var data = {
      v: VERSION,
      essential: true,
      analytics: !!prefs.analytics,
      marketing: !!prefs.marketing,
      at: Date.now()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
    dispatch(data);
    return data;
  }

  function dispatch(detail) {
    try {
      window.dispatchEvent(new CustomEvent('cookieconsentupdate', { detail: detail }));
    } catch (e) {}
  }

  function getPreferences() {
    var s = safeParse();
    if (!s) {
      return {
        essential: true,
        analytics: false,
        marketing: false,
        decided: false
      };
    }
    return {
      essential: true,
      analytics: !!s.analytics,
      marketing: !!s.marketing,
      decided: true,
      at: s.at
    };
  }

  function hasAnswered() {
    return !!safeParse();
  }

  var root;
  var banner;
  var fab;
  var detailsEl;
  var toggleAnalytics;
  var toggleMarketing;
  var modeInitial = true;

  function setDetailsOpen(open) {
    if (!detailsEl) return;
    var btn = root && root.querySelector('[data-cc-toggle-details]');
    detailsEl.hidden = !open;
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    var saveRow = root && root.querySelector('.cc-banner__row--save');
    if (saveRow && modeInitial) {
      saveRow.hidden = !open;
    }
  }

  function syncTogglesFromStored() {
    var p = getPreferences();
    if (toggleAnalytics) toggleAnalytics.checked = p.analytics;
    if (toggleMarketing) toggleMarketing.checked = p.marketing;
  }

  function hideBanner() {
    if (banner) {
      banner.setAttribute('hidden', '');
      banner.setAttribute('aria-hidden', 'true');
      banner.style.removeProperty('display');
      banner.style.removeProperty('visibility');
      banner.style.removeProperty('opacity');
    }
    if (fab) {
      fab.removeAttribute('hidden');
      fab.setAttribute('aria-hidden', 'false');
      fab.style.removeProperty('display');
      fab.style.removeProperty('visibility');
      fab.style.removeProperty('opacity');
    }
    document.body.classList.remove('cc-banner-open');
  }

  function showBanner(fromFab) {
    modeInitial = !fromFab;
    if (banner) {
      banner.removeAttribute('hidden');
      banner.setAttribute('aria-hidden', 'false');
      banner.style.setProperty('display', 'block', 'important');
      banner.style.setProperty('visibility', 'visible', 'important');
      banner.style.setProperty('opacity', '1', 'important');
    }
    if (fab) {
      fab.setAttribute('hidden', '');
      fab.setAttribute('aria-hidden', 'true');
      fab.style.removeProperty('display');
      fab.style.removeProperty('visibility');
      fab.style.removeProperty('opacity');
    }
    document.body.classList.add('cc-banner-open');
    syncTogglesFromStored();
    var closeBtn = root && root.querySelector('[data-cc-close]');
    if (closeBtn) closeBtn.hidden = modeInitial;
    var primaryRow = root && root.querySelector('.cc-banner__row--primary');
    var saveRow = root && root.querySelector('.cc-banner__row--save');
    if (fromFab) {
      if (detailsEl) detailsEl.hidden = false;
      var expandBtn = root && root.querySelector('[data-cc-toggle-details]');
      if (expandBtn) expandBtn.setAttribute('aria-expanded', 'true');
      if (primaryRow) primaryRow.hidden = true;
      if (saveRow) saveRow.hidden = false;
    } else {
      if (detailsEl) detailsEl.hidden = true;
      var expandBtn2 = root && root.querySelector('[data-cc-toggle-details]');
      if (expandBtn2) expandBtn2.setAttribute('aria-expanded', 'false');
      if (primaryRow) primaryRow.hidden = false;
      if (saveRow) saveRow.hidden = true;
    }
    var firstFocus = fromFab
      ? root.querySelector('[data-cc-toggle-analytics]')
      : root.querySelector('[data-cc-accept-all]');
    if (firstFocus && typeof firstFocus.focus === 'function') {
      requestAnimationFrame(function () {
        firstFocus.focus();
      });
    }
  }

  function acceptAll() {
    persist({ analytics: true, marketing: true });
    hideBanner();
  }

  function rejectOptional() {
    persist({ analytics: false, marketing: false });
    hideBanner();
  }

  function saveCustom() {
    persist({
      analytics: !!(toggleAnalytics && toggleAnalytics.checked),
      marketing: !!(toggleMarketing && toggleMarketing.checked)
    });
    hideBanner();
  }

  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    if (modeInitial) return;
    if (banner && !banner.hasAttribute('hidden')) {
      e.preventDefault();
      hideBanner();
    }
  }

  function buildDom() {
    root = document.createElement('div');
    root.id = 'cc-consent-root';
    root.className = 'cc-consent';
    root.setAttribute('data-cc-root', '');

    root.innerHTML =
      '<div class="cc-banner" id="cc-banner" role="region" aria-labelledby="cc-banner-title" aria-hidden="true" hidden>' +
        '<div class="cc-banner__inner">' +
          '<div class="cc-banner__top">' +
            '<div class="cc-banner__icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></div>' +
            '<div class="cc-banner__head">' +
              '<h2 class="cc-banner__title" id="cc-banner-title">Cookies &amp; privacy</h2>' +
              '<p class="cc-banner__lead">We use cookies to run the site, remember preferences, and—only if you agree—measure usage and support relevant content. Read our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.</p>' +
            '</div>' +
            '<button type="button" class="cc-banner__close" data-cc-close hidden aria-label="Close cookie settings">' +
              '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
            '</button>' +
          '</div>' +
          '<div class="cc-banner__row cc-banner__row--primary">' +
            '<button type="button" class="button button--primary cc-banner__btn" data-cc-accept-all>Accept all</button>' +
            '<button type="button" class="button button--secondary cc-banner__btn" data-cc-reject>Optional only</button>' +
            '<button type="button" class="button button--outline-dark cc-banner__btn" data-cc-toggle-details aria-expanded="false">Customize</button>' +
          '</div>' +
          '<div class="cc-details" id="cc-details" hidden>' +
            '<p class="cc-details__hint">Required cookies keep the site secure and usable. You can opt in or out of the categories below at any time.</p>' +
            '<ul class="cc-categories" role="list">' +
              '<li class="cc-cat">' +
                '<div class="cc-cat__text">' +
                  '<span class="cc-cat__name">Strictly necessary</span>' +
                  '<span class="cc-cat__desc">Security, load balancing, consent storage, and basic session function.</span>' +
                '</div>' +
                '<span class="cc-cat__always">Always on</span>' +
              '</li>' +
              '<li class="cc-cat">' +
                '<div class="cc-cat__text">' +
                  '<span class="cc-cat__name">Analytics &amp; performance</span>' +
                  '<span class="cc-cat__desc">Anonymous or pseudonymous metrics to improve speed, content, and UX (e.g. page views, funnels).</span>' +
                '</div>' +
                '<label class="cc-switch">' +
                  '<input type="checkbox" data-cc-toggle-analytics />' +
                  '<span class="cc-switch__track" aria-hidden="true"><span class="cc-switch__thumb"></span></span>' +
                  '<span class="visually-hidden">Allow analytics cookies</span>' +
                '</label>' +
              '</li>' +
              '<li class="cc-cat">' +
                '<div class="cc-cat__text">' +
                  '<span class="cc-cat__name">Marketing &amp; social</span>' +
                  '<span class="cc-cat__desc">Personalization, remarketing, or social pixels when we add them—off until you enable.</span>' +
                '</div>' +
                '<label class="cc-switch">' +
                  '<input type="checkbox" data-cc-toggle-marketing />' +
                  '<span class="cc-switch__track" aria-hidden="true"><span class="cc-switch__thumb"></span></span>' +
                  '<span class="visually-hidden">Allow marketing cookies</span>' +
                '</label>' +
              '</li>' +
            '</ul>' +
          '</div>' +
          '<div class="cc-banner__row cc-banner__row--save" hidden>' +
            '<button type="button" class="button button--primary cc-banner__btn" data-cc-save>Save choices</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="cc-fab" id="cc-fab" data-cc-fab aria-label="Cookie settings" title="Cookie settings" hidden>' +
        '<i class="fa-solid fa-cookie-bite" aria-hidden="true"></i>' +
        '<span class="cc-fab__label">Cookies</span>' +
      '</button>';

    /* Mount on <html>, not <body>: body has overflow-x:hidden which can clip or
       break fixed descendants in some browsers (Chrome/Edge). */
    (document.documentElement || document.body).appendChild(root);
    banner = root.querySelector('#cc-banner');
    fab = root.querySelector('#cc-fab');
    detailsEl = root.querySelector('#cc-details');
    toggleAnalytics = root.querySelector('[data-cc-toggle-analytics]');
    toggleMarketing = root.querySelector('[data-cc-toggle-marketing]');

    function on(el, evt, fn) {
      if (el) el.addEventListener(evt, fn);
    }
    on(root.querySelector('[data-cc-accept-all]'), 'click', acceptAll);
    on(root.querySelector('[data-cc-reject]'), 'click', rejectOptional);
    on(root.querySelector('[data-cc-save]'), 'click', saveCustom);
    on(root.querySelector('[data-cc-toggle-details]'), 'click', function () {
      if (detailsEl) setDetailsOpen(detailsEl.hidden);
    });
    on(root.querySelector('[data-cc-close]'), 'click', hideBanner);
    on(fab, 'click', function () {
      showBanner(true);
    });

    document.addEventListener('keydown', onKeydown);

    document.addEventListener(
      'click',
      function (e) {
        var t = e.target && e.target.closest && e.target.closest('[data-cc-open]');
        if (!t) return;
        e.preventDefault();
        e.stopPropagation();
        showBanner(true);
      },
      true
    );
  }

  function openPreferences() {
    showBanner(true);
  }

  function init() {
    if (!document.body) return;
    if (document.getElementById('cc-consent-root')) return;
    try {
      if (/[?&]reset_cookies=1(?:&|$)/.test(location.search || '')) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
    try {
      buildDom();
    } catch (e) {
      console.error('[CraftedPixel privacy-notice] buildDom failed:', e);
      return;
    }
    var answered = hasAnswered();
    if (answered) {
      syncTogglesFromStored();
      dispatch(safeParse());
      hideBanner();
    } else {
      /* After first paint so LCP can be hero copy, not the consent panel (Lighthouse mobile). */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          showBanner(false);
        });
      });
    }
  }

  window.CraftedPixelCookieConsent = {
    getPreferences: getPreferences,
    hasAnswered: hasAnswered,
    open: openPreferences
  };

  function boot() {
    try {
      init();
    } catch (e) {
      console.error('[CraftedPixel privacy-notice]', e);
    }
  }
  boot();
  document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('load', boot);
})();
