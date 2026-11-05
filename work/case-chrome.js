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
    '@media print{.cc{display:none}}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function link(cls, href, glyph, name, label) {
    var a = document.createElement('a');
    a.className = 'cc ' + cls;
    a.href = href;
    a.setAttribute('aria-label', label);
    a.title = label;
    a.textContent = glyph;
    if (name) {
      var s = document.createElement('span');
      s.className = 'cc-name';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = name;
      a.appendChild(s);
    }
    document.body.appendChild(a);
  }

  link('cc-top', d.notebook || '../../index.html#work-index', '↑ notebook', '', 'back to the notebook');
  if (d.prev) link('cc-side cc-prev', d.prev, '←', d.prevName, 'previous: ' + d.prevName);
  if (d.next) link('cc-side cc-next', d.next, '→', d.nextName, 'next: ' + d.nextName);

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
