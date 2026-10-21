/* Deep links into guides: guide.html#card-37 opens question 37, scrolls to it and highlights it.
 * Used by resume_mapper.html. Works with every guide's card markup (card-N ids, or b<N> body ids). */
(function () {
  'use strict';
  var m = /^#card-(\d+)$/.exec(location.hash);
  if (!m) return;
  var n = m[1], tries = 0;
  function find() {
    var c = document.getElementById('card-' + n);
    if (c) return c;
    var b = document.getElementById('b' + n);          // system_design guide
    return b ? b.closest('.q-card') : null;
  }
  (function go() {
    var c = find();
    if (!c) { if (++tries < 50) setTimeout(go, 100); return; }
    var body = c.querySelector('.q-body');
    if (body && !body.classList.contains('open')) { var h = c.querySelector('.q-header'); if (h) h.click(); }
    c.style.scrollMarginTop = '80px';
    c.scrollIntoView({ block: 'start' });
    var old = c.style.outline; c.style.outline = '2px solid #1D9E75'; c.style.outlineOffset = '2px';
    setTimeout(function () { c.style.outline = old; }, 3000);
  })();
})();
