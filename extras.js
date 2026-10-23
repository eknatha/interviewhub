/* Guide extras: "PDF" + "Print" buttons in the header, a print-only cover page, and light-mode printing.
 * Loaded by every *_guide.html. No network calls. */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop() || '';
  if (!/_guide\.html$/.test(file)) return;
  var pdf = 'pdf/' + file.replace(/\.html$/, '.pdf');

  var st = document.createElement('style');
  st.textContent =
    '.ekn-bar{display:inline-flex;gap:6px;align-items:center}' +
    '.ekn-btn{font:inherit;font-size:12px;font-weight:600;padding:4px 10px;border-radius:7px;border:1px solid #ddd;background:transparent;color:#185FA5;text-decoration:none;cursor:pointer;white-space:nowrap}' +
    'body.dark .ekn-btn{border-color:#2e3235;color:#7ab8f5}.ekn-btn:hover{border-color:#1D9E75}' +
    '.print-cover{display:none}';
  document.head.appendChild(st);

  function build() {
    var h = document.querySelector('header');
    if (h && !h.querySelector('.ekn-bar')) {
      var bar = document.createElement('span'); bar.className = 'ekn-bar';
      var a = document.createElement('a'); a.className = 'ekn-btn'; a.href = pdf; a.setAttribute('download', ''); a.title = 'Download the printable PDF of this guide'; a.textContent = '⬇ PDF';
      var b = document.createElement('button'); b.className = 'ekn-btn'; b.type = 'button'; b.title = 'Print this guide with every answer expanded'; b.textContent = '🖨 Print';
      b.onclick = function () { window.print(); };
      bar.appendChild(a); bar.appendChild(b);
      var dm = h.querySelector('.dm-btn');
      if (dm) h.insertBefore(bar, dm); else h.appendChild(bar);
    }
    if (!document.querySelector('.print-cover')) {
      var h1 = document.querySelector('header h1'), title = (h1 ? h1.textContent : document.title).replace(/\s*[—-]\s*Interview Guide\s*$/i, '').trim();
      var pill = document.querySelector('header span'), cnt = (document.title.match(/\((\d+)\s*Q/) || [])[1] || (pill && (pill.textContent.match(/\d+/) || [])[0]) || '';
      var spoken = document.querySelectorAll('.sp-block').length;
      var c = document.createElement('section'); c.className = 'print-cover';
      c.innerHTML = '<div class="pc-brand">InterviewHub · Interview Prep</div><h1></h1><div class="pc-sub">Platform, SRE &amp; DevOps interview guide</div>' +
        '<dl><dt>Questions</dt><dd class="pc-n"></dd><dt>Online (always latest)</dt><dd class="pc-u"></dd><dt>Printed</dt><dd class="pc-d"></dd></dl>' +
        '<p class="pc-note">Free to use and share for personal study. Answers are written for interview practice, so check command flags and versions against the official documentation before running anything in production.</p>';
      c.querySelector('h1').textContent = title;
      c.querySelector('.pc-n').textContent = (cnt ? cnt + ' questions' : '') + (spoken ? ' · spoken answers included' : '');
      c.querySelector('.pc-u').textContent = 'interviewhub.eknathalabs.com/' + file;
      c.querySelector('.pc-d').textContent = new Date().toISOString().slice(0, 10);
      document.body.insertBefore(c, document.body.firstChild);
    }
  }

  // always print in light mode, restore afterwards
  var wasDark = false;
  window.addEventListener('beforeprint', function () { wasDark = document.body.classList.contains('dark'); document.body.classList.remove('dark'); build(); var c = document.querySelector('.print-cover .pc-n'); if (c) { var s = document.querySelectorAll('.sp-block').length; if (s && c.textContent.indexOf('spoken') < 0) c.textContent += ' · spoken answers included'; } });
  window.addEventListener('afterprint', function () { if (wasDark) document.body.classList.add('dark'); });

  if (document.readyState !== 'loading') build(); else document.addEventListener('DOMContentLoaded', build);

  // Print/PDF watermark: small, faint, partly clipped at the bottom edge of every printed page.
  (function () {
    var st = document.createElement('style');
    st.textContent = '.ih-wm{display:none}@media print{.ih-wm{display:block;position:fixed;left:0;right:0;bottom:9mm;height:2.6mm;overflow:hidden;text-align:center;white-space:nowrap;font:700 8pt/5.2mm Arial,Helvetica,sans-serif;letter-spacing:.12em;color:rgba(15,110,86,.28);pointer-events:none;z-index:2147483645;-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
    document.head.appendChild(st);
    function add() { if (document.querySelector('.ih-wm') || !document.body) return; var d = document.createElement('div'); d.className = 'ih-wm'; d.setAttribute('aria-hidden', 'true'); d.textContent = 'certs.eknathalabs.com'; document.body.appendChild(d); }
    if (document.readyState !== 'loading') add(); else document.addEventListener('DOMContentLoaded', add);
  })();
})();
