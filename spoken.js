/* Spoken-answer layer for EknathaLabs guides.
 * Adds a "60-90 s spoken answer" block (speak-first practice timer, listen, follow-up probes) to any
 * question card that has an entry in window.SPOKEN[<guideKey>] (see spoken/<guideKey>.js).
 * Works offline / file:// (plain script tags, no fetch). Survives the guides' innerHTML re-renders.
 */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop() || '';
  var key = file.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
  var set = (window.SPOKEN || {})[key];
  if (!set) return;

  var css = '' +
    '.sp-block{margin:0 0 14px;padding:12px 14px;border:1px solid rgba(29,158,117,.35);border-left:4px solid #1D9E75;border-radius:10px;background:rgba(29,158,117,.07);font-size:14px;line-height:1.6}' +
    'body.dark .sp-block{background:rgba(77,212,168,.08);border-color:rgba(77,212,168,.35);border-left-color:#4dd4a8}' +
    '.sp-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    '.sp-title{font-weight:600;font-size:13px;flex:1;min-width:150px}' +
    '.sp-btn{font:inherit;font-size:12px;font-weight:600;padding:4px 11px;border-radius:99px;border:1px solid currentColor;background:transparent;color:#0F6E56;cursor:pointer}' +
    'body.dark .sp-btn{color:#4dd4a8}' +
    '.sp-btn:hover{background:rgba(29,158,117,.15)}' +
    '.sp-btn:focus-visible{outline:2px solid #1D9E75;outline-offset:2px}' +
    '.sp-timer{font-variant-numeric:tabular-nums;font-weight:700;font-size:15px;min-width:52px;text-align:right}' +
    '.sp-timer.low{color:#854F0B}.sp-timer.good{color:#0F6E56}.sp-timer.over{color:#A32D2D}' +
    'body.dark .sp-timer.low{color:#e0a64a}body.dark .sp-timer.good{color:#4dd4a8}body.dark .sp-timer.over{color:#f08a8a}' +
    '.sp-hint{margin-top:8px;font-size:12px;opacity:.75}' +
    '.sp-text{margin-top:10px;white-space:pre-wrap}' +
    '.sp-follow{margin-top:10px;font-size:13px}.sp-follow ul{margin:4px 0 0 18px}' +
    '.sp-dot{margin-left:4px;font-size:11px;opacity:.9}' +
    '.sp-rec{margin-top:10px;padding-top:8px;border-top:1px dashed rgba(127,127,127,.35);font-size:13px}.sp-rec audio{display:block;width:100%;max-width:420px;margin:6px 0}' +
    '.sp-rec a{font-size:12px;font-weight:600;color:#0F6E56}body.dark .sp-rec a{color:#4dd4a8}' +
    '.sp-btn.rec{color:#A32D2D}body.dark .sp-btn.rec{color:#f08a8a}.sp-recdot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#d32f2f;margin-right:5px;animation:spb 1s infinite}@keyframes spb{50%{opacity:.25}}' +
    '@media print{.sp-btn,.sp-timer,.sp-rec{display:none}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function words(t) { return t.trim().split(/\s+/).length; }
  function est(n) { return Math.round(words(set[n].a) / 2.4); } // ~144 wpm
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function build(n) {
    var d = set[n], b = el('div', 'sp-block'); b.setAttribute('data-sp', n);
    var head = el('div', 'sp-head');
    head.appendChild(el('span', 'sp-title', '🎙 Spoken answer · ~' + est(n) + ' s'));
    var timer = el('span', 'sp-timer', '0:00'); timer.setAttribute('aria-live', 'off');
    var bPractice = el('button', 'sp-btn', '▶ Practice'); bPractice.setAttribute('data-act', 'practice');
    var bShow = el('button', 'sp-btn', 'Show answer'); bShow.setAttribute('data-act', 'show');
    var bListen = el('button', 'sp-btn', '🔊 Listen'); bListen.setAttribute('data-act', 'listen');
    if (!('speechSynthesis' in window)) bListen.style.display = 'none';
    var bRec = el('button', 'sp-btn rec', '🎤 Record'); bRec.setAttribute('data-act', 'record');
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) bRec.style.display = 'none';
    [timer, bPractice, bRec, bShow, bListen].forEach(function (x) { head.appendChild(x); });
    var hint = el('div', 'sp-hint', 'Speak your own answer out loud first (target 60–90 s), then compare.');
    var text = el('div', 'sp-text', d.a); text.hidden = true;
    var rec = el('div', 'sp-rec'); rec.hidden = true;
    b.appendChild(head); b.appendChild(hint); b.appendChild(rec); b.appendChild(text);
    if (d.f && d.f.length) {
      var f = el('div', 'sp-follow'); f.hidden = true;
      f.appendChild(el('strong', '', 'Likely follow-ups'));
      var ul = el('ul'); d.f.forEach(function (q) { ul.appendChild(el('li', '', q)); });
      f.appendChild(ul); b.appendChild(f);
    }
    return b;
  }

  function inject() {
    var cards = document.querySelectorAll('.q-card[id^="card-"]');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], n = c.id.slice(5);
      if (!set[n]) continue;
      var body = c.querySelector('.q-body');
      if (body && !body.querySelector('.sp-block')) body.insertBefore(build(n), body.firstChild);
      var num = c.querySelector('.q-num');
      if (num && !num.querySelector('.sp-dot')) { var dot = el('span', 'sp-dot', '🎙'); dot.title = 'Has a spoken answer'; num.appendChild(dot); }
    }
  }

  var running = null; // { block, t0, iv }
  function stop(reveal) {
    if (!running) return;
    clearInterval(running.iv);
    var b = running.block, t = b.querySelector('.sp-timer'), secs = Math.round((Date.now() - running.t0) / 1000);
    var btn = b.querySelector('[data-act="practice"]'); if (btn) btn.textContent = '▶ Practice again';
    var rb = b.querySelector('[data-act="record"]'); if (rb) rb.innerHTML = '🎤 Record again';
    if (running.rec) { try { running.rec.stop(); } catch (e) {} }
    t.className = 'sp-timer ' + (secs < 60 ? 'low' : secs <= 90 ? 'good' : 'over');
    var hint = b.querySelector('.sp-hint');
    if (hint) hint.textContent = secs < 60 ? 'You spoke for ' + fmt(secs) + ' — a bit short. Add a concrete example or command.' :
      secs <= 90 ? 'You spoke for ' + fmt(secs) + ' — right in the 60–90 s window.' :
      'You spoke for ' + fmt(secs) + ' — over 90 s. Lead with the conclusion and trim detail.';
    running = null;
    if (reveal) show(b, true);
  }
  function show(b, on) {
    var t = b.querySelector('.sp-text'), f = b.querySelector('.sp-follow'), s = b.querySelector('[data-act="show"]');
    t.hidden = !on; if (f) f.hidden = !on; s.textContent = on ? 'Hide answer' : 'Show answer';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.sp-btn'); if (!btn) return;
    e.stopPropagation();
    var b = btn.closest('.sp-block'), act = btn.getAttribute('data-act');
    if (act === 'show') { show(b, b.querySelector('.sp-text').hidden); return; }
    if (act === 'listen') {
      var ss = window.speechSynthesis;
      if (ss.speaking) { ss.cancel(); btn.textContent = '🔊 Listen'; return; }
      var u = new SpeechSynthesisUtterance(set[b.getAttribute('data-sp')].a);
      u.rate = 0.98; u.onend = u.onerror = function () { btn.textContent = '🔊 Listen'; };
      btn.textContent = '■ Stop'; ss.speak(u); return;
    }
    if (act === 'record') {
      if (running && running.block === b && running.rec) { stop(true); return; }
      if (running) stop(false);
      var area = b.querySelector('.sp-rec');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var chunks = [], rec = new MediaRecorder(stream), timer = b.querySelector('.sp-timer'), t0 = Date.now();
        rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
        rec.onstop = function () {
          stream.getTracks().forEach(function (tr) { tr.stop(); });
          var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          var old = area.querySelector('audio'); if (old) URL.revokeObjectURL(old.src);
          area.innerHTML = '';
          area.appendChild(el('strong', '', 'Your recording (kept only in this tab, never uploaded)'));
          var au = document.createElement('audio'); au.controls = true; au.src = URL.createObjectURL(blob); area.appendChild(au);
          var dl = el('a', '', 'Download'); dl.href = au.src; dl.download = 'answer-q' + b.getAttribute('data-sp') + (/ogg/.test(blob.type) ? '.ogg' : /mp4/.test(blob.type) ? '.m4a' : '.webm'); area.appendChild(dl);
          area.appendChild(el('div', 'sp-hint', 'Now listen to yourself, then press Listen for the model answer and compare structure, examples and pace.'));
          area.hidden = false;
        };
        rec.start();
        btn.innerHTML = '<span class="sp-recdot"></span>■ Stop';
        show(b, false); area.hidden = true;
        running = { block: b, t0: t0, rec: rec };
        running.iv = setInterval(function () {
          var s = Math.round((Date.now() - running.t0) / 1000);
          timer.textContent = fmt(s); timer.className = 'sp-timer ' + (s < 60 ? 'low' : s <= 90 ? 'good' : 'over');
        }, 250);
      }).catch(function () {
        area.hidden = false; area.innerHTML = '';
        area.appendChild(el('div', 'sp-hint', 'Microphone not available or permission denied. Allow the microphone for this page, or use Practice (timer only).'));
      });
      return;
    }
    if (act === 'practice') {
      if (running && running.block === b) { stop(true); return; }
      if (running) stop(false);
      var timer = b.querySelector('.sp-timer'); show(b, false);
      btn.textContent = '■ Stop & compare';
      running = { block: b, t0: Date.now() };
      running.iv = setInterval(function () {
        var s = Math.round((Date.now() - running.t0) / 1000);
        timer.textContent = fmt(s);
        timer.className = 'sp-timer ' + (s < 60 ? 'low' : s <= 90 ? 'good' : 'over');
      }, 250);
    }
  }, true);

  var pending = false;
  new MutationObserver(function () {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; inject(); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== 'loading') inject(); else document.addEventListener('DOMContentLoaded', inject);
})();
