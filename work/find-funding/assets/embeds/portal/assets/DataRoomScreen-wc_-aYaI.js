import{a as d,j as t,r as b,I as ne,o as ve,u as G,d as xe,A as we,e as _e,L as ye,E as Se,g as je}from"./index.demo-BIRfVLDx.js";import{f as k}from"./fillSlot-BoA1VEgU.js";import{E as Ee}from"./EmptyState-Bu6lhFer.js";const re=[{id:"sign_in",label:d["steps.sign_in"],gated:!1},{id:"registration",label:d["steps.registration"],gated:!1},{id:"acknowledgement",label:d["steps.acknowledgement"],gated:!1},{id:"data_room",label:d["steps.data_room"],gated:!1},{id:"subscription_documents",label:d["signing.step_label_unscheduled"],gated:!0},{id:"funding",label:d["wire.step_label_unscheduled"],gated:!0}],Re=!1;function Ne({currentStepId:e}){const a=re.filter(n=>!n.gated);re.filter(n=>n.gated);const s=a.findIndex(n=>n.id===e);return t.jsxs("nav",{className:"rail",children:[t.jsx("ol",{className:"rail-steps",children:a.map((n,u)=>t.jsx(Ae,{step:n,stateClass:Pe(u,s)},n.id))}),Re]})}function Pe(e,a){return e<a?"is-done":e===a?"is-current":""}function Ae({step:e,stateClass:a}){return t.jsxs("li",{className:`rail-step ${a}`.trim(),children:[t.jsx("span",{className:"rail-mark","aria-hidden":"true"}),t.jsx("span",{className:"rail-label",children:e.label})]})}const Ce=3.6,ke=De();function Le({x:e,y:a},s){return a===-1&&Math.abs(e)===1?"eye":s?Te(e,a)?"grin":"skin":Me(e,a)?"mouth":"skin"}function Te(e,a){return a===1&&Math.abs(e)<=2||a===2&&Math.abs(e)<=1}function Me(e,a){return a===1&&Math.abs(e)===2||a===2&&Math.abs(e)<=1}function De(){const e=[-3,-2,-1,0,1,2,3];return e.flatMap(s=>e.map(n=>({x:n,y:s}))).filter(({x:s,y:n})=>Math.hypot(s,n)<=Ce)}const se="(hover: hover) and (pointer: fine)",oe="(prefers-reduced-motion: reduce)",Ie=280,Fe=440,Oe=160,Ue=3;function Be(){const e=b.useRef(null),a=b.useRef([]),[s,n]=b.useState(!1),[u,f]=b.useState(!1);b.useEffect(()=>()=>a.current.forEach(o=>window.clearTimeout(o)),[]);const v=(o,m)=>a.current.push(window.setTimeout(o,m)),x=()=>{ie(e.current);const o=!H(se,!1);o&&f(!0),v(()=>n(!0),o?Oe:0),v(()=>ve(ne),o?Fe:Ie)},c=o=>{!ze(o)||H(oe,!0)||(o.preventDefault(),a.current.length===0&&x())},l=o=>{s||!H(se,!1)||H(oe,!0)||$e(o.currentTarget,o.clientX,o.clientY)};return t.jsxs("span",{ref:e,className:"invest-play","data-pressed":s||void 0,"data-revealed":u||void 0,onPointerMove:l,onPointerLeave:()=>ie(e.current),children:[t.jsx("a",{className:"portal-invest",href:ne,onClick:c,children:d["invest.button"]}),t.jsx("span",{className:"invest-faces","aria-hidden":"true",children:Array.from({length:Ue},(o,m)=>t.jsx("span",{className:`invest-face invest-face-${m}`,children:t.jsx("span",{className:"invest-face-drift",children:t.jsx(Ge,{grinning:s})})},m))})]})}function Ge({grinning:e}){return t.jsx("svg",{viewBox:"0 0 28 28","aria-hidden":"true",focusable:"false",children:ke.map(a=>t.jsx("rect",{className:`pixel-${Le(a,e)}`,x:(a.x+3)*4,y:(a.y+3)*4,width:"3.6",height:"3.6",rx:".45"},`${a.x},${a.y}`))})}function ze(e){return!(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)&&e.button===0&&e.detail!==0}function H(e,a){return typeof window.matchMedia=="function"?window.matchMedia(e).matches:a}function $e(e,a,s){const n=e.getBoundingClientRect();e.style.setProperty("--invest-drift-x",`${le((a-n.left-n.width/2)*.2,12)}px`),e.style.setProperty("--invest-drift-y",`${le((s-n.top-n.height/2)*.3,10)}px`)}function ie(e){e==null||e.style.removeProperty("--invest-drift-x"),e==null||e.style.removeProperty("--invest-drift-y")}function le(e,a){return Math.max(-a,Math.min(a,e))}function We(){return t.jsx("nav",{className:"invest-navigation","aria-label":d["invest.navigation_label"],children:t.jsx(Be,{})})}const K={aberration:.8,balance:.5,blobScale:3,chroma:1,colors:["#f25aed","#ffffff"],contrast:1,duration:7,flow:.6,glow:0,grain:.6,inner:.38,iridescence:0,lightX:-.6,lightY:-1,refraction:.25,rim:1.3,shading:.05,shift:.23,softness:.005,specular:.2,turbulence:.4,wobble:0},O=4,Xe=2,He=255,Ve=.04045,qe=Math.PI*2,ce=1e3/30,Ye=.65,Ke=5,Je="120px",Qe=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,Ze=`#version 300 es
precision highp float;
precision highp int;   // the hash needs full 32-bit ints

uniform vec2  uRes;
uniform float uPhase;
uniform vec3  uLab[4];
uniform float uCount;
uniform float uScaleN;
uniform float uFlow;
uniform float uTurb;
uniform float uShift;
uniform float uBalance;
uniform float uChroma;
uniform float uContrast;
uniform float uRim;
uniform float uSpec;
uniform float uInner;
uniform float uShading;
uniform float uRefract;
uniform float uIrid;
uniform float uAberr;
uniform float uGrain;
uniform float uSoft;
uniform float uWobble;
uniform float uGlow;
uniform vec3  uLight;

out vec4 fragColor;

const float TAU = 6.28318530718;
const float RAD = 0.86;         // sphere radius in uv units; the rest is glow room
const float RMAX = 1.0 / RAD;   // radius reached at the nearest canvas edge

/* MurmurHash3 finalizer, Austin Appleby, public domain. Exact at any lattice
   coordinate, so unlike a fract(sin(...)) hash it never bands as the input
   grows — which matters for the grain, whose input runs into the thousands. */
uint hashU(uint x) {
  x ^= x >> 16; x *= 0x85EBCA6Bu;
  x ^= x >> 13; x *= 0xC2B2AE35u;
  x ^= x >> 16;
  return x;
}
uint hashU2(uvec2 p) { return hashU(p.x * 0x9E3779B9u ^ hashU(p.y)); }
uint hashU3(uvec3 p) { return hashU(p.x * 0x9E3779B9u ^ hashU(p.y) ^ hashU(p.z) * 0x27D4EB2Fu); }
float rand2(ivec2 p) { return float(hashU2(uvec2(p + 4096)) >> 8) / 16777216.0; }
float rand3(ivec3 p) { return float(hashU3(uvec3(p + 4096)) >> 8) / 16777216.0; }

float vnoise(vec2 p) {
  ivec2 i = ivec2(floor(p));
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(rand2(i),               rand2(i + ivec2(1, 0)), u.x),
             mix(rand2(i + ivec2(0, 1)), rand2(i + ivec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int k = 0; k < 3; k++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return s / 0.875;
}

/* Each point walks its own circle, completing exactly one turn per loop. */
vec2 flowField(vec2 p) {
  float ang = TAU * vnoise(p + 11.3) + uPhase;
  float mag = 0.35 + 0.65 * vnoise(p + 27.9);
  return vec2(cos(ang), sin(ang)) * mag;
}

/* Fresnel-driven hue rotation in the a/b plane — thin-film sheen. */
vec3 iridesce(vec3 lab, float f) {
  float a = uIrid * f * -2.2;
  float c = cos(a), s = sin(a);
  return vec3(lab.x, c * lab.y - s * lab.z, s * lab.y + c * lab.z);
}

vec3 labRamp(float x) {
  float xx = clamp(x, 0.0, 1.0) * (uCount - 1.0);
  vec3 c = mix(uLab[0], uLab[1], clamp(xx, 0.0, 1.0));
  c = mix(c, uLab[2], clamp(xx - 1.0, 0.0, 1.0));
  c = mix(c, uLab[3], clamp(xx - 2.0, 0.0, 1.0));
  return c;
}

vec3 paletteLab(float t) {
  float x = pow(clamp(0.5 + 0.5 * cos(TAU * t), 0.0, 1.0), uBalance);
  vec3 lab = labRamp(x);
  float ang = TAU * (t * 2.0 + 0.123);
  lab.yz += 0.17 * uChroma * length(lab.yz) * vec2(sin(ang), cos(ang * 1.37 + 1.1));
  /* Cap to roughly the sRGB chroma ceiling. Scaling a/b keeps the hue angle;
     overshooting and clamping RGB later posterises into flat patches. */
  float ch = length(lab.yz);
  if (ch > 0.33) { lab.yz *= 0.33 / ch; }
  lab.x = clamp(0.5 + (lab.x - 0.5) * uContrast, 0.0, 1.0);
  return lab;
}

/* OkLab transform, Björn Ottosson, public domain. */
vec3 oklabToLinear(vec3 c) {
  float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  vec3 lms = vec3(l_ * l_ * l_, m_ * m_ * m_, s_ * s_ * s_);
  return mat3( 4.0767416621, -1.2684380046, -0.0041960863,
              -3.3077115913,  2.6097574011, -0.7034186147,
               0.2309699292, -0.3413193965,  1.7076147010) * lms;
}

vec3 linearToSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, 1e-5), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(0.0031308, c));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  uv /= RAD;

  /* Silhouette wobble. Integer harmonics of the angle keep it continuous all
     the way round; integer multiples of the phase keep it periodic in time.
     Faded in with radius so the rim deforms like a drop while the core stays
     put — which also keeps it away from atan()'s singularity at the centre. */
  if (uWobble > 0.0) {
    float r0 = length(uv);
    float th = atan(uv.y, uv.x + 1e-6);
    float wob = 0.60 * sin(3.0 * th + uPhase)
              + 0.40 * sin(5.0 * th - 2.0 * uPhase)
              + 0.25 * sin(7.0 * th + 3.0 * uPhase);
    uv *= 1.0 - uWobble * 0.055 * wob * smoothstep(0.0, 0.5, r0);
  }

  float r = length(uv);
  vec2 pd = uv / max(r, 1.0);
  float z = sqrt(max(1.0 - dot(pd, pd), 0.0));
  vec3 n = vec3(pd, z);

  /* Domain warping. The base fBm is static; all the motion comes from warping
     its input through the looping flow field, and nesting a second warp is
     what turns smooth blobs into marbled, ink-in-water flow. */
  vec2 p0 = (pd - n.xy * uRefract) * uScaleN;
  vec2 p1 = p0 + uFlow * flowField(p0);
  vec2 p2 = p1 + uTurb * flowField(p1 * 1.7 + 5.2);
  float t = mix(0.5, fbm(p2 + 3.7), 1.35) + uShift;

  float fres3 = pow(1.0 - n.z, 3.0);
  vec3 lab = iridesce(paletteLab(t), fres3);

  vec3 base;
  if (uAberr > 0.001) {
    // Dispersion: the palette lookup shifts per channel, strongest at the rim.
    float d = uAberr * 0.05 * r * r;
    base = vec3(oklabToLinear(iridesce(paletteLab(t - d), fres3)).r,
                oklabToLinear(lab).g,
                oklabToLinear(iridesce(paletteLab(t + d), fres3)).b);
  } else {
    base = oklabToLinear(lab);
  }
  base = max(base, 0.0);

  // Lighting is added in linear light, which is where it belongs.
  vec3 L = normalize(uLight);
  vec3 col = mix(base, vec3(clamp(dot(n, L), 0.0, 1.0)), uShading);

  // Internal scatter offset away from the highlight: a translucent body rather
  // than a lit opaque ball.
  vec2 op = pd + L.xy * 0.45;
  col += uInner * exp(-dot(op, op) * 2.2) * base;

  vec3 half_ = normalize(L + vec3(0.0, 0.0, 1.0));
  col += pow(1.0 - n.z, 8.0) * uRim
       + pow(max(dot(n, half_), 0.0), 24.3) * uSpec;

  vec3 lit = linearToSrgb(col);
  vec3 flat_ = linearToSrgb(base);

  // Never thinner than ~1.5 device px, so the rim stays smooth when the
  // character is rendered small.
  float w = max(uSoft, 1.5 * fwidth(r));
  float body = 1.0 - smoothstep(1.0 - w, 1.0, r);

  /* The halo has to reach exactly zero before the canvas boundary. Left alone
     it is still ~1.5/255 at the edge and gets cut off square, which shows the
     canvas box as a faint rectangle around the orb. */
  float glowF = uGlow * exp(-max(r - 1.0, 0.0) * 20.0);
  glowF *= 1.0 - smoothstep(0.45, 1.0, (r - 1.0) / (RMAX - 1.0));
  float alpha = clamp(body + glowF * (1.0 - body), 0.0, 1.0);

  vec3 outCol = mix(flat_, lit, body);

  // Grain plus an always-on deband dither, stepped to 24 frames per loop so it
  // animates without breaking the seam.
  int frame = int(uPhase / TAU * 24.0);
  outCol += (rand3(ivec3(ivec2(gl_FragCoord.xy), frame)) - 0.5)
          * (uGrain * 0.1 + 1.0 / 255.0);

  outCol = clamp(outCol, 0.0, 1.0);
  fragColor = vec4(outCol * alpha, alpha);   // premultiplied
}`,et=(e,a)=>{const s=document.createElement("span");s.style.color=e,(a.parentElement??document.body).appendChild(s);const n=getComputedStyle(s).color;s.remove();const u=document.createElement("canvas");u.width=1,u.height=1;const f=u.getContext("2d",{willReadFrequently:!0});if(!f)return[1,0,0];f.fillStyle=n,f.fillRect(0,0,1,1);const[v=0,x=0,c=0]=f.getImageData(0,0,1,1).data,[l=0,o=0,m=0]=[v,x,c].map(E=>{const w=E/He;return w<=Ve?w/12.92:((w+.055)/1.055)**2.4}),h=Math.cbrt(.4122214708*l+.5363325363*o+.0514459929*m),r=Math.cbrt(.2119034982*l+.6806995451*o+.1073969566*m),y=Math.cbrt(.0883024619*l+.2817188376*o+.6299787005*m);return[.2104542553*h+.793617785*r-.0040720468*y,1.9779984951*h-2.428592205*r+.4505937099*y,.0259040371*h+.7827717662*r-.808675766*y]},de=(e,a,s)=>{const n=e.createShader(a);return n?(e.shaderSource(n,s),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)?n:(e.deleteShader(n),null)):null};function tt({className:e,size:a=240,...s}){const n=b.useRef(null),[u,f]=b.useState(!0),[v,x]=b.useState(0),c=b.useRef(null),l=b.useRef({...K,...s});l.current={...K,...s},b.useEffect(()=>{const h=n.current;if(!h)return;const r=h.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,powerPreference:"low-power",premultipliedAlpha:!0,stencil:!1});if(!r){f(!1);return}const y=de(r,r.VERTEX_SHADER,Qe),E=de(r,r.FRAGMENT_SHADER,Ze),w=r.createProgram();if(!(y&&E&&w)){y&&r.deleteShader(y),E&&r.deleteShader(E),w&&r.deleteProgram(w),f(!1);return}if(r.attachShader(w,y),r.attachShader(w,E),r.linkProgram(w),r.deleteShader(y),r.deleteShader(E),!r.getProgramParameter(w,r.LINK_STATUS)){r.deleteProgram(w),f(!1);return}r.useProgram(w),f(!0),r.disable(r.DEPTH_TEST),r.disable(r.BLEND);const g=p=>r.getUniformLocation(w,p),i={aberr:g("uAberr"),balance:g("uBalance"),chroma:g("uChroma"),contrast:g("uContrast"),count:g("uCount"),flow:g("uFlow"),glow:g("uGlow"),grain:g("uGrain"),inner:g("uInner"),irid:g("uIrid"),lab:g("uLab"),light:g("uLight"),phase:g("uPhase"),refract:g("uRefract"),res:g("uRes"),rim:g("uRim"),scaleN:g("uScaleN"),shading:g("uShading"),shift:g("uShift"),soft:g("uSoft"),spec:g("uSpec"),turb:g("uTurb"),wobble:g("uWobble")},N=()=>{const p=l.current,j=p.colors.slice(0,O),S=new Float32Array(O*3);for(let _=0;_<O;_++){const[A,W,X]=et(j[Math.min(_,j.length-1)]??"#ffffff",h);S[_*3]=A,S[_*3+1]=W,S[_*3+2]=X}r.uniform3fv(i.lab,S),r.uniform1f(i.count,Math.max(2,Math.min(j.length,O))),r.uniform1f(i.scaleN,1.45/Math.max(p.blobScale,.05)),r.uniform1f(i.flow,p.flow),r.uniform1f(i.turb,p.turbulence),r.uniform1f(i.shift,p.shift),r.uniform1f(i.balance,Ke**((.5-p.balance)*2)),r.uniform1f(i.chroma,p.chroma),r.uniform1f(i.contrast,p.contrast),r.uniform1f(i.rim,p.rim),r.uniform1f(i.spec,p.specular),r.uniform1f(i.inner,p.inner),r.uniform1f(i.shading,p.shading),r.uniform1f(i.refract,p.refraction),r.uniform1f(i.irid,p.iridescence),r.uniform1f(i.aberr,p.aberration),r.uniform1f(i.grain,p.grain),r.uniform1f(i.soft,p.softness),r.uniform1f(i.wobble,p.wobble),r.uniform1f(i.glow,p.glow),r.uniform3f(i.light,p.lightX,p.lightY,Ye)},L=p=>{const j=p==null?void 0:p.devicePixelContentBoxSize;let S,_;if(j!=null&&j[0])S=j[0].inlineSize,_=j[0].blockSize;else{const W=Math.min(window.devicePixelRatio||1,Xe),X=h.getBoundingClientRect();S=Math.round(X.width*W),_=Math.round(X.height*W)}S=Math.max(1,S),_=Math.max(1,_);const A=h.width!==S||h.height!==_;return A&&(h.width=S,h.height=_),r.viewport(0,0,S,_),r.uniform2f(i.res,S,_),A},R=()=>{r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,3)};let T=0,P=0,C=0,z=0,M=0,D=!1,V=!0;const I=window.matchMedia("(prefers-reduced-motion: reduce)"),Q=p=>{var _,A;M=requestAnimationFrame(Q);const j=z?Math.min(p-z,100):ce;if(z=p,C+=j,C<ce-j*.5)return;const S=Math.max(0,Math.min(1,((A=(_=l.current).getAudioLevel)==null?void 0:A.call(_))??0));P+=(S-P)*(1-Math.exp(-C/1e3*(S>P?12:4))),h.dataset.audioLevel=P.toFixed(3),r.uniform1f(i.flow,l.current.flow+P*.45),r.uniform1f(i.turb,l.current.turbulence+P*.16),r.uniform1f(i.wobble,l.current.wobble+P*.035),T=(T+C/1e3*(1+P*1.5)/l.current.duration)%1,C=0,r.uniform1f(i.phase,T*qe),R()},q=()=>{D||I.matches||l.current.paused||!V||document.hidden||r.isContextLost()||(D=!0,z=0,C=0,M=requestAnimationFrame(Q))},F=()=>{D=!1,M&&cancelAnimationFrame(M),M=0},$=()=>{if(I.matches||l.current.paused){F(),I.matches&&r.uniform1f(i.phase,0),R();return}q()};c.current=()=>{N(),$(),D||R()},N(),L(),r.uniform1f(i.phase,0),R();const Y=new ResizeObserver(p=>{L(p[0])&&!D&&R()});try{Y.observe(h,{box:"device-pixel-content-box"})}catch{Y.observe(h)}const Z=new IntersectionObserver(p=>{var j;V=((j=p.at(-1))==null?void 0:j.isIntersecting)??!0,V?q():F()},{rootMargin:Je});Z.observe(h);const ee=()=>{document.hidden?F():q()},te=p=>{p.preventDefault(),F(),f(!1)},ae=()=>{x(p=>p+1)};return document.addEventListener("visibilitychange",ee),h.addEventListener("webglcontextlost",te),h.addEventListener("webglcontextrestored",ae),I.addEventListener("change",$),$(),()=>{c.current=null,F(),Y.disconnect(),Z.disconnect(),I.removeEventListener("change",$),document.removeEventListener("visibilitychange",ee),h.removeEventListener("webglcontextlost",te),h.removeEventListener("webglcontextrestored",ae),r.deleteProgram(w)}},[v]),b.useEffect(()=>{var h;(h=c.current)==null||h.call(c)});const o=typeof a=="number"?`${a}px`:a,m=(s.colors??K.colors).slice(0,O);return t.jsxs("div",{"aria-hidden":"true",className:e,style:{position:"relative",height:o,width:o},children:[!u&&t.jsx("div",{"data-orb-fallback":!0,style:{position:"absolute",inset:"7%",borderRadius:"50%",backgroundImage:`radial-gradient(circle at 32% 28%, ${m.join(", ")})`}}),t.jsx("canvas",{"aria-hidden":"true",className:"block",ref:n,style:{height:o,width:o,visibility:u?"visible":"hidden"},tabIndex:-1})]})}function ue({size:e="100%",getAudioLevel:a}){return t.jsx(tt,{size:e,className:"ffVoiceOrb-sphere",colors:["#b9e20d","#dbf570","#f6fdd9"],chroma:0,shift:0,contrast:1.1,duration:10,flow:.65,turbulence:.4,grain:.22,rim:.9,shading:.08,specular:.2,glow:.04,getAudioLevel:a})}const fe="/conversation?mode=voice",he="/conversation?mode=text";function at(){const e=G(),[a,s]=b.useState("voice"),[n,u]=b.useState("checking");b.useEffect(()=>{let c=!0;return e.getVoiceAgentConnection().then(l=>c&&u(l.available?l.voice===!1?"typed-only":"open":"closed"),()=>c&&u("closed")),()=>{c=!1}},[e]);const f=n==="closed",v=f||n==="typed-only",x=f?d["assistant.unavailable"]:d["assistant.voice_unavailable"];return a==="intro"?t.jsx("section",{className:"ff-assistant","data-mode":"intro","aria-labelledby":"ff-assistant-heading",children:t.jsxs("div",{className:"ff-assistant-intro",children:[t.jsx("h2",{id:"ff-assistant-heading",children:d["assistant.heading"]}),t.jsx("p",{children:d["assistant.description"]}),t.jsxs("div",{className:"ff-assistant-introActions",children:[t.jsx("button",{type:"button",onClick:()=>s("voice"),children:d["assistant.reopen_voice"]}),!f&&t.jsx("a",{href:he,children:d["assistant.reopen_text"]})]}),f&&t.jsx("p",{className:"ff-assistant-note",role:"status",children:d["assistant.unavailable"]})]})}):t.jsxs("section",{className:"ff-assistant","data-mode":"voice","aria-label":d["assistant.heading"],children:[t.jsxs("div",{className:"ff-assistant-actions",children:[!f&&t.jsx("a",{className:"ff-assistant-switch",href:he,children:d["assistant.type_instead"]}),t.jsx("button",{type:"button",className:"ff-assistant-close","aria-label":d["assistant.close"],onClick:()=>s("intro"),children:"×"})]}),t.jsxs("div",{className:"ff-assistant-stage",children:[v?t.jsx("span",{className:"ff-assistant-orb","data-shader":"true","data-disabled":"true","aria-hidden":"true",children:t.jsx(ue,{})}):t.jsx("a",{className:"ff-assistant-orbDoor",href:fe,"aria-label":d["assistant.orb_label"],children:t.jsx("span",{className:"ff-assistant-orb","data-shader":"true","aria-hidden":"true",children:t.jsx(ue,{})})}),v?t.jsx("p",{className:"ff-assistant-note",role:"status",children:x}):t.jsxs(t.Fragment,{children:[t.jsx("a",{className:"ff-assistant-start",href:fe,children:d["assistant.start_voice"]}),t.jsx("p",{className:"ff-assistant-disclosure",children:d["assistant.disclosure"]})]})]})]})}function nt(e,a){const s=URL.createObjectURL(e),n=document.createElement("a");n.href=s,n.download=a,n.click(),URL.revokeObjectURL(s)}const rt="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/",st="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/pdf.min.mjs",ot="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/pdf.worker.min.mjs";let J=null;function it(){return import(st)}function lt(e=it){return J??(J=e().then(a=>(a.GlobalWorkerOptions.workerSrc=ot,a),a=>{throw J=null,a})),J}function ct(e,a){return e.getDocument({data:a,useWasm:!1,wasmUrl:rt})}const dt=2;function pe(e,a){const s=a instanceof Error?`${a.name}: ${a.message}`:String(a);console.error(`[data-room] preview failed at ${e}: ${s.slice(0,200)}`)}function ut(e,a){return Object.entries(a).reduce((s,[n,u])=>s.replace(`{${n}}`,u),e)}function ft({bytes:e,title:a,onFirstPage:s,onFailed:n}){const[u,f]=b.useState(null),v=b.useRef([]);if(b.useEffect(()=>{let c=!0;const l={task:null};return lt().then(async o=>{if(!c)return;l.task=ct(o,e);const m=await l.task.promise;if(!c)return;const h=(await m.getPage(1)).getViewport({scale:1});f({document:m,placeholder:{width:h.width,height:h.height}})}).catch(o=>{c&&(pe("open",o),n())}),()=>{var o;c=!1,(o=l.task)==null||o.destroy();for(const m of v.current)m!==null&&(m.width=0,m.height=0)}},[e]),u===null)return null;const x=Array.from({length:u.document.numPages},(c,l)=>l+1);return t.jsx("div",{className:"reader-pages",children:x.map(c=>t.jsx(ht,{pdf:u.document,placeholder:u.placeholder,pageNumber:c,label:ut(d["dataroom.page_label"],{title:a,page:String(c),pages:String(u.document.numPages)}),register:l=>{l!==null&&(v.current[c-1]=l)},onDrawn:s,onFailed:n},c))})}function ht({pdf:e,placeholder:a,pageNumber:s,label:n,register:u,onDrawn:f,onFailed:v}){const x=b.useRef(null),[c,l]=b.useState(s<=2);return b.useEffect(()=>{const o=x.current;if(c||o===null)return;if(typeof IntersectionObserver!="function"){l(!0);return}const m=new IntersectionObserver(h=>{h.some(r=>r.isIntersecting)&&l(!0)},{root:o.closest(".reader-preview"),rootMargin:"200% 0px"});return m.observe(o),()=>m.disconnect()},[c]),b.useEffect(()=>{const o=x.current;if(!c||o===null)return;let m=!0;const h={renderTask:null};return e.getPage(s).then(r=>{var i;if(!m)return;const y=r.getViewport({scale:1}),E=((i=o.parentElement)==null?void 0:i.clientWidth)||y.width,w=Math.min(window.devicePixelRatio||1,dt),g=r.getViewport({scale:E/y.width*w});return o.width=Math.floor(g.width),o.height=Math.floor(g.height),h.renderTask=r.render({canvas:o,viewport:g}),h.renderTask.promise.then(()=>{r.cleanup(),f()})}).catch(r=>{m&&(pe(`page ${s}`,r),v())}),()=>{var r;m=!1,(r=h.renderTask)==null||r.cancel()}},[c,e,s]),t.jsx("div",{className:"reader-page",children:t.jsx("canvas",{ref:o=>{x.current=o,u(o)},width:Math.round(a.width),height:Math.round(a.height),role:"img","aria-label":n})})}function Rt(){const e=xe();return t.jsxs(we,{layout:"rail-main",rail:t.jsx(Ne,{currentStepId:"data_room"}),headerAction:t.jsx(We,{}),children:[t.jsx(mt,{session:e}),t.jsx(at,{})]})}function mt({session:e}){const a=G(),s=b.useCallback(()=>a.getDataRoomDocuments(),[a]),{data:n,retry:u}=_e(s);return n.kind==="loading"?t.jsx(ye,{}):n.kind==="failed"?t.jsx(Se,{code:n.code,onRetry:u}):t.jsx(pt,{response:n.value,session:e})}function pt({response:e,session:a}){const s=je(a);if(e.gateClosed&&s)return t.jsx("p",{className:"gate-notice",children:d["dataroom.gate_closed_message"]});const n=s?e.documents.filter(u=>u.isOutsiderAvailable):e.documents;return n.length===0?t.jsx(Ee,{message:d["dataroom.empty_message"]}):t.jsx(vt,{documents:n})}function U(e){return e.format==="PDF"}function B(e){const a=`${d["header.brand_name"]} `,{title:s}=e;return s.startsWith(a)&&s.length>a.length?s.slice(a.length):s}function bt(){return typeof window.matchMedia=="function"&&window.matchMedia("(pointer: fine)").matches}let me=null;function be(e){me??(me=new Promise(a=>{const s=()=>{if(typeof window.requestIdleCallback!="function")return a();const n=performance.now();let u;const f=()=>{u==null||u.disconnect(),clearTimeout(v),window.requestIdleCallback(()=>a(),{timeout:2e3})},v=setTimeout(f,1e3);try{u=new PerformanceObserver(x=>{x.getEntries().some(c=>c.startTime>=n)&&f()}),u.observe({type:"largest-contentful-paint",buffered:!0})}catch{}};document.readyState==="complete"?s():window.addEventListener("load",s,{once:!0})})),me.then(e)}function gt(e,a){const s=G(),[n,u]=b.useState(0),f=e.id,v=U(e),[x,c]=b.useState({documentId:f,state:{phase:"loading"}}),l=m=>c({documentId:f,state:m});return b.useEffect(()=>{if(!v)return;let m=!0;const h=a.get(f);return l(h?{phase:"ready",bytes:h}:{phase:"loading"}),be(()=>{m&&s.downloadDocument(f).then(ge).then(r=>{m&&!h&&l({phase:"ready",bytes:r})},()=>l({phase:"failed"}))}),()=>{m=!1}},[s,f,v,n]),{preview:x.documentId===f?x.state:{phase:"loading"},retry:()=>u(m=>m+1)}}function ge(e){return typeof e.arrayBuffer=="function"?e.arrayBuffer().then(a=>new Uint8Array(a)):new Promise((a,s)=>{const n=new FileReader;n.onload=()=>a(new Uint8Array(n.result)),n.onerror=()=>s(n.error),n.readAsArrayBuffer(e)})}function vt({documents:e}){var g;const a=G(),[s,n]=b.useState((g=e[0])==null?void 0:g.id),[u,f]=b.useState(null),[v,x]=b.useState(null),[c]=b.useState(bt),l=e.find(i=>i.id===s)??e[0],o=e.indexOf(l),m=b.useRef(new Map).current,{preview:h,retry:r}=gt(l,m);b.useEffect(()=>{var L;const i=(L=a.preloadDocument)==null?void 0:L.bind(a);if(i===void 0)return;let N=!0;return be(async()=>{for(const R of e){if(!N)return;if(!(!U(R)||R.id===l.id))try{const T=await ge(await i(R.id));N&&m.set(R.id,T)}catch{}}}),()=>{N=!1}},[a,e]);const y=h.phase==="ready"&&v===h.bytes?{phase:"failed"}:h,E=y.phase==="ready"&&u===y.bytes,w=t.jsxs("div",{className:"reader-toolbar-actions",children:[U(l)&&t.jsxs("button",{type:"button",className:"reader-open",onClick:()=>a.viewDocument(l.id),children:[d["dataroom.open_tab_button"]," ",t.jsx(yt,{})]}),t.jsx("button",{type:"button",className:"reader-download",onClick:()=>a.saveDocument(l.id),children:d["dataroom.download_button"]})]});return t.jsxs("section",{className:"data-room-reader",children:[t.jsxs("header",{className:"reader-heading",children:[t.jsxs("div",{children:[t.jsx("h1",{children:d["dataroom.title"]}),t.jsx("p",{children:d["dataroom.subtitle"]})]}),t.jsx(xt,{documents:e,automatic:c})]}),t.jsxs("div",{className:"reader-workspace",children:[t.jsxs("nav",{className:"reader-nav","aria-label":d["dataroom.nav_heading"],children:[t.jsx("p",{className:"reader-nav-heading",children:d["dataroom.nav_heading"]}),e.map((i,N)=>t.jsx(wt,{document:i,position:N,isCurrent:i.id===l.id,onChoose:()=>n(i.id)},i.id))]}),t.jsxs("div",{className:"reader-main",children:[t.jsxs("div",{className:"reader-toolbar",children:[t.jsxs("div",{className:"reader-current",children:[t.jsx("h2",{children:B(l)}),t.jsx("span",{children:k(d["dataroom.position"],{current:String(o+1),total:String(e.length)})})]}),w]}),t.jsxs("label",{className:"reader-mobile-select",children:[d["dataroom.select_label"],t.jsx("select",{value:l.id,onChange:i=>n(i.target.value),children:e.map(i=>t.jsx("option",{value:i.id,children:B(i)},i.id))})]}),t.jsx("div",{className:"reader-preview","aria-busy":U(l)&&!E,children:t.jsx(_t,{document:l,preview:y,pagesShown:E,onFirstPage:i=>f(i),onRenderFailed:i=>x(i),onRetry:r})}),t.jsxs("div",{className:"reader-footer",children:[t.jsx("button",{type:"button",disabled:o===0,onClick:()=>{var i;return n((i=e[o-1])==null?void 0:i.id)},children:d["dataroom.previous_button"]}),t.jsx("button",{type:"button",disabled:o===e.length-1,onClick:()=>{var i;return n((i=e[o+1])==null?void 0:i.id)},children:d["dataroom.next_button"]})]})]})]})]})}function xt({documents:e,automatic:a}){const s=G(),[n,u]=b.useState({phase:"idle"}),[f,v]=b.useState(0),x=b.useRef(!1),c=e.length;if(!a){const o=()=>{const m=e[f];m!==void 0&&(s.saveDocument(m.id),v(f+1))};return t.jsxs("div",{className:"reader-download-all",children:[t.jsx("button",{type:"button",onClick:o,disabled:f>=c,children:f===0||f>=c?d["dataroom.download_all_button"]:k(d["dataroom.download_next_button"],{current:String(f+1),total:String(c)})}),f>0&&t.jsx("p",{role:"status",children:k(d["dataroom.download_all_done"],{saved:String(f),total:String(c)})})]})}const l=async()=>{if(x.current)return;x.current=!0;let o=0;for(const[m,h]of e.entries()){u({phase:"running",current:m+1,total:c});try{nt(await s.downloadDocument(h.id),h.filename),o+=1}catch{}}x.current=!1,u({phase:"done",saved:o,failed:c-o,total:c})};return t.jsxs("div",{className:"reader-download-all",children:[t.jsx("button",{type:"button",onClick:l,disabled:n.phase==="running",children:n.phase==="running"?k(d["dataroom.download_all_progress"],{current:String(n.current),total:String(c)}):d["dataroom.download_all_button"]}),n.phase==="done"&&n.failed===0&&t.jsx("p",{role:"status",children:k(d["dataroom.download_all_done"],{saved:String(n.saved),total:String(c)})}),n.phase==="done"&&n.failed>0&&t.jsx("p",{role:"alert",children:k(d["dataroom.download_all_failed"],{failed:String(n.failed),total:String(c)})})]})}function wt({document:e,position:a,isCurrent:s,onChoose:n}){const u=b.useId();return t.jsxs("button",{type:"button",className:"reader-document","aria-label":B(e),"aria-describedby":u,"aria-current":s?"true":void 0,onClick:n,children:[t.jsx("span",{className:"reader-number","aria-hidden":"true",children:String(a+1).padStart(2,"0")}),t.jsxs("span",{children:[t.jsx("span",{className:"reader-document-name",children:B(e)}),t.jsxs("span",{className:"reader-document-meta",id:u,children:[e.format," · ",e.fileSize]})]})]})}function _t({document:e,preview:a,pagesShown:s,onFirstPage:n,onRenderFailed:u,onRetry:f}){if(!U(e))return t.jsx("p",{className:"reader-no-preview",children:d["dataroom.no_preview_message"]});if(a.phase==="failed")return t.jsxs("div",{className:"reader-preview-error",children:[t.jsx("p",{role:"alert",children:d["dataroom.preview_error"]}),t.jsx("button",{type:"button",onClick:f,children:d["dataroom.retry_button"]})]});const v=a.phase==="ready"?a.bytes:null;return t.jsxs(t.Fragment,{children:[!s&&t.jsx("div",{className:"reader-loading",role:"status",children:d["dataroom.preview_loading"]}),v!==null&&t.jsx(ft,{bytes:v,title:B(e),onFirstPage:()=>n(v),onFailed:()=>u(v)})]})}function yt(){return t.jsx("svg",{"aria-hidden":"true",width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",children:t.jsx("path",{d:"M4 12 12 4M5 4h7v7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}export{Rt as DataRoomScreen,bt as savesWithoutATap};
