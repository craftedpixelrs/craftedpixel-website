(function () {
  if (window.__cpCareersApplyModal) return;
  window.__cpCareersApplyModal = true;

  var MODAL_HTML =
    '<div id="careersApplyModal" class="careers-apply-modal" hidden aria-hidden="true">' +
    '<div class="careers-apply-modal__backdrop" tabindex="-1" data-careers-apply-close></div>' +
    '<div class="careers-apply-modal__panel" role="dialog" aria-modal="true" aria-labelledby="careers-apply-title" id="careers-apply-dialog">' +
    '<div class="careers-apply-modal__head">' +
    '<h2 id="careers-apply-title">Job application</h2>' +
    '<button type="button" class="careers-apply-modal__close" data-careers-apply-close aria-label="Close application form"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
    '</div>' +
    '<p class="careers-apply-modal__lede">Use this form for <strong>this open role only</strong>. Project inquiries belong on <a href="contact.html">Contact</a>.</p>' +
    '<div id="careersApplySuccess" class="careers-apply-success" role="status" aria-live="polite" hidden>' +
    '<span class="careers-apply-success-icon" aria-hidden="true"><i class="fa-solid fa-circle-check"></i></span>' +
    '<h3 class="careers-apply-success-title">Application received</h3>' +
    '<p class="careers-apply-success-text">We&rsquo;ll route this to hiring and reply when there&rsquo;s a fit—typically within several business days. You can also follow up at <a href="mailto:office@getcraftedpixel.com">office@getcraftedpixel.com</a>.</p>' +
    '<button type="button" class="button button--outline careers-apply-success-done" data-careers-apply-close>Close</button>' +
    '</div>' +
    '<form id="careersApplicationForm" class="careers-apply-form contact-form" novalidate>' +
    '<input type="hidden" id="careers-position-value" name="position" value="" />' +
    '<div class="contact-field" id="careers-position-locked-wrap">' +
    '<label for="careers-position-locked">Position you&rsquo;re applying for</label>' +
    '<input type="text" id="careers-position-locked" readonly class="careers-apply-readonly" autocomplete="off" aria-readonly="true" />' +
    '</div>' +
    '<div class="contact-form-row contact-form-row--2">' +
    '<div class="contact-field">' +
    '<label for="careers-name">Full name <span class="contact-req">*</span></label>' +
    '<input type="text" id="careers-name" name="name" autocomplete="name" required placeholder="Your name" />' +
    '</div>' +
    '<div class="contact-field">' +
    '<label for="careers-email">Email <span class="contact-req">*</span></label>' +
    '<input type="email" id="careers-email" name="email" autocomplete="email" required placeholder="you@email.com" />' +
    '</div>' +
    '</div>' +
    '<div class="contact-field">' +
    '<label for="careers-phone">Phone <span class="contact-form-optional">(optional)</span></label>' +
    '<input type="tel" id="careers-phone" name="phone" autocomplete="tel" placeholder="+1 · used only if we need to schedule a call" />' +
    '</div>' +
    '<div class="contact-field">' +
    '<label for="careers-portfolio">Portfolio or LinkedIn URL <span class="contact-req">*</span></label>' +
    '<input type="url" id="careers-portfolio" name="portfolio" inputmode="url" required placeholder="https://…" />' +
    '</div>' +
    '<div class="contact-field careers-apply-file-field">' +
    '<label for="careers-cv" id="careers-cv-label">CV / résumé <span class="contact-req">*</span></label>' +
    '<div class="careers-apply-file">' +
    '<input type="file" id="careers-cv" name="cv" class="careers-apply-file-input" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required aria-describedby="careers-cv-hint" />' +
    '<span id="careers-cv-filename" class="careers-apply-file-filename" aria-live="polite"></span>' +
    '</div>' +
    '<p id="careers-cv-hint" class="careers-apply-field-hint">PDF or Word · max 5&nbsp;MB</p>' +
    '</div>' +
    '<div class="contact-field">' +
    '<label for="careers-note">Relevant experience &amp; why this role <span class="contact-req">*</span></label>' +
    '<textarea id="careers-note" name="note" rows="5" required placeholder="A short note, links to work, and anything we should know from the job description."></textarea>' +
    '</div>' +
    '<div class="contact-field contact-field--honeypot" aria-hidden="true">' +
    '<label for="careers-website">Website</label>' +
    '<input type="text" id="careers-website" name="website" tabindex="-1" autocomplete="off" />' +
    '</div>' +
    '<div class="contact-field contact-field--checkbox">' +
    '<label class="contact-checkbox-label">' +
    '<input type="checkbox" id="careers-consent" name="consent" required />' +
    '<span class="contact-checkbox-ui" aria-hidden="true"></span>' +
    '<span>I agree to be contacted about this application. <span class="contact-req">*</span></span>' +
    '</label>' +
    '</div>' +
    '<div class="careers-apply-form-actions">' +
    '<button type="submit" class="button button--primary contact-submit">' +
    '<span>Submit application</span>' +
    '<span class="button__icon-wrapper" aria-hidden="true">' +
    '<i class="fa-solid fa-paper-plane button__icon-svg"></i>' +
    '<i class="fa-solid fa-paper-plane button__icon-svg button__icon-svg--copy"></i>' +
    '</span>' +
    '</button>' +
    '<p class="contact-form-footnote">Demo only—wire this form to your ATS or inbox when you go live.</p>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>';

  var CV_MAX_BYTES = 5 * 1024 * 1024;

  function injectModal() {
    if (document.getElementById('careersApplyModal')) return;
    var tpl = document.createElement('template');
    tpl.innerHTML = MODAL_HTML.trim();
    document.body.appendChild(tpl.content.firstElementChild);
  }

  function boot() {
    injectModal();
    var modal = document.getElementById('careersApplyModal');
    if (!modal) return;
    var dialog = document.getElementById('careers-apply-dialog');
    var form = document.getElementById('careersApplicationForm');
    var success = document.getElementById('careersApplySuccess');
    var lockedInput = document.getElementById('careers-position-locked');
    var hiddenPos = document.getElementById('careers-position-value');
    var cvInput = document.getElementById('careers-cv');
    var cvFilename = document.getElementById('careers-cv-filename');
    var panel = modal.querySelector('.careers-apply-modal__panel');
    var lastFocus = null;
    var closeTimer = null;

    function presetFromBody() {
      var raw = document.body && document.body.getAttribute('data-careers-job-title');
      if (!raw) return null;
      var t = raw.trim();
      return t || null;
    }

    function setPositionLocked(title) {
      if (!title || !hiddenPos || !lockedInput) return;
      hiddenPos.value = title;
      lockedInput.value = title;
    }

    function resetModalForm() {
      if (form) form.reset();
      if (hiddenPos) hiddenPos.value = '';
      if (lockedInput) lockedInput.value = '';
      if (cvFilename) cvFilename.textContent = '';
      if (form) form.removeAttribute('hidden');
      if (success) success.setAttribute('hidden', '');
    }

    function finishClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      modal.classList.remove('careers-apply-modal--open');
      modal.setAttribute('hidden', '');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      resetModalForm();
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function closeModal() {
      if (!modal || modal.hasAttribute('hidden')) return;
      if (!modal.classList.contains('careers-apply-modal--open')) {
        finishClose();
        return;
      }
      modal.classList.remove('careers-apply-modal--open');
      function onPanelEnd(e) {
        if (e.target !== panel) return;
        panel.removeEventListener('transitionend', onPanelEnd);
        finishClose();
      }
      if (panel) panel.addEventListener('transitionend', onPanelEnd);
      closeTimer = setTimeout(function () {
        panel.removeEventListener('transitionend', onPanelEnd);
        finishClose();
      }, 380);
    }

    function openModal(presetTitle) {
      if (!modal || !presetTitle) return;
      lastFocus = document.activeElement;
      resetModalForm();
      setPositionLocked(presetTitle);
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modal.classList.remove('careers-apply-modal--open');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          modal.classList.add('careers-apply-modal--open');
        });
      });
      var focusTarget = dialog && dialog.querySelector('#careers-name');
      if (focusTarget) focusTarget.focus();
    }

    modal.querySelectorAll('[data-careers-apply-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-careers-apply]');
      if (!trigger) return;
      e.preventDefault();
      var explicit = trigger.getAttribute('data-careers-job-title');
      var title = explicit && explicit.trim() ? explicit.trim() : presetFromBody();
      openModal(title);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal();
      }
    });

    if (cvInput && cvFilename) {
      cvInput.addEventListener('change', function () {
        var f = cvInput.files && cvInput.files[0];
        cvFilename.textContent = f ? f.name : '';
      });
    }

    try {
      var params = new URLSearchParams(window.location.search);
      var wantOpen = params.get('apply') === '1' || window.location.hash === '#careers-apply';
      if (wantOpen) {
        var t = presetFromBody();
        if (t) openModal(t);
      }
    } catch (err) {}

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = form.querySelector('#careers-website');
        if (hp && hp.value) return;
        if (!hiddenPos || !hiddenPos.value.trim()) {
          form.reportValidity();
          return;
        }
        var file = cvInput && cvInput.files && cvInput.files[0];
        if (file && file.size > CV_MAX_BYTES) {
          cvInput.setCustomValidity('File is too large. Maximum size is 5 MB.');
          cvInput.reportValidity();
          cvInput.setCustomValidity('');
          return;
        }
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        form.setAttribute('hidden', '');
        if (success) success.removeAttribute('hidden');
      });
    }

    var successDone = success && success.querySelector('.careers-apply-success-done');
    if (successDone) {
      successDone.addEventListener('click', closeModal);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
