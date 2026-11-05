/* Case-page chrome, shared by all five pages.
   1. Floating nav: notebook link fixed top-right, previous/next fixed at the screen edges.
      Links come from data-* attributes on this script tag (data-prev, data-prev-name, data-next, data-next-name, data-notebook).
   2. Scroll-triggered CSS animation: every running CSS animation is paused until its element is on screen,
      and paused again when it leaves. Canvas and timer animations are gated in each page's own script. */
(function () {
  var me = document.currentScript;
  var d = me.dataset;

  var css = [
    '.cc{position:fixed;z-index:50;font-family:"B-McE",cursive;text-transform:lowercase;text-decoration:none;color:#8A8A82;line-height:1;opacity:.75;transition:color 160ms ease-out,opacity 160ms ease-out}',
    '.cc:hover,.cc:focus-visible{color:#3d3a8c;opacity:1}',
    '.cc:focus-visible{outline:1px dashed #3d3a8c;outline-offset:6px}',
    '.cc-top{top:14px;right:18px;font-size:21px}',
    '.cc-side{top:50%;transform:translateY(-50%);font-size:40px;padding:14px 6px}',
    '.cc-prev{left:8px}',
    '.cc-next{right:8px}',
    '.cc-name{position:absolute;top:50%;transform:translateY(-50%);font-size:19px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 160ms ease-out}',
    '.cc-prev .cc-name{left:100%}',
    '.cc-next .cc-name{right:100%;text-align:right}',
    '.cc-side:hover .cc-name,.cc-side:focus-visible .cc-name{opacity:1}',
    '@media (max-width:760px){.cc-top{top:8px;right:10px;font-size:17px}.cc-side{font-size:26px;padding:10px 2px;opacity:.55}.cc-prev{left:0}.cc-next{right:0}.cc-name{font-size:16px}}',
    '.cc-arrow{display:block;width:44px;height:30px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
    '.cc-top{display:flex;align-items:center;gap:6px}',
    '.cc-top .cc-up{width:16px;height:21px;stroke-width:3}',
    '.cc-ne{display:inline-block;width:14px;height:14px;vertical-align:-1px;stroke-width:3;margin:0 2px}',
    '@media (max-width:760px){.cc-arrow{width:30px;height:21px}.cc-top .cc-up{width:13px;height:17px}}',
    '@media print{.cc{display:none}}',
    'html.cc-win .cc,html.cc-win .cc-pager{display:none!important}',
    '.cc-side:active,.cc-side:focus,.cc-top:active,.cc-top:focus{opacity:1!important;color:#3d3a8c!important}',
    '.cc-side:active .cc-arrow,.cc-side:focus .cc-arrow,.cc-top:active .cc-up,.cc-top:focus .cc-up{filter:drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)}',
    '@media (hover:none){.cc-side:active,.cc-side:focus{background:rgba(255,255,255,.9);border-radius:999px;box-shadow:0 0 0 1.5px #fff,0 4px 12px rgba(0,0,0,.12)}.cc-side .cc-name{display:none}}',
    'html.touch-shield .phone:not(.iframe-on) iframe,html.touch-shield .frame:not(.iframe-on) iframe{pointer-events:none}',
    'html.touch-shield .phone:has(iframe):not(.iframe-on)::after,html.touch-shield .frame:has(iframe):not(.iframe-on)::after{content:"tap to use";position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:5;font:12px/1 var(--mono,ui-monospace),monospace;color:#fff;background:rgba(0,0,0,.62);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:7px 12px;pointer-events:none;white-space:nowrap}',
    /* no sideways scroll anywhere: code wraps inside its panel */
    '.code,pre{overflow-x:hidden!important;max-width:100%}',
    '.code pre,pre{white-space:pre-wrap!important;overflow-wrap:anywhere!important}',
    /* shared layout rules for every case page */
    /* 1 text spans the full content column: no narrow caps on any text block */
    'section.prose>*,.ed>*{max-width:none!important}',
    '.cap,figcaption,.why,.note,.note p,.hers,.logic,blockquote{max-width:none!important}',
    '.premise,.hero-head .claim,.claim,.stage,.ds-intro,.framing,.blk.solo{max-width:none!important}',
    '.hero-head>div:first-child{flex:1;min-width:0}',
    '.hero-head .claim{white-space:normal!important}',
    /* 2 the hero sits on the same 1280 container as every other section */
    '.hero{max-width:1280px;margin-left:auto!important;margin-right:auto!important}',
    '.hero-head{padding-left:0!important}',
    /* 2b hero type scale (instrument sans 400/600, jetbrains mono): title > lede > role > action */
    '.hero-head h1{font-size:44px!important;line-height:48px!important;font-weight:600!important;letter-spacing:-.02em}',
    '.hero-head h1+p{font-size:22px!important;line-height:32px!important;font-weight:400!important;color:var(--ink)!important;margin-top:16px!important}',
    '.hero-head h1+p~.claim{font-size:17px!important;line-height:28px!important;font-weight:400!important;color:var(--ink)!important;margin-top:12px!important}',
    '.hero-head a.live{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:2px;margin-top:8px;padding:9px 16px!important;font-family:var(--mono);font-size:13px;line-height:20px;font-weight:400;color:var(--ink);text-decoration:none;border:1px solid var(--ink);border-radius:999px;white-space:nowrap;transition:background-color .15s,color .15s}',
    '.hero-head:has(a.live){flex-direction:column;justify-content:flex-start;gap:0}',
    '.hero-head:has(a.live)>div:first-child{width:100%}',
    '.hero-head a.live{margin-top:24px!important}',
    '@media (min-width:901px){.hero-head{position:relative}.hero-head>div:first-child~:not(a.live){position:absolute;top:0;right:0}}',
    '.hero-head a.live .cc-ne{width:12px!important;height:12px!important;margin:0 4px!important}',
    '.hero-head a.live:hover,.hero-head a.live:focus-visible{background:var(--ink);color:var(--bg)}',
    '@media (max-width:900px){.hero-head h1{font-size:36px!important;line-height:40px!important}.hero-head h1+p{font-size:19px!important;line-height:28px!important}.hero-head h1+p~.claim{font-size:16px!important;line-height:26px!important}.hero-head a.live{margin-top:20px!important}}',
    /* 2c sitewide type scale: display 44 > lede 22 > body 17 > card 14 > label/caption/button 13 mono; notes 23 hand.
       product specimens (.fc .chip .status .ladder span .v-* .reg .mark-word .w98 svg) keep the product's own type. */
    'section.prose,.ed{display:block!important}',
    'section.prose>*,.ed>*{max-width:none!important}',
    'section.prose>h2+.hand,.ed>h2+.hand{margin:0 0 12px!important}',
    'h2{font-family:var(--mono)!important;font-size:13px!important;line-height:20px!important;font-weight:400!important;color:var(--muted)!important;margin-bottom:16px!important}',
    '.intro,.manifesto p.intro,.call p{font-size:22px!important;line-height:32px!important;font-weight:400!important}',
    '.framing,.manifesto p:not(.intro),.note li,.hers{font-size:17px!important;line-height:28px!important}',
    '.hop .t,.rung .t{font-size:14px!important;line-height:20px!important;font-weight:600!important}',
    '.knob .what{font-size:14px!important;line-height:20px!important}',
    '.cap,.why,figcaption,.sw p,.stage,.tok p,.tok .name,.tok .why,.ladder small,.voices .k,.hop .r,.hop .n,.rung .r,.ilab,.funnel span,.argue,.say,.read,.steps,.bars,.states,.mono,.hud,.live-tag,.live .live-tag{font-family:var(--mono)!important;font-size:13px!important;line-height:20px!important;font-weight:400!important}',
    '.cap,.why,figcaption,.funnel span,.ladder small,.voices .k,.hop .r,.rung .r{color:var(--muted)!important}',
    'pre:not(.code){font-size:13px!important;line-height:20px!important}',
    '.live-run,.jctl button,.live .chips button,.live .run{font-family:var(--mono)!important;font-size:13px!important;line-height:20px!important;font-weight:400!important;padding:9px 16px!important;border-radius:999px!important}',
    '.live-run,.jctl button{color:var(--ink)!important;border:1px solid var(--ink)!important;background:transparent}',
    '.live-run:hover,.jctl button:hover{background:var(--ink)!important;color:var(--bg)!important}',
    '@media (max-width:900px){.intro,.manifesto p.intro,.call p{font-size:19px!important;line-height:28px!important}.framing,.manifesto p:not(.intro),.note li,.hers{font-size:16px!important;line-height:26px!important}pre:not(.code){font-size:11.5px!important;line-height:18px!important}}',
    /* captions: clear space before the text that follows */
    '.cap+.why+*,figure:has(figcaption)+:not(figure):not(.art),.art:has(.cap)+:not(.art):not(figure){margin-top:var(--s4)!important}',
    /* 2d app tile: the product mark inline left of the title, app-store style, radius 22% */
    '.hero-head h1.has-tile{display:flex!important;align-items:center;gap:15px}',
    '.hero-head .app-tile{flex:none;display:block;width:56px!important;height:56px!important;border-radius:12px!important;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);transform:translateY(var(--tile-nudge,0))}',
    '@media (max-width:900px){.hero-head h1.has-tile{gap:14px}.hero-head .app-tile{width:44px!important;height:44px!important;border-radius:10px!important}}',
    /* 3 captions breathe before the text below them */
    '.cap+*:not(.cap):not(.why){margin-top:var(--s4)!important}',
    '.pair+.ed,.art+.ed{margin-top:var(--s3)!important}',
    /* 4 handwriting never clips: room above and below the glyphs */
    '.hand{padding-top:8px;padding-bottom:4px;line-height:1.3!important;overflow:visible}',
    /* 5 a windows 98 window around the large live website embeds */
    '.w98{display:flex;flex-direction:column;flex:1;min-height:0;border:2px solid;border-color:#fff #404040 #404040 #fff;background:#d4d0c8;box-shadow:1px 1px 0 #000,0 24px 48px rgba(0,0,0,.08);padding:3px}',
    '.w98-bar{height:24px;flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 3px 0 6px;background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font:bold 12px/1 Tahoma,"MS Sans Serif",Geneva,sans-serif;letter-spacing:0;text-transform:none}',
    '.w98-bar span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.w98-btns{display:flex;gap:2px;flex:none}',
    '.w98-btns i{display:block;width:18px;height:16px;border:2px solid;border-color:#fff #404040 #404040 #fff;background:#d4d0c8;color:#000;font:bold 11px/11px Arial,sans-serif;font-style:normal;text-align:center}',
    '.w98-addr{flex:none;display:flex;align-items:center;gap:6px;margin:3px 0;font:11px Tahoma,"MS Sans Serif",sans-serif;color:#000}',
    '.w98-addr b{flex:1;font-weight:400;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.w98 .frame{border-radius:0!important;border:2px solid;border-color:#808080 #fff #fff #808080!important;box-shadow:none!important}',
    '@media (max-width:600px){.w98-addr span{display:none}}',
    /* phones (<=600px): 30px side margins; prev/next stay fixed mid-screen inside the margin, recede while scrolling, return at rest */
    '@media (max-width:600px){:root{--pad:30px!important}' +
      '.cc-pager .cc-side{top:50%;transform:translateY(-50%);width:30px;min-height:72px;padding:10px 0;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:inherit;opacity:.85;-webkit-tap-highlight-color:transparent;transition:opacity 220ms ease-out,transform 220ms ease-out,color 160ms ease-out;touch-action:manipulation}' +
      '.cc-pager .cc-prev{left:0}.cc-pager .cc-next{right:0}' +
      '.cc-pager .cc-arrow{width:22px;height:15px;stroke-width:3}' +
      '.cc-pager .cc-name{display:block!important;position:static;transform:none;opacity:1;font-size:13px;line-height:1;writing-mode:vertical-rl;white-space:nowrap;transition:opacity 220ms ease-out}' +
      '.cc-pager .cc-prev .cc-name{transform:rotate(180deg)}' +
      'html.cc-moving .cc-pager .cc-side{opacity:.15}' +
      'html.cc-moving .cc-pager .cc-name{opacity:0}' +
      '.cc-pager .cc-side:active,.cc-pager .cc-side:focus{opacity:1!important;transform:translateY(-50%)!important;background:none!important;box-shadow:none!important;color:#3d3a8c}' +
      '.cc-pager .cc-side:focus-visible{outline-offset:-2px}' +
      '.cc-pager .cc-side:active .cc-name,.cc-pager .cc-side:focus .cc-name{opacity:1}' +
      '@media (prefers-reduced-motion:reduce){.cc-pager .cc-side{transition:opacity 120ms linear}}}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* hand-drawn arrows: wobbly single strokes, round caps, like a pen line */
  var ARROW = {
    left: '<svg class="cc-arrow" viewBox="0 0 48 32" aria-hidden="true"><path d="M44 17.2c-6.1-.9-12.8.6-19.3.1-5.4-.4-11.2-1.3-18.1-.3"/><path d="M15.6 6.9c-3.4 3.2-6.8 6.4-9.8 10.2 3.1 2.6 6.9 5.3 10.6 8.4"/></svg>',
    right: '<svg class="cc-arrow" viewBox="0 0 48 32" aria-hidden="true"><path d="M4 15.4c6.3 1.1 12.4-.7 19.1-.2 5.6.4 11.1 1.6 18.4.6"/><path d="M32.1 5.8c3.6 3.3 6.9 6.8 9.9 10.4-3.3 2.8-6.6 5.6-10.3 9.1"/></svg>',
    up: '<svg class="cc-arrow cc-up" viewBox="0 0 32 40" aria-hidden="true"><path d="M16.6 36c.6-5.4-.9-11.7-.3-17.6.4-4.2.6-8.1-.2-13.1"/><path d="M6.2 14.8c3.3-3.2 6.4-6.6 9.9-9.9 3.4 3.1 6.7 6.6 9.8 10.3"/></svg>',
    ne: '<svg class="cc-arrow cc-ne" viewBox="0 0 32 32" aria-hidden="true"><path d="M6.3 26.1c3.8-3.4 7.1-7.5 10.9-11.1 2.8-2.7 5.6-5.6 8.4-8.9"/><path d="M11.8 6.4c4.5.2 9.1-.5 13.9-.4.3 4.4-.1 9 .4 13.7"/></svg>'
  };
  window.ccArrow = ARROW;
  function link(cls, href, glyph, name, label, parent) {
    var a = document.createElement('a');
    a.className = 'cc ' + cls;
    a.href = href;
    a.setAttribute('aria-label', label);
    a.title = label;
    a.innerHTML = glyph;
    if (name) {
      var s = document.createElement('span');
      s.className = 'cc-name';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = name;
      a.appendChild(s);
    }
    (parent || document.body).appendChild(a);
  }

  /* inside the notebook's windows 98 window (?win=1): the window's own toolbar replaces the floating nav,
     and the hotkeys are handed up to it */
  var inWin = /[?&]win=1(&|$)/.test(location.search) && window.parent !== window;
  if (inWin) {
    document.documentElement.classList.add('cc-win');
    /* lazy embeds set iframe.src after load, which would add entries to the tab's history and make
       the browser's back button step through embeds instead of closing the window: replace instead */
    var srcDesc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
    if (srcDesc && srcDesc.set) Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
      configurable: true, get: srcDesc.get,
      set: function (v) {
        if (this.isConnected && this.contentWindow) {
          try { this.contentWindow.location.replace(new URL(v, location.href).href); return; } catch (err) {}
        }
        srcDesc.set.call(this, v);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      if (document.querySelector('.lb, [aria-modal="true"]')) return;
      var k = e.key === 'Escape' ? 'esc' : e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : '';
      if (k) { e.preventDefault(); parent.postMessage({ ww: k }, location.origin); }
    });
  }
  if (!inWin) link('cc-top', d.notebook || '../../index.html#work-index', ARROW.up + '<span>notebook</span>', '', 'back to the notebook');
  /* prev/next live in one nav: fixed at the screen edges on desktop, an in-flow pager at the page end on phones */
  var pager = document.createElement('nav');
  pager.className = 'cc-pager';
  pager.setAttribute('aria-label', 'case studies');
  document.body.appendChild(pager);
  if (inWin) pager.hidden = true;
  if (d.prev) link('cc-side cc-prev', d.prev, ARROW.left, d.prevName, 'previous: ' + d.prevName, pager);
  if (d.next) link('cc-side cc-next', d.next, ARROW.right, d.nextName, 'next: ' + d.nextName, pager);
  /* phones: the edge arrows recede while the reader scrolls fast, and return as soon as she slows to a near-pause (under 4px per event for 120ms) or stops (150ms) */
  var ccRest = 0, ccRoot = document.documentElement, ccY = scrollY, ccFast = 0;
  function ccShow() { ccRoot.classList.remove('cc-moving'); }
  addEventListener('scroll', function () {
    if (!matchMedia('(max-width:600px)').matches) return;
    var y = scrollY, dy = Math.abs(y - ccY), now = Date.now();
    ccY = y;
    clearTimeout(ccRest);
    if (dy >= 4) { ccFast = now; ccRoot.classList.add('cc-moving'); }
    else if (now - ccFast >= 120) { ccShow(); return; }
    ccRest = setTimeout(ccShow, 150);
  }, { passive: true });
  /* back to the notebook: the page pulls back, then the notebook finishes the zoom out onto this project's tile */
  var top = document.querySelector('.cc-top');
  if (top) top.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var m = location.pathname.match(/work\/([^\/]+)\//);
    var slug = m ? (m[1] === 'winged-web' ? 'winged-app' : m[1]) : '';
    try { sessionStorage.setItem('wi-from', slug); } catch (err) {}
    /* no fade and no paper wash: the case page holds until the notebook paints, the notebook arrives on
       its desk canvas with the spread already decoded (prefetched below) */
  });
  if (top && !inWin) {
    var warm = function () {
      ['assets/tabletop/open-comp-blank.png', 'assets/source-painting/plain_canvas.png'].forEach(function (p) {
        var i = new Image(); i.src = new URL('../../' + p, location.href).href;
      });
    };
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 3000 }); else setTimeout(warm, 1500);
  }
  /* hotkeys: esc goes back to the notebook (lightboxes close first), left and right walk the cases */
  if (!inWin) document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (document.querySelector('.lb, [aria-modal="true"]')) return;
    var go = null;
    if (e.key === 'Escape') go = document.querySelector('.cc-top');
    else if (e.key === 'ArrowLeft') go = document.querySelector('.cc-prev');
    else if (e.key === 'ArrowRight') go = document.querySelector('.cc-next');
    if (go) { e.preventDefault(); go.click(); }
  });
  /* touch: an embedded app or site never traps the page's scroll. it stays inert until tapped,
     then goes inert again once it scrolls out of view */
  if (matchMedia('(hover:none), (pointer:coarse)').matches) {
    document.documentElement.classList.add('touch-shield');
    var live = [];
    document.addEventListener('click', function (e) {
      var box = e.target.closest && e.target.closest('.phone, .frame');
      if (!box || !box.querySelector('iframe') || box.classList.contains('iframe-on')) return;
      e.preventDefault();
      for (var el = box; el; el = el.parentElement) if (el.matches('.phone, .frame')) { el.classList.add('iframe-on'); live.push(el); }
    }, true);
    addEventListener('scroll', function () {
      live = live.filter(function (b) { var r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) { b.classList.remove('iframe-on'); return false; } return true; });
    }, { passive: true });
  }
  /* "visit live" links: the typed arrow becomes the same hand-drawn stroke */
  document.querySelectorAll('a.live').forEach(function (a) {
    a.innerHTML = a.innerHTML.replace('\u2197', ARROW.ne);
  });

  /* scroll-triggered CSS animations */
  if (!('IntersectionObserver' in window) || !document.getAnimations) return;
  function gate() {
    document.getAnimations().forEach(function (a) {
      if (!(window.CSSAnimation && a instanceof CSSAnimation) || a.__gated) return;
      var el = a.effect && a.effect.target;
      if (!el) return;
      a.__gated = true;
      a.pause();
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) a.play(); else a.pause(); });
      });
      io.observe(el);
    });
  }
  gate();
  window.addEventListener('load', gate);
})();
