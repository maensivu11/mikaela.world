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
    /* shared layout rules for every case page */
    /* 1 text spans the full content column: no narrow caps on any text block */
    'section.prose>*,.ed>*{max-width:none!important}',
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
    '@media (max-width:600px){.w98-addr span{display:none}}'
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
  function link(cls, href, glyph, name, label) {
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
    document.body.appendChild(a);
  }

  link('cc-top', d.notebook || '../../index.html#work-index', ARROW.up + '<span>notebook</span>', '', 'back to the notebook');
  if (d.prev) link('cc-side cc-prev', d.prev, ARROW.left, d.prevName, 'previous: ' + d.prevName);
  if (d.next) link('cc-side cc-next', d.next, ARROW.right, d.nextName, 'next: ' + d.nextName);
  /* back to the notebook: the page pulls back, then the notebook finishes the zoom out onto this project's tile */
  var top = document.querySelector('.cc-top');
  if (top) top.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var m = location.pathname.match(/work\/([^\/]+)\//);
    var slug = m ? (m[1] === 'winged-web' ? 'winged-app' : m[1]) : '';
    try { sessionStorage.setItem('wi-from', slug); } catch (err) {}
    if (!document.body.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    var href = top.href;
    document.documentElement.style.background = '#f6f0e0';
    var a1 = document.body.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.82)', opacity: 0 }], { duration: 240, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    document.body.style.transformOrigin = '50% ' + (scrollY + innerHeight / 2) + 'px';
    a1.finished.then(function () { location.href = href; }, function () { location.href = href; });
  });
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
