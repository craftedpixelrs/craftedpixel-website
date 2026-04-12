/**
 * CraftedPixel privacy / consent UI (file: privacy-notice.js — neutral name so Brave
 * Shields and other lists do not block the script URL like they do for *cookie-consent*).
 * Stores preferences in localStorage; dispatches "prefupdate" for analytics hooks.
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
      window.dispatchEvent(new CustomEvent('prefupdate', { detail: detail }));
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
  /** Set if user clicks “Cookie settings” before consent UI is mounted (deferred first paint). */
  var pendingOpenPreferences = false;

  document.addEventListener(
    'click',
    function (e) {
      var node = e.target;
      if (!node) return;
      if (node.nodeType !== 1) node = node.parentElement;
      if (!node || typeof node.closest !== 'function') return;
      var t = node.closest('[data-cp-open]');
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      if (root) {
        showBanner(true);
      } else {
        pendingOpenPreferences = true;
      }
    },
    true
  );

  function setDetailsOpen(open) {
    if (!detailsEl) return;
    var btn = root && root.querySelector('[data-cp-toggle-details]');
    detailsEl.hidden = !open;
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    var saveRow = root && root.querySelector('.cp-box__row--save');
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
    document.body.classList.remove('cp-open');
  }

  function showBanner(fromFab) {
    if (!root) return;
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
    document.body.classList.add('cp-open');
    syncTogglesFromStored();
    var closeBtn = root && root.querySelector('[data-cp-close]');
    if (closeBtn) closeBtn.hidden = modeInitial;
    var primaryRow = root && root.querySelector('.cp-box__row--primary');
    var saveRow = root && root.querySelector('.cp-box__row--save');
    if (fromFab) {
      if (detailsEl) detailsEl.hidden = false;
      var expandBtn = root && root.querySelector('[data-cp-toggle-details]');
      if (expandBtn) expandBtn.setAttribute('aria-expanded', 'true');
      if (primaryRow) primaryRow.hidden = true;
      if (saveRow) saveRow.hidden = false;
    } else {
      if (detailsEl) detailsEl.hidden = true;
      var expandBtn2 = root && root.querySelector('[data-cp-toggle-details]');
      if (expandBtn2) expandBtn2.setAttribute('aria-expanded', 'false');
      if (primaryRow) primaryRow.hidden = false;
      if (saveRow) saveRow.hidden = true;
    }
    var firstFocus = fromFab
      ? root.querySelector('[data-cp-toggle-analytics]')
      : root.querySelector('[data-cp-accept-all]');
    if (firstFocus && typeof firstFocus.focus === 'function') {
      requestAnimationFrame(function () {
        try {
          firstFocus.focus({ preventScroll: true });
        } catch (e) {
          firstFocus.focus();
        }
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
    root.id = 'cp-root';
    root.className = 'cp-pref';
    root.setAttribute('data-cp-root', '');

    root.innerHTML =
      '<div class="cp-box" id="cp-box" role="region" aria-labelledby="cp-box-title" aria-hidden="true" hidden>' +
        '<div class="cp-box__inner">' +
          '<div class="cp-box__top">' +
            '<div class="cp-box__icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></div>' +
            '<div class="cp-box__head">' +
              '<h2 class="cp-box__title" id="cp-box-title">Cookies &amp; privacy</h2>' +
              '<p class="cp-box__lead">We use cookies to run the site, remember preferences, and—only if you agree—measure usage and support relevant content. Read our <a href="cookies">Cookie Policy</a> and <a href="privacy">Privacy Policy</a>.</p>' +
            '</div>' +
            '<button type="button" class="cp-box__close" data-cp-close hidden aria-label="Close cookie settings">' +
              '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
            '</button>' +
          '</div>' +
          '<div class="cp-box__row cp-box__row--primary">' +
            '<button type="button" class="button button--primary cp-box__btn" data-cp-accept-all>Accept all</button>' +
            '<button type="button" class="button button--secondary cp-box__btn" data-cp-reject>Optional only</button>' +
            '<button type="button" class="button button--outline-dark cp-box__btn" data-cp-toggle-details aria-expanded="false">Customize</button>' +
          '</div>' +
          '<div class="cp-det" id="cp-det" hidden>' +
            '<p class="cp-det__hint">Required cookies keep the site secure and usable. You can opt in or out of the categories below at any time.</p>' +
            '<ul class="cp-cats" role="list">' +
              '<li class="cp-cat">' +
                '<div class="cp-cat__text">' +
                  '<span class="cp-cat__name">Strictly necessary</span>' +
                  '<span class="cp-cat__desc">Security, load balancing, consent storage, and basic session function.</span>' +
                '</div>' +
                '<span class="cp-cat__always">Always on</span>' +
              '</li>' +
              '<li class="cp-cat">' +
                '<div class="cp-cat__text">' +
                  '<span class="cp-cat__name">Analytics &amp; performance</span>' +
                  '<span class="cp-cat__desc">Anonymous or pseudonymous metrics to improve speed, content, and UX (e.g. page views, funnels).</span>' +
                '</div>' +
                '<label class="cp-tog">' +
                  '<input type="checkbox" data-cp-toggle-analytics />' +
                  '<span class="cp-tog__track" aria-hidden="true"><span class="cp-tog__thumb"></span></span>' +
                  '<span class="visually-hidden">Allow analytics cookies</span>' +
                '</label>' +
              '</li>' +
              '<li class="cp-cat">' +
                '<div class="cp-cat__text">' +
                  '<span class="cp-cat__name">Marketing &amp; social</span>' +
                  '<span class="cp-cat__desc">Personalization, remarketing, or social pixels when we add them—off until you enable.</span>' +
                '</div>' +
                '<label class="cp-tog">' +
                  '<input type="checkbox" data-cp-toggle-marketing />' +
                  '<span class="cp-tog__track" aria-hidden="true"><span class="cp-tog__thumb"></span></span>' +
                  '<span class="visually-hidden">Allow marketing cookies</span>' +
                '</label>' +
              '</li>' +
            '</ul>' +
          '</div>' +
          '<div class="cp-box__row cp-box__row--save" hidden>' +
            '<button type="button" class="button button--primary cp-box__btn" data-cp-save>Save choices</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="cp-fab" id="cp-fab" data-cp-fab aria-label="Cookie settings" title="Cookie settings" hidden>' +
        '<i class="fa-solid fa-cookie-bite" aria-hidden="true"></i>' +
        '<span class="cp-fab__label">Cookies</span>' +
      '</button>';

    /* Mount on <html>, not <body>: body has overflow-x:hidden which can clip or
       break fixed descendants in some browsers (Chrome/Edge). */
    (document.documentElement || document.body).appendChild(root);
    banner = root.querySelector('#cp-box');
    fab = root.querySelector('#cp-fab');
    detailsEl = root.querySelector('#cp-det');
    toggleAnalytics = root.querySelector('[data-cp-toggle-analytics]');
    toggleMarketing = root.querySelector('[data-cp-toggle-marketing]');

    function on(el, evt, fn) {
      if (el) el.addEventListener(evt, fn);
    }
    on(root.querySelector('[data-cp-accept-all]'), 'click', acceptAll);
    on(root.querySelector('[data-cp-reject]'), 'click', rejectOptional);
    on(root.querySelector('[data-cp-save]'), 'click', saveCustom);
    on(root.querySelector('[data-cp-toggle-details]'), 'click', function () {
      if (detailsEl) setDetailsOpen(detailsEl.hidden);
    });
    on(root.querySelector('[data-cp-close]'), 'click', hideBanner);
    on(fab, 'click', function () {
      showBanner(true);
    });

    document.addEventListener('keydown', onKeydown);

    if (pendingOpenPreferences) {
      pendingOpenPreferences = false;
      showBanner(true);
    }
  }

  function openPreferences() {
    if (!root) {
      try { init(); } catch (e) {}
    }
    if (root) showBanner(true);
  }

  function init() {
    if (!document.body) return;
    if (document.getElementById('cp-root')) return;
    try {
      if (/[?&]reset_cookies=1(?:&|$)/.test(location.search || '')) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
    var answered = hasAnswered();
    try {
      buildDom();
    } catch (e) {
      console.error('[CraftedPixel pref] buildDom failed:', e);
      return;
    }
    if (answered) {
      syncTogglesFromStored();
      dispatch(safeParse());
      hideBanner();
    } else {
      showBanner(false);
    }
  }

  window.CraftedPixelPrefs = {
    getPreferences: getPreferences,
    hasAnswered: hasAnswered,
    open: openPreferences
  };

  try {
    init();
  } catch (e) {
    console.error('[CraftedPixel pref]', e);
  }
})();
