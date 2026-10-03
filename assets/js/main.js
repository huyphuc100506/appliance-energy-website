(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('[data-faq] .faq__item').forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver, no scroll listeners) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Energy calculator ---------- */
  var form = document.getElementById('calc-form');
  if (!form) return;

  var els = {
    appliance: document.getElementById('appliance'),
    customField: document.getElementById('custom-field'),
    wattage: document.getElementById('wattage'),
    hours: document.getElementById('hours'),
    hoursRange: document.getElementById('hours-range'),
    rate: document.getElementById('rate'),
    result: document.getElementById('calc-result'),
    outDay: document.getElementById('out-day'),
    outYear: document.getElementById('out-year'),
    outCost: document.getElementById('out-cost')
  };
  var errorEls = {
    wattage: document.getElementById('wattage-error'),
    hours: document.getElementById('hours-error'),
    rate: document.getElementById('rate-error')
  };
  var touched = { wattage: false, hours: false, rate: false };

  var fmtKwh = new Intl.NumberFormat('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var fmtKwhYear = new Intl.NumberFormat('en-AU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var fmtMoney = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

  function isCustom() { return els.appliance.value === 'custom'; }

  /* Returns {value, error} for a raw input string. */
  function check(raw, rules) {
    var text = String(raw).trim();
    if (text === '') return { error: rules.empty };
    var n = Number(text);
    if (!isFinite(n)) return { error: 'Please enter a number.' };
    if (n < 0) return { error: 'Value cannot be negative.' };
    if (n < rules.min) return { error: rules.minMsg };
    if (n > rules.max) return { error: rules.maxMsg };
    return { value: n };
  }

  function validate() {
    var res = {};
    var wattsRaw = isCustom() ? els.wattage.value : els.appliance.value;
    res.wattage = check(wattsRaw, {
      empty: 'Enter the wattage of your TV.',
      min: 1, minMsg: 'Wattage must be at least 1 W.',
      max: 2000, maxMsg: 'Wattage looks too high. Enter a value up to 2000 W.'
    });
    res.hours = check(els.hours.value, {
      empty: 'Enter your daily usage in hours.',
      min: 1, minMsg: 'Usage must be at least 1 hour per day.',
      max: 24, maxMsg: 'A day only has 24 hours.'
    });
    res.rate = check(els.rate.value, {
      empty: 'Enter your electricity price in cents per kWh.',
      min: 0.01, minMsg: 'Price must be greater than 0.',
      max: 200, maxMsg: 'Price looks too high. Enter a value up to 200 c/kWh.'
    });
    return res;
  }

  function showError(key, message) {
    var input = els[key];
    errorEls[key].textContent = message || '';
    input.classList.toggle('is-invalid', !!message);
    if (message) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
  }

  function render(forceErrors) {
    var res = validate();
    var allOk = true;

    ['wattage', 'hours', 'rate'].forEach(function (key) {
      var r = res[key];
      if (key === 'wattage' && !isCustom()) { showError('wattage', ''); return; }
      if (r.error) {
        allOk = false;
        showError(key, (forceErrors || touched[key]) ? r.error : '');
      } else {
        showError(key, '');
      }
    });

    els.result.classList.toggle('is-empty', !allOk);
    if (!allOk) return;

    var watts = res.wattage.value;
    var hours = res.hours.value;
    var cents = res.rate.value;

    var kwhDay = (watts * hours) / 1000;
    var kwhYear = kwhDay * 365;
    var cost = kwhYear * (cents / 100);

    els.outDay.innerHTML = fmtKwh.format(kwhDay) + '<small>kWh</small>';
    els.outYear.innerHTML = fmtKwhYear.format(kwhYear) + '<small>kWh</small>';
    els.outCost.innerHTML = fmtMoney.format(cost) + '<small>/ year</small>';

    [els.outCost, els.outDay, els.outYear].forEach(function (el) {
      el.classList.remove('pulse');
      void el.offsetWidth; // restart animation
      el.classList.add('pulse');
    });
  }

  function syncRangeFill() {
    var min = Number(els.hoursRange.min), max = Number(els.hoursRange.max);
    var pct = ((Number(els.hoursRange.value) - min) / (max - min)) * 100;
    els.hoursRange.style.setProperty('--fill', pct + '%');
  }

  els.appliance.addEventListener('change', function () {
    var custom = isCustom();
    els.customField.hidden = !custom;
    if (custom) els.wattage.focus();
    render(false);
  });

  els.hoursRange.addEventListener('input', function () {
    els.hours.value = els.hoursRange.value;
    touched.hours = true;
    syncRangeFill();
    render(false);
  });

  els.hours.addEventListener('input', function () {
    var n = Number(els.hours.value);
    if (els.hours.value !== '' && n >= 1 && n <= 24) {
      els.hoursRange.value = Math.round(n);
      syncRangeFill();
    }
    touched.hours = true;
    render(false);
  });

  ['wattage', 'rate'].forEach(function (key) {
    els[key].addEventListener('input', function () { touched[key] = true; render(false); });
  });
  ['wattage', 'hours', 'rate'].forEach(function (key) {
    els[key].addEventListener('blur', function () { touched[key] = true; render(false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    touched.wattage = touched.hours = touched.rate = true;
    render(true);
    var firstBad = form.querySelector('.is-invalid');
    if (firstBad) firstBad.focus();
  });

  syncRangeFill();
  render(false);
})();
