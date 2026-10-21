/* Anonymous visitor counter for the portal home page.
 *
 * Privacy: no cookies, no personal data, no fingerprinting. The only thing sent is one request to the
 * counter service (which, like any web server, sees your IP address for that request). A flag in
 * localStorage makes each browser count at most once per day. If the service is down, blocked, or
 * the visitor uses an ad-blocker, the badge simply stays hidden and nothing else is affected.
 *
 * Provider options (set PROVIDER below):
 *   'abacus'      -> https://abacus.jasoncameron.dev  (free, open-source counter API, no signup needed)
 *   'goatcounter' -> https://<CODE>.goatcounter.com   (free, privacy-first analytics; sign up, enable
 *                    "Allow adding visitor counts on your website" in site settings, set GOATCOUNTER_CODE)
 *   'off'         -> no counter, badge hidden
 */
(function () {
  'use strict';
  var PROVIDER = 'abacus';
  var ABACUS_NAMESPACE = 'eknathalabs-interview-prep';   // change if you want a fresh count
  var ABACUS_KEY = 'visits';
  var GOATCOUNTER_CODE = '';                              // e.g. 'eknathalabs'

  var badge = document.getElementById('visitor-count');
  if (!badge || PROVIDER === 'off') return;

  function show(n) {
    if (typeof n !== 'number' || !isFinite(n) || n < 0) return;
    var num = badge.querySelector('[data-n]');
    if (num) num.textContent = n.toLocaleString('en-US');
    badge.hidden = false;
  }
  function getJSON(url) {
    return fetch(url, { mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  var day = new Date().toISOString().slice(0, 10), seen = false;
  try { seen = localStorage.getItem('ekn-visit') === day; } catch (e) {}
  function mark() { try { localStorage.setItem('ekn-visit', day); } catch (e) {} }

  if (PROVIDER === 'abacus') {
    var base = 'https://abacus.jasoncameron.dev/';
    var path = encodeURIComponent(ABACUS_NAMESPACE) + '/' + encodeURIComponent(ABACUS_KEY);
    getJSON(base + (seen ? 'get/' : 'hit/') + path)
      .then(function (d) { if (!seen) mark(); show(d.value); })
      .catch(function () { /* silent: counter is optional */ });
  } else if (PROVIDER === 'goatcounter' && GOATCOUNTER_CODE) {
    var host = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/';
    if (!seen) {
      // GoatCounter's pixel endpoint records a pageview without cookies or scripts
      var img = new Image(); img.referrerPolicy = 'no-referrer';
      img.src = host + 'count?p=' + encodeURIComponent(location.pathname) + '&t=' + encodeURIComponent(document.title) + '&rnd=' + Date.now();
      mark();
    }
    getJSON(host + 'counter/' + encodeURIComponent('TOTAL') + '.json')
      .then(function (d) { show(parseInt(String(d.count).replace(/\D/g, ''), 10)); })
      .catch(function () {});
  }
})();
