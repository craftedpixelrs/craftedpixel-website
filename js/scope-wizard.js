(function () {
  var root = document.getElementById('scope-wizard');
  if (!root) return;

  var form = root.querySelector('#scopeWizardForm');
  var steps = root.querySelectorAll('.scope-wizard-step');
  var resultEl = root.querySelector('#scopeWizardResult');
  var progressEl = root.querySelector('.scope-wizard-progress');
  var stepIndicator = root.querySelector('.scope-wizard-step-label');
  var btnBack = root.querySelector('[data-scope-wizard-back]');
  var btnNext = root.querySelector('[data-scope-wizard-next]');
  var btnRestart = root.querySelector('[data-scope-wizard-restart]');
  var liveRegion = root.querySelector('.scope-wizard-live');

  var totalSteps = steps.length;
  var currentIndex = 0;
  var answers = {};

  var OUTCOMES = {
    uiux: {
      tab: 'uiux',
      title: 'Likely starting point: UI/UX',
      body:
        'You&rsquo;re focused on product surfaces, flows, or clarity before engineering locks in. Most teams begin with a bounded design sprint (our UI/UX packages), then add build scope once specs and prototypes are stable.',
    },
    webdev: {
      tab: 'webdev',
      title: 'Likely starting point: web development',
      body:
        'You need production code—marketing site, app shell, integrations, or performance work—with requirements that are mostly known. Our web development tiers are a good map; we still confirm scope in writing before kickoff.',
    },
    seo: {
      tab: 'seo',
      title: 'Likely starting point: SEO &amp; growth',
      body:
        'Traffic, content structure, and measurable acquisition are the bottleneck. The SEO &amp; growth packages frame audits, content architecture, and ongoing iteration—without promising magic rankings.',
    },
    brand: {
      tab: 'brand',
      title: 'Likely starting point: brand &amp; systems',
      body:
        'Identity, guidelines, or a component library that has to hold for marketing and product together. Brand &amp; systems packages are built so design and engineering don&rsquo;t fork into two aesthetics.',
    },
    cms: {
      tab: 'cms',
      title: 'Likely starting point: content &amp; CMS',
      body:
        'Editors, structured content, migrations, or authoring workflows are central. Content &amp; CMS packages emphasize sane models and handoff so marketing can ship without blocking engineering for every page.',
    },
    wordpress: {
      tab: 'wordpress',
      title: 'Likely starting point: WordPress',
      body:
        'WordPress is the spine—themes, blocks, custom plugins, WooCommerce, or long-term care. Dedicated WordPress packages map greenfield builds through complex stacks and monthly evolution.',
    },
    wp_retainer: {
      tab: 'wordpress',
      title: 'Ongoing WordPress care &amp; roadmap',
      body:
        'Updates, security, small fixes, and planned feature work usually outgrow a single project quote. We&rsquo;ll align on hours, response expectations, and how releases get tested before production.',
    },
    analytics: {
      tab: 'analytics',
      title: 'Likely starting point: analytics &amp; experimentation',
      body:
        'You need trustworthy events, funnels, or test cadence—not another dashboard nobody opens. Analytics packages focus on taxonomy, implementation discipline, and decisions tied to experiments.',
    },
    automation: {
      tab: 'ai-automation',
      title: 'Likely starting point: AI &amp; business automation',
      body:
        'You want integrations, repeatable workflows, or governed AI copilots over your own data—not a demo chatbot. AI &amp; automation packages run from process audit through shipped flows and evaluation discipline.',
    },
    automation_retainer: {
      tab: 'ai-automation',
      title: 'Ongoing automation &amp; model iteration',
      body:
        'When new flows land often or prompts and parsers need tuning, a retainer usually beats one-off quotes. We align on hours, incident response, and how change gets tested before production.',
    },
    render3d: {
      tab: 'render3d',
      title: 'Likely starting point: 3D &amp; rendering',
      body:
        'You need product stills, motion loops, or web-ready GLB/USDZ that match your brand—not one-off PNGs nobody can reuse. The 3D packages anchor hero work through campaign-scale delivery; we still confirm shot count and formats in writing.',
    },
    render3d_retainer: {
      tab: 'render3d',
      title: 'Ongoing 3D production &amp; seasonal drops',
      body:
        'When launches repeat monthly, a retainer usually beats ad-hoc quotes—shared Slack, a render calendar, and rollover-friendly hours. We align on SKU velocity and which formats marketing burns through fastest.',
    },
    phased: {
      tab: null,
      title: 'A phased plan usually beats a single giant quote',
      body:
        'When work crosses several lanes or the brief is still forming, we prefer a short triage and a sequenced roadmap—design, then build, then growth—instead of guessing every line item up front.',
    },
    ux_retainer: {
      tab: 'uiux',
      title: 'Sounds like embedded design / ongoing product support',
      body:
        'Steady iteration alongside your roadmap maps to retainers and custom pools—not a one-off package price on the site. We&rsquo;ll propose hours, cadence, and how decisions get made after we see your backlog.',
    },
    web_partnership: {
      tab: 'webdev',
      title: 'Ongoing build &amp; care—not a single launch date',
      body:
        'Continuous shipping, integrations, or hardening usually outgrows a fixed package. We&rsquo;ll scope a retainer or milestone stream after we understand release cadence and what &ldquo;done&rdquo; means each month.',
    },
  };

  function pickOutcome(q) {
    var disclaimer = q.q3 === 'tight' && q.q4 === 'committee';
    var key;

    if (q.q1 === 'mixed') key = 'phased';
    else if (q.q1 === 'seo') key = 'seo';
    else if (q.q1 === 'render3d') {
      if (q.q2 === 'ongoing') key = 'render3d_retainer';
      else key = 'render3d';
    } else if (q.q1 === 'analytics') key = 'analytics';
    else if (q.q1 === 'automation') {
      if (q.q2 === 'ongoing') key = 'automation_retainer';
      else key = 'automation';
    } else if (q.q1 === 'brand') key = 'brand';
    else if (q.q1 === 'cms') key = 'cms';
    else if (q.q1 === 'wordpress') {
      if (q.q2 === 'ongoing') key = 'wp_retainer';
      else key = 'wordpress';
    } else if (q.q1 === 'product') {
      if (q.q2 === 'ongoing') key = 'ux_retainer';
      else key = 'uiux';
    } else if (q.q1 === 'web') {
      if (q.q2 === 'ongoing') key = 'web_partnership';
      else key = 'webdev';
    } else key = 'phased';

    return { key: key, disclaimer: disclaimer };
  }

  function setProgress() {
    var pct = ((currentIndex + 1) / totalSteps) * 100;
    if (progressEl) {
      progressEl.style.setProperty('--scope-wizard-pct', pct + '%');
      progressEl.setAttribute('aria-valuenow', String(currentIndex + 1));
    }
    if (stepIndicator) {
      stepIndicator.textContent = 'Step ' + (currentIndex + 1) + ' of ' + totalSteps;
    }
  }

  function updateNextLabel() {
    if (!btnNext) return;
    btnNext.textContent = currentIndex >= totalSteps - 1 ? 'See suggestion' : 'Next';
  }

  function showStep(i) {
    currentIndex = Math.max(0, Math.min(i, totalSteps - 1));
    steps.forEach(function (step, idx) {
      var on = idx === currentIndex;
      step.classList.toggle('is-active', on);
      step.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) step.removeAttribute('hidden');
      else step.setAttribute('hidden', '');

      step.querySelectorAll('.scope-wizard-opt').forEach(function (b) {
        b.setAttribute('tabindex', on ? '0' : '-1');
      });
    });
    if (btnBack) btnBack.hidden = currentIndex === 0;
    if (btnNext) {
      btnNext.disabled = !answers['q' + (currentIndex + 1)];
    }
    setProgress();
    updateNextLabel();
    var sel = steps[currentIndex].querySelector('.scope-wizard-opt[aria-pressed="true"]');
    if (sel) sel.focus();
    else steps[currentIndex].querySelector('.scope-wizard-opt').focus();
  }

  function announce(msg) {
    if (liveRegion) {
      liveRegion.textContent = '';
      liveRegion.textContent = msg;
    }
  }

  function openPackagesTab(tabKey) {
    var btn = document.querySelector('.packages-tab[data-tab="' + tabKey + '"]');
    if (btn) btn.click();
    var el = document.getElementById('pricing-packages');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResult() {
    var q = {
      q1: answers.q1,
      q2: answers.q2,
      q3: answers.q3,
      q4: answers.q4,
    };
    var picked = pickOutcome(q);
    var o = OUTCOMES[picked.key];
    if (!o || !resultEl) return;

    var titleEl = resultEl.querySelector('.scope-wizard-result-title');
    var bodyEl = resultEl.querySelector('.scope-wizard-result-body');
    var noteEl = resultEl.querySelector('.scope-wizard-result-note');
    var primaryEl = resultEl.querySelector('[data-scope-result-primary]');
    var secondaryEl = resultEl.querySelector('[data-scope-result-secondary]');

    if (titleEl) titleEl.innerHTML = o.title;
    if (bodyEl) bodyEl.innerHTML = o.body;

    if (noteEl) {
      if (picked.disclaimer) {
        noteEl.hidden = false;
        noteEl.innerHTML =
          '<strong>Tight timeline + many approvers?</strong> That combination usually needs scope trade-offs. We&rsquo;ll be direct on what&rsquo;s realistic once we see the brief—better now than at launch week.';
      } else {
        noteEl.hidden = true;
        noteEl.innerHTML = '';
      }
    }

    if (primaryEl) {
      primaryEl.href = 'contact';
      var pl = primaryEl.querySelector('.scope-wizard-primary-label');
      if (pl) pl.textContent = 'Start with a short note';
    }

    if (secondaryEl) {
      secondaryEl.onclick = null;
      if (o.tab) {
        secondaryEl.hidden = false;
        secondaryEl.href = '#pricing-packages';
        secondaryEl.textContent = 'View matching packages';
        secondaryEl.className = 'button button--outline-dark';
        secondaryEl.setAttribute('data-scope-result-secondary', '');
        secondaryEl.onclick = function (e) {
          e.preventDefault();
          openPackagesTab(o.tab);
        };
      } else {
        secondaryEl.hidden = false;
        secondaryEl.href = 'how-we-work';
        secondaryEl.textContent = 'How we work';
        secondaryEl.className = 'button button--outline-dark';
        secondaryEl.setAttribute('data-scope-result-secondary', '');
      }
    }

    form.hidden = true;
    resultEl.hidden = false;
    if (btnRestart) btnRestart.focus();
    announce('Result: ' + o.title.replace(/<[^>]+>/g, ''));
  }

  function resetWizard() {
    answers = {};
    currentIndex = 0;
    root.querySelectorAll('.scope-wizard-opt').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('is-selected');
    });
    form.hidden = false;
    resultEl.hidden = true;
    showStep(0);
    announce('Scope wizard restarted');
  }

  root.querySelectorAll('.scope-wizard-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var step = btn.closest('.scope-wizard-step');
      if (!step) return;
      var qname = step.getAttribute('data-question');
      step.querySelectorAll('.scope-wizard-opt').forEach(function (sib) {
        sib.setAttribute('aria-pressed', 'false');
        sib.classList.remove('is-selected');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-selected');
      answers[qname] = btn.getAttribute('data-value');
      if (btnNext) btnNext.disabled = false;
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      if (currentIndex < totalSteps - 1) {
        showStep(currentIndex + 1);
        announce('Step ' + (currentIndex + 1) + ' of ' + totalSteps);
      } else {
        renderResult();
      }
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', function () {
      showStep(currentIndex - 1);
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', resetWizard);
  }

  if (progressEl) progressEl.setAttribute('aria-valuemax', String(totalSteps));
  showStep(0);
})();
