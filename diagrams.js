/* Diagram layer: adds a "🗺 Diagram" block to question cards from window.DIAGRAMS[<guideKey>] (files in diagrams/<guideKey>.js).
 * Each entry is a small hand-authored spec that this file lays out as inline SVG (no images, no network, works offline,
 * follows light/dark theme and prints with the guide). Entry shape: { t: <type>, title?: string, ... }
 *   flow  : { n: ['Client','CDN','App','DB'], e: ['', 'miss', ''], v: 1 }   chain of boxes; e[i] labels the arrow after n[i]; v:1 = vertical
 *   tiers : { rows: [['Clients'],['LB'],['App 1','App 2'],['DB']], lab: ['', 'HTTP', '', ''] }   layers, every box links to the next row
 *   fan   : { src: 'Producer', mid: ['W1','W2','W3'], dst: 'Store', l1: 'publish', l2: 'write' }   one -> many -> one
 *   loop  : { n: ['Observe','Compare','Act'], c: 'reconcile' }   cycle drawn as boxes in a ring
 *   cmp   : { a: ['Title A', 'line', 'line'], b: ['Title B', 'line', 'line'] }   two columns side by side
 * Add an entry: put it in diagrams/<guideKey>.js under the question number. */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop() || '';
  var key = file.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
  var set = (window.DIAGRAMS || {})[key];
  if (!set) return;
  var NS = 'http://www.w3.org/2000/svg', CW = 6.6, LH = 15, PADX = 12, PADY = 8, GAP = 34;

  var st = document.createElement('style');
  st.textContent = '.dg-block{margin:12px 0 0;padding:10px 14px;border:1px solid rgba(127,119,221,.35);border-left:4px solid #7F77DD;border-radius:10px;background:rgba(127,119,221,.06)}' +
    'body.dark .dg-block{background:rgba(160,150,240,.08);border-color:rgba(160,150,240,.35);border-left-color:#a69ef2}' +
    '.dg-title{font-weight:600;font-size:12.5px;margin-bottom:6px}.dg-scroll{overflow-x:auto;max-width:100%}' +
    '.dg-svg{display:block;max-width:100%;height:auto;margin:0 auto;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.dg-svg rect.b{fill:#fff;stroke:#7F77DD;stroke-width:1.4}.dg-svg text{fill:#222}.dg-svg .ln{stroke:#7a7a7a;stroke-width:1.4;fill:none}' +
    '.dg-svg .ar{fill:#7a7a7a}.dg-svg .lb{fill:#555;font-size:10.5px}.dg-svg rect.h{fill:#EEEDFE;stroke:#7F77DD}.dg-svg rect.c{fill:#f7f7f4;stroke:#bbb}' +
    'body.dark .dg-svg rect.b{fill:#1f2125;stroke:#a69ef2}body.dark .dg-svg text{fill:#e6e6e6}body.dark .dg-svg .ln{stroke:#9aa0a6}' +
    'body.dark .dg-svg .ar{fill:#9aa0a6}body.dark .dg-svg .lb{fill:#b8b8b8}body.dark .dg-svg rect.h{fill:#2a2840;stroke:#a69ef2}body.dark .dg-svg rect.c{fill:#25282c;stroke:#555}';
  document.head.appendChild(st);

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function wrap(s, max) {
    var words = String(s).split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }
  /* box measuring: returns {lines, w, h} for text wrapped to ~max chars */
  function measure(s, max) {
    var lines = wrap(s, max || 18), longest = 0;
    lines.forEach(function (l) { if (l.length > longest) longest = l.length; });
    return { lines: lines, w: Math.max(54, Math.ceil(longest * CW) + PADX * 2), h: lines.length * LH + PADY * 2 };
  }
  function box(svg, x, y, w, h, lines, cls) {
    el('rect', { x: x, y: y, width: w, height: h, rx: 7, 'class': cls || 'b' }, svg);
    lines.forEach(function (l, i) {
      var t = el('text', { x: x + w / 2, y: y + PADY + LH * (i + 0.78), 'text-anchor': 'middle' }, svg); t.textContent = l;
    });
  }
  function arrow(svg, x1, y1, x2, y2, label) {
    el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'ln' }, svg);
    var a = Math.atan2(y2 - y1, x2 - x1), s = 6;
    el('polygon', { 'class': 'ar', points: [x2, y2, x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45), x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)].join(',') }, svg);
    if (label) {
      var t = el('text', { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 4, 'text-anchor': 'middle', 'class': 'lb' }, svg); t.textContent = label;
    }
  }
  function mk(w, h) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.setAttribute('width', w); svg.setAttribute('class', 'dg-svg');
    svg.setAttribute('role', 'img'); return svg;
  }

  var draw = {
    flow: function (d) {
      var ms = d.n.map(function (s) { return measure(s, d.v ? 28 : 14); }), e = d.e || [], i;
      var tot = ms.reduce(function (a, m, k) { return a + m.w + (e[k] ? Math.max(GAP, e[k].length * 5.6 + 12) : GAP); }, 0);
      if (tot > 540) { d = { n: d.n, e: d.e, v: 1 }; ms = d.n.map(function (s) { return measure(s, 28); }); }
      if (d.v) {
        var W = Math.max.apply(null, ms.map(function (m) { return m.w; })) + 40, y = 8, ys = [];
        ms.forEach(function (m, k) { ys.push(y); y += m.h + GAP - 6; });
        var svg = mk(W, y - GAP + 14);
        ms.forEach(function (m, k) { box(svg, (W - m.w) / 2, ys[k], m.w, m.h, m.lines); });
        for (i = 0; i < ms.length - 1; i++) arrow(svg, W / 2, ys[i] + ms[i].h, W / 2, ys[i + 1] - 1, e[i]);
        return svg;
      }
      var hmax = Math.max.apply(null, ms.map(function (m) { return m.h; })), x = 8, xs = [];
      var gaps = ms.map(function (m, k) { return e[k] ? Math.max(GAP, e[k].length * 5.6 + 12) : GAP; });
      ms.forEach(function (m, k) { xs.push(x); x += m.w + (k < ms.length - 1 ? gaps[k] : 0); });
      var svg2 = mk(x + 8, hmax + 24);
      ms.forEach(function (m, k) { box(svg2, xs[k], 12 + (hmax - m.h) / 2, m.w, m.h, m.lines); });
      for (i = 0; i < ms.length - 1; i++) arrow(svg2, xs[i] + ms[i].w, 12 + hmax / 2, xs[i + 1] - 1, 12 + hmax / 2, e[i]);
      return svg2;
    },
    tiers: function (d) {
      var rows = d.rows.map(function (r) { return r.map(function (s) { return measure(s, 16); }); });
      var rw = rows.map(function (r) { return r.reduce(function (a, m) { return a + m.w; }, 0) + (r.length - 1) * 16; });
      var W = Math.max.apply(null, rw) + 24, y = 8, pos = [];
      rows.forEach(function (r, ri) {
        var hm = Math.max.apply(null, r.map(function (m) { return m.h; })), x = (W - rw[ri]) / 2, row = [];
        r.forEach(function (m) { row.push({ x: x, y: y, w: m.w, h: hm, m: m }); x += m.w + 16; });
        pos.push(row); y += hm + GAP;
      });
      var svg = mk(W, y - GAP + 16);
      pos.forEach(function (row) { row.forEach(function (p) { box(svg, p.x, p.y, p.w, p.h, p.m.lines); }); });
      for (var i = 0; i < pos.length - 1; i++) {
        var a = pos[i], b = pos[i + 1], lab = (d.lab || [])[i];
        a.forEach(function (p, pi) {
          b.forEach(function (q, qi) {
            if (a.length > 1 && b.length > 1 && a.length === b.length && pi !== qi) return;
            arrow(svg, p.x + p.w / 2, p.y + p.h, q.x + q.w / 2, q.y - 1, (pi === 0 && qi === 0) ? lab : '');
          });
        });
      }
      return svg;
    },
    fan: function (d) {
      var s = measure(d.src, 14), t = measure(d.dst, 14), mids = d.mid.map(function (m) { return measure(m, 14); });
      var mh = Math.max.apply(null, mids.map(function (m) { return m.h; })), total = mids.length * (mh + 12) - 12;
      var H = Math.max(total, s.h, t.h) + 24, gap = Math.max(60, (d.l1 || d.l2) ? 84 : 60);
      var mw = Math.max.apply(null, mids.map(function (m) { return m.w; }));
      var W = s.w + gap + mw + gap + t.w + 16, svg = mk(W, H), cy = H / 2;
      box(svg, 8, cy - s.h / 2, s.w, s.h, s.lines, 'b h');
      var mx = 8 + s.w + gap, tx = mx + mw + gap, y0 = (H - total) / 2;
      box(svg, tx, cy - t.h / 2, t.w, t.h, t.lines, 'b h');
      mids.forEach(function (m, i) {
        var y = y0 + i * (mh + 12);
        box(svg, mx + (mw - m.w) / 2, y + (mh - m.h) / 2, m.w, m.h, m.lines);
        arrow(svg, 8 + s.w, cy, mx + (mw - m.w) / 2 - 1, y + mh / 2, i === 0 ? d.l1 : '');
        arrow(svg, mx + (mw + m.w) / 2, y + mh / 2, tx - 1, cy, i === 0 ? d.l2 : '');
      });
      return svg;
    },
    loop: function (d) {
      var ms = d.n.map(function (s) { return measure(s, 14); }), n = ms.length, R = Math.max(70, n * 22);
      var W = 2 * R + 140, H = 2 * R + 70, cx = W / 2, cy = H / 2, svg = mk(W, H), pts = [];
      ms.forEach(function (m, i) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(a) * 1.15, y = cy + R * Math.sin(a);
        pts.push({ x: x, y: y, m: m }); box(svg, x - m.w / 2, y - m.h / 2, m.w, m.h, m.lines);
      });
      for (var i = 0; i < n; i++) {
        var p = pts[i], q = pts[(i + 1) % n], dx = q.x - p.x, dy = q.y - p.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        var sx = p.x + dx / L * Math.min(p.m.w / 2 + 2, L / 3), sy = p.y + dy / L * Math.min(p.m.h / 2 + 2, L / 3);
        var ex = q.x - dx / L * Math.min(q.m.w / 2 + 3, L / 3), ey = q.y - dy / L * Math.min(q.m.h / 2 + 3, L / 3);
        arrow(svg, sx, sy, ex, ey);
      }
      if (d.c) { var t = el('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', 'class': 'lb' }, svg); t.textContent = d.c; }
      return svg;
    },
    cmp: function (d) {
      var cols = [d.a, d.b].map(function (c) { return c.map(function (s, i) { return measure(s, 30); }); });
      var cw = Math.max.apply(null, [].concat(cols[0], cols[1]).map(function (m) { return m.w; })), W = cw * 2 + 36;
      var ys = [0, 0], H = 0, svg;
      var hs = cols.map(function (c) { return c.reduce(function (a, m) { return a + m.h + 6; }, 0); });
      H = Math.max(hs[0], hs[1]) + 16; svg = mk(W, H);
      cols.forEach(function (c, ci) {
        var x = 8 + ci * (cw + 20), y = 8;
        c.forEach(function (m, i) { box(svg, x, y, cw, m.h, m.lines, i === 0 ? 'b h' : 'b c'); y += m.h + 6; });
      });
      return svg;
    }
  };

  function build(n, d) {
    var fn = draw[d.t]; if (!fn) return null;
    var b = document.createElement('div'); b.className = 'dg-block'; b.setAttribute('data-dg', n);
    var t = document.createElement('div'); t.className = 'dg-title'; t.textContent = '🗺 ' + (d.title || 'Diagram'); b.appendChild(t);
    var sc = document.createElement('div'); sc.className = 'dg-scroll';
    try { var svg = fn(d); svg.setAttribute('aria-label', d.title || 'Diagram'); sc.appendChild(svg); } catch (e) { return null; }
    b.appendChild(sc); return b;
  }
  function inject() {
    var cards = document.querySelectorAll('.q-card[id^="card-"]');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], n = c.id.slice(5), d = set[n];
      if (!d) continue;
      var body = c.querySelector('.q-body');
      if (!body || body.querySelector('.dg-block')) continue;
      var blk = build(n, d); if (!blk) continue;
      var docs = body.querySelector('.docs-block');
      var sp = body.querySelector('.sp-block');
      if (sp && sp.nextSibling) body.insertBefore(blk, sp.nextSibling); else if (docs) body.insertBefore(blk, docs); else body.appendChild(blk);
    }
  }
  var pending = false;
  new MutationObserver(function () {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; inject(); });
  }).observe(document.body, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();
