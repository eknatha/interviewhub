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
    '.vp-fab{position:fixed;left:14px;bottom:14px;z-index:9998;font:inherit;font-size:12px;font-weight:600;padding:7px 12px;border-radius:99px;border:1px solid #1D9E75;background:#fff;color:#0F6E56;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18)}' +
    'body.dark .vp-fab{background:#16241f;color:#4dd4a8;border-color:#4dd4a8}' +
    '.vp-panel{position:fixed;left:14px;bottom:56px;z-index:9998;width:min(320px,calc(100vw - 28px));padding:12px 14px;border-radius:12px;border:1px solid #1D9E75;background:#fff;color:#222;font-size:13px;line-height:1.5;box-shadow:0 6px 24px rgba(0,0,0,.25)}' +
    'body.dark .vp-panel{background:#16241f;color:#e6efe9;border-color:#4dd4a8}' +
    '.vp-panel label{display:block;margin-top:8px;font-weight:600;font-size:12px}.vp-panel select,.vp-panel input[type=range]{width:100%;margin-top:3px;font:inherit;font-size:12px}' +
    '.vp-panel .vp-row{display:flex;gap:8px;margin-top:10px}.vp-panel .vp-note{margin-top:8px;font-size:11px;opacity:.7}' +
    '.vp-acc{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.vp-acc button{font:inherit;font-size:11px;font-weight:600;padding:3px 9px;border-radius:99px;border:1px solid #1D9E75;background:transparent;color:inherit;cursor:pointer}.vp-acc button.on{background:#1D9E75;color:#fff}.vp-acc button:disabled{opacity:.4;cursor:not-allowed}' +
    '.vp-panel .vp-chk{display:flex;gap:6px;align-items:flex-start;font-weight:500}' +
    '.sp-nav{display:flex;gap:6px;align-items:center;margin-top:8px;font-size:12px}.sp-nav[hidden]{display:none}.sp-nav .sp-cnt{opacity:.7;margin-left:4px}' +
    '.sp-s{cursor:pointer;border-radius:4px;padding:0 1px}.sp-s:hover{background:rgba(29,158,117,.12)}.sp-s.cur{background:rgba(29,158,117,.28);box-shadow:0 0 0 2px rgba(29,158,117,.28)}body.dark .sp-s.cur{background:rgba(77,212,168,.28)}' +
    '@media (max-width:640px){.vp-fab{left:auto;right:12px;bottom:12px;min-height:46px;padding:10px 16px;font-size:14px}.vp-panel{left:8px;right:8px;width:auto;bottom:70px;max-height:72vh;overflow-y:auto;font-size:14px}.vp-panel select{min-height:42px;font-size:16px}.vp-acc button{min-height:38px;font-size:13px;padding:4px 12px}.vp-panel input[type=range]{min-height:34px}.sp-title{flex:1 1 100%}.sp-timer{text-align:left}.sp-head .sp-btn{flex:1 1 auto;min-height:42px}.sp-nav .sp-btn{flex:1 1 40%;min-height:44px}.sp-s{padding:2px 1px}}' +
    '@media print{.sp-nav{display:none!important}.sp-s.cur{background:none;box-shadow:none}.sp-btn,.sp-timer,.sp-rec,.vp-fab,.vp-panel{display:none!important}}';
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
    var nav = el('div', 'sp-nav'); nav.hidden = true;
    [['prev', '⏮ Prev'], ['next', '⏭ Next']].forEach(function (x) { var nb = el('button', 'sp-btn', x[1]); nb.setAttribute('data-act', x[0]); nav.appendChild(nb); });
    nav.appendChild(el('span', 'sp-cnt', ''));
    b.appendChild(head); b.appendChild(nav); b.appendChild(hint); b.appendChild(rec); b.appendChild(text);
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

  // ---- voice settings (voice, speed, pitch) shared by all guides; saved in this browser only
  var VS = { voice: '', rate: 0.98, pitch: 1, accent: '', step: false };
  try { var sv = JSON.parse(localStorage.getItem('ih_voice') || '{}'); if (sv.voice != null) VS.voice = sv.voice; if (sv.rate) VS.rate = +sv.rate; if (sv.pitch) VS.pitch = +sv.pitch; if (sv.accent) VS.accent = sv.accent; if (sv.step) VS.step = true; } catch (e) {}
  function saveVS() { try { localStorage.setItem('ih_voice', JSON.stringify(VS)); } catch (e) {} }
  function allVoices() { try { return window.speechSynthesis.getVoices() || []; } catch (e) { return []; } }
  function region(x) { var m = (x.lang || '').replace('_', '-').match(/^en-([A-Za-z]{2})/i); return m ? m[1].toUpperCase() : ''; }
  function inAccent(x) { return !VS.accent || region(x) === VS.accent; }
  function pickVoice() {
    var v = allVoices(), i;
    if (VS.voice) for (i = 0; i < v.length; i++) if ((v[i].voiceURI === VS.voice || v[i].name === VS.voice) && inAccent(v[i])) return v[i];
    var best = null, score = -1;
    v.forEach(function (x) {
      var sc = 0, l = (x.lang || '').replace('_', '-');
      if (VS.accent) { if (region(x) !== VS.accent) return; sc += 6; }
      else if (/^en-IN/i.test(l)) sc += 6; else if (/^en/i.test(l)) sc += 3; else return;
      if (/natural|neural|premium|enhanced/i.test(x.name)) sc += 4;
      if (x.localService) sc += 1;
      if (sc > score) { score = sc; best = x; }
    });
    return best;
  }
  function sentences(t) {
    var parts = t.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*\s*/g) || [t], out = [], cur = '';
    parts.forEach(function (p) { if ((cur + p).length > 220 && cur) { out.push(cur); cur = p; } else cur += p; });
    if (cur) out.push(cur);
    return out;
  }
  function splitSentences(t) {
    var parts = t.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [t], out = [];
    parts.forEach(function (p) {
      p = p.trim(); if (!p) return;
      while (p.length > 200) { var k = p.lastIndexOf(', ', 180); if (k < 60) k = p.lastIndexOf(' ', 180); if (k < 40) break; out.push(p.slice(0, k + 1).trim()); p = p.slice(k + 1).trim(); }
      out.push(p);
    });
    return out;
  }
  var speakId = 0;
  function speakText(text, done) {
    var ss = window.speechSynthesis, id = ++speakId, q = sentences(text), v = pickVoice();
    ss.cancel();
    (function next(i) {
      if (id !== speakId || i >= q.length) { if (id === speakId && done) done(); return; }
      var u = new SpeechSynthesisUtterance(q[i]);
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = VS.rate; u.pitch = VS.pitch;
      u.onend = function () { next(i + 1); };
      u.onerror = function () { if (id === speakId && done) done(); };
      ss.speak(u);
    })(0);
  }
  // sentence-by-sentence reader for a spoken-answer block
  var L = null; // { b, btn, arr, i, id }
  function endListen() {
    if (!L) return; var o = L; L = null; o.id = -1; speakId++;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    o.btn.textContent = '🔊 Listen';
    o.b.querySelector('.sp-nav').hidden = true;
    var cur = o.b.querySelector('.sp-s.cur'); if (cur) cur.classList.remove('cur');
  }
  function playFrom(i) {
    if (!L) return; var o = L;
    if (i < 0) i = 0; if (i >= o.arr.length) { endListen(); return; }
    var id = ++speakId; o.i = i; o.id = id;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var spans = o.b.querySelectorAll('.sp-s');
    for (var k = 0; k < spans.length; k++) spans[k].classList.toggle('cur', k === i);
    if (spans[i] && spans[i].scrollIntoView) { try { spans[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
    o.b.querySelector('.sp-cnt').textContent = (i + 1) + ' / ' + o.arr.length + (VS.step ? ' · step mode' : '');
    var v = pickVoice(), u = new SpeechSynthesisUtterance(o.arr[i]);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = VS.rate; u.pitch = VS.pitch;
    u.onend = function () { if (id !== speakId || !L) return; if (VS.step) { o.b.querySelector('.sp-cnt').textContent = (i + 1) + ' / ' + o.arr.length + ' · press Next'; if (i + 1 >= o.arr.length) endListen(); } else playFrom(i + 1); };
    u.onerror = function (e) { if (id === speakId && e && e.error !== 'canceled' && e.error !== 'interrupted') endListen(); };
    window.speechSynthesis.speak(u);
  }
  function startListen(b, btn) {
    endListen(); stopSpeak();
    var n = b.getAttribute('data-sp'), arr = splitSentences(set[n].a), t = b.querySelector('.sp-text');
    t.innerHTML = '';
    arr.forEach(function (x, k) { var sp = el('span', 's-', ''); sp.className = 'sp-s'; sp.setAttribute('data-i', k); sp.textContent = x; t.appendChild(sp); t.appendChild(document.createTextNode(' ')); });
    show(b, true);
    b.querySelector('.sp-nav').hidden = false; btn.textContent = '■ Stop';
    L = { b: b, btn: btn, arr: arr, i: 0, id: 0 };
    playFrom(0);
  }
  function stopSpeak() { speakId++; try { window.speechSynthesis.cancel(); } catch (e) {} }

  function buildPanel() {
    if (!('speechSynthesis' in window) || document.querySelector('.vp-fab')) return;
    var fab = el('button', 'vp-fab', '🔊 Voice'); fab.setAttribute('aria-expanded', 'false');
    var p = el('div', 'vp-panel'); p.hidden = true;
    p.innerHTML = '<strong>Spoken-answer voice</strong>' +
      '<div class="vp-acc" role="group" aria-label="Accent"><button type="button" data-acc="">All</button><button type="button" data-acc="IN">🇮🇳 Indian</button><button type="button" data-acc="US">🇺🇸 US</button><button type="button" data-acc="GB">🇬🇧 UK</button></div>' +
      '<label>Voice<select class="vp-voice" aria-label="Voice"></select></label>' +
      '<label>Speed <span class="vp-rv"></span><input class="vp-rate" type="range" min="0.6" max="1.4" step="0.05"></label>' +
      '<label>Pitch <span class="vp-pv"></span><input class="vp-pitch" type="range" min="0.5" max="1.5" step="0.05"></label>' +
      '<label class="vp-chk"><input type="checkbox" class="vp-step"> Step mode: pause after each sentence (press Next)</label>' +
      '<div class="vp-row"><button class="sp-btn vp-prev" type="button">▶ Preview</button><button class="sp-btn vp-reset" type="button">Reset</button></div>' +
      '<div class="vp-note">Voices come from your browser/device. Names with Natural or Neural sound best. Saved on this device only.</div>';
    document.body.appendChild(fab); document.body.appendChild(p);
    var stp = p.querySelector('.vp-step'); stp.checked = !!VS.step; stp.onchange = function () { VS.step = stp.checked; saveVS(); };
    p.querySelectorAll('.vp-acc button').forEach(function (bt) { bt.onclick = function () { if (bt.disabled) return; VS.accent = bt.getAttribute('data-acc'); VS.voice = ''; saveVS(); fill(); }; });
    var sel = p.querySelector('.vp-voice'), r = p.querySelector('.vp-rate'), pt = p.querySelector('.vp-pitch');
    function fill() {
      var all = allVoices();
      p.querySelectorAll('.vp-acc button').forEach(function (bt) {
        var a = bt.getAttribute('data-acc'), n = a ? all.filter(function (x) { return region(x) === a; }).length : all.length;
        bt.disabled = !!a && !n; bt.title = a ? (n ? n + ' voice' + (n > 1 ? 's' : '') + ' on this device' : 'No such voice on this device') : '';
        bt.className = (VS.accent === a ? 'on' : '');
      });
      var v = all.filter(inAccent).sort(function (a, b) {
        var ea = /^en/i.test(a.lang) ? 0 : 1, eb = /^en/i.test(b.lang) ? 0 : 1;
        return ea - eb || (a.lang || '').localeCompare(b.lang || '') || a.name.localeCompare(b.name);
      });
      var cur = pickVoice();
      sel.innerHTML = '';
      v.forEach(function (x) {
        var o = document.createElement('option'); o.value = x.voiceURI || x.name;
        o.textContent = x.name + ' (' + x.lang + ')' + (x.localService ? '' : ' · online'); sel.appendChild(o);
      });
      if (!v.length) { var o = document.createElement('option'); o.textContent = 'No voices found on this device'; sel.appendChild(o); }
      else if (!cur || !inAccent(cur)) { VS.voice = ''; cur = pickVoice(); }
      if (cur) sel.value = cur.voiceURI || cur.name;
    }
    function lab() { p.querySelector('.vp-rv').textContent = '· ' + (+r.value).toFixed(2) + '×'; p.querySelector('.vp-pv').textContent = '· ' + (+pt.value).toFixed(2); }
    r.value = VS.rate; pt.value = VS.pitch; lab(); fill();
    try { window.speechSynthesis.addEventListener('voiceschanged', fill); } catch (e) { window.speechSynthesis.onvoiceschanged = fill; }
    sel.onchange = function () { VS.voice = sel.value; saveVS(); };
    r.oninput = function () { VS.rate = +r.value; lab(); saveVS(); };
    pt.oninput = function () { VS.pitch = +pt.value; lab(); saveVS(); };
    p.querySelector('.vp-prev').onclick = function () { speakText('Here is how your spoken answers will sound. Lead with the conclusion, then give one concrete example.'); };
    p.querySelector('.vp-reset').onclick = function () { VS.voice = ''; VS.accent = ''; VS.step = false; stp.checked = false; VS.rate = 0.98; VS.pitch = 1; saveVS(); r.value = VS.rate; pt.value = VS.pitch; lab(); fill(); };
    fab.onclick = function () { p.hidden = !p.hidden; fab.setAttribute('aria-expanded', String(!p.hidden)); if (p.hidden) stopSpeak(); };
  }
  if (document.body) buildPanel(); else document.addEventListener('DOMContentLoaded', buildPanel);

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
    var sp = e.target.closest && e.target.closest('.sp-s');
    if (sp && L && L.b === sp.closest('.sp-block')) { e.stopPropagation(); playFrom(+sp.getAttribute('data-i')); return; }
    var btn = e.target.closest && e.target.closest('.sp-btn'); if (!btn) return;
    e.stopPropagation();
    var b = btn.closest('.sp-block'), act = btn.getAttribute('data-act');
    if (act === 'show') { show(b, b.querySelector('.sp-text').hidden); return; }
    if (act === 'listen') {
      if (L && L.b === b) { endListen(); return; }
      startListen(b, btn); return;
    }
    if (act === 'next' && L && L.b === b) { playFrom(L.i + 1); return; }
    if (act === 'prev' && L && L.b === b) { playFrom(L.i - 1); return; }
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

  document.addEventListener('keydown', function (e) {
    if (!L || e.ctrlKey || e.metaKey || e.altKey || /input|select|textarea/i.test((e.target.tagName || ''))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); playFrom(L.i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); playFrom(L.i - 1); }
    else if (e.key === 'Escape') endListen();
  });
  var pending = false;
  new MutationObserver(function () {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; inject(); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== 'loading') inject(); else document.addEventListener('DOMContentLoaded', inject);
})();
