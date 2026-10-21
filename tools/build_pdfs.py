#!/usr/bin/env python3
"""Builds printable PDFs of every guide into pdf/ using headless Chromium (Playwright).

    pip install playwright && playwright install chromium     # once
    python3 tools/build_pdfs.py                  # all guides
    python3 tools/build_pdfs.py kubernetes linux # only these (guide key = file name without _interview_guide.html)

Run it after content changes (spoken answers, docs links) so the PDFs match the site.
"""
import os, re, sys, glob
from playwright.sync_api import sync_playwright

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
out = os.path.join(root, 'pdf')
os.makedirs(out, exist_ok=True)
want = set(sys.argv[1:])
key = lambda f: re.sub(r'(_interview)?_guide\.html$', '', os.path.basename(f))

footer = ('<div style="width:100%;font-size:7.5px;color:#666;padding:0 14mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif">'
          '<span>EknathaLabs &middot; interviewhub.eknathalabs.com</span>'
          '<span><span class="title"></span> &middot; page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')

with sync_playwright() as p:
    b = p.chromium.launch()
    for f in sorted(glob.glob(os.path.join(root, '*_guide.html'))):
        k = key(f)
        if want and k not in want:
            continue
        pg = b.new_page()
        pg.goto('file://' + f)
        pg.wait_for_timeout(600)
        pg.evaluate("document.body.classList.remove('dark')")
        pg.emulate_media(media='print')
        # let beforeprint handlers (cover page, light mode) run, then render
        pg.evaluate("window.dispatchEvent(new Event('beforeprint'))")
        pg.wait_for_timeout(300)
        dest = os.path.join(out, os.path.basename(f).replace('.html', '.pdf'))
        pg.pdf(path=dest, format='A4', print_background=True, display_header_footer=True,
               header_template='<span></span>', footer_template=footer,
               margin={'top': '16mm', 'bottom': '18mm', 'left': '14mm', 'right': '14mm'}, prefer_css_page_size=False)
        print('%-52s %6.1f MB' % (os.path.basename(dest), os.path.getsize(dest) / 1e6))
        pg.close()
    b.close()
