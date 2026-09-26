/* Order form: tier preselect, conditional fields, validation. Submission is a plain
   form POST to the endpoint in the form's action attribute. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('order-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var radios = form.querySelectorAll('input[name="tier"]');
    var rejField = document.getElementById('rejection-field');
    var rejInput = document.getElementById('f-rejection');
    var andField = document.getElementById('android-field');
    var andInput = document.getElementById('f-play');
    var cards = document.querySelectorAll('.tier[data-tier]');

    function pick(tier) {
      Array.prototype.forEach.call(radios, function (r) { r.checked = r.getAttribute('data-tier') === tier; });
      sync();
    }
    function current() {
      for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].getAttribute('data-tier');
      return null;
    }
    function sync() {
      var t = current();
      rejField.hidden = t !== 'fix';
      rejInput.required = t === 'fix';
      andField.hidden = t !== 'both';
      andInput.required = t === 'both';
      Array.prototype.forEach.call(cards, function (c) { c.classList.toggle('selected', c.getAttribute('data-tier') === t); });
    }

    Array.prototype.forEach.call(radios, function (r) { r.addEventListener('change', sync); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pick]'), function (a) {
      a.addEventListener('click', function () { pick(a.getAttribute('data-pick')); });
    });

    var q = /[?&]tier=([a-z]+)/.exec(window.location.search);
    if (q) pick(q[1]); else sync();

    form.addEventListener('submit', function (e) {
      status.className = 'status';
      status.textContent = '';
      if (!form.checkValidity()) {
        e.preventDefault();
        var bad = form.querySelector(':invalid');
        status.className = 'status err';
        status.textContent = 'Please complete the highlighted field' + (bad && bad.labels && bad.labels[0] ? ': ' + bad.labels[0].textContent.split('\n')[0].trim() : '.');
        if (bad) bad.focus();
        return;
      }
      e.preventDefault();
      if (document.getElementById('f-company').value) return;
      // No server: open the customer's email app with the order filled in.
      var lines = [];
      new FormData(form).forEach(function (v, k) {
        if (k === 'company_website' || v === '' || v === 'on') return;
        lines.push(k + ': ' + v);
      });
      var to = form.getAttribute('data-mailto');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Order request') + '&body=' + encodeURIComponent(lines.join('\n'));
      status.className = 'status ok';
      status.textContent = 'Your email app should open with the order filled in. Press send there. If nothing opens, email ' + to + '.';
    });
  });
})();
