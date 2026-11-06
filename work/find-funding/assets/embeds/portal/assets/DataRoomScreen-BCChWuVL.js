import{j as a,a as b,r as p,I as ne,o as be,u as z,d as ve,A as ge,e as xe,L as we,E as ye,g as _e}from"./index.demo-Ch1UsymN.js";import{f as L}from"./fillSlot-BoA1VEgU.js";import{E as Se}from"./EmptyState-Bp6yjW_T.js";const je=3.6,Re=Ne();function Ee({x:e,y:t},o){return t===-1&&Math.abs(e)===1?"eye":o?Ae(e,t)?"grin":"skin":Pe(e,t)?"mouth":"skin"}function Ae(e,t){return t===1&&Math.abs(e)<=2||t===2&&Math.abs(e)<=1}function Pe(e,t){return t===1&&Math.abs(e)===2||t===2&&Math.abs(e)<=1}function Ne(){const e=[-3,-2,-1,0,1,2,3];return e.flatMap(o=>e.map(r=>({x:r,y:o}))).filter(({x:o,y:r})=>Math.hypot(o,r)<=je)}const re="(hover: hover) and (pointer: fine)",oe="(prefers-reduced-motion: reduce)",Ce=280,Le=440,Te=160,Me=3;function ke(){const e=p.useRef(null),t=p.useRef([]),[o,r]=p.useState(!1),[d,f]=p.useState(!1);p.useEffect(()=>()=>t.current.forEach(s=>window.clearTimeout(s)),[]);const g=(s,h)=>t.current.push(window.setTimeout(s,h)),x=()=>{se(e.current);const s=!V(re,!1);s&&f(!0),g(()=>r(!0),s?Te:0),g(()=>be(ne),s?Le:Ce)},c=s=>{!Ie(s)||V(oe,!0)||(s.preventDefault(),t.current.length===0&&x())},l=s=>{o||!V(re,!1)||V(oe,!0)||Fe(s.currentTarget,s.clientX,s.clientY)};return a.jsxs("span",{ref:e,className:"invest-play","data-pressed":o||void 0,"data-revealed":d||void 0,onPointerMove:l,onPointerLeave:()=>se(e.current),children:[a.jsx("a",{className:"portal-invest",href:ne,onClick:c,children:b["invest.button"]}),a.jsx("span",{className:"invest-faces","aria-hidden":"true",children:Array.from({length:Me},(s,h)=>a.jsx("span",{className:`invest-face invest-face-${h}`,children:a.jsx("span",{className:"invest-face-drift",children:a.jsx(De,{grinning:o})})},h))})]})}function De({grinning:e}){return a.jsx("svg",{viewBox:"0 0 28 28","aria-hidden":"true",focusable:"false",children:Re.map(t=>a.jsx("rect",{className:`pixel-${Ee(t,e)}`,x:(t.x+3)*4,y:(t.y+3)*4,width:"3.6",height:"3.6",rx:".45"},`${t.x},${t.y}`))})}function Ie(e){return!(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)&&e.button===0&&e.detail!==0}function V(e,t){return typeof window.matchMedia=="function"?window.matchMedia(e).matches:t}function Fe(e,t,o){const r=e.getBoundingClientRect();e.style.setProperty("--invest-drift-x",`${ie((t-r.left-r.width/2)*.2,12)}px`),e.style.setProperty("--invest-drift-y",`${ie((o-r.top-r.height/2)*.3,10)}px`)}function se(e){e==null||e.style.removeProperty("--invest-drift-x"),e==null||e.style.removeProperty("--invest-drift-y")}function ie(e,t){return Math.max(-t,Math.min(t,e))}function Oe(){return a.jsx("nav",{className:"invest-navigation","aria-label":b["invest.navigation_label"],children:a.jsx(ke,{})})}const K={aberration:.8,balance:.5,blobScale:3,chroma:1,colors:["#f25aed","#ffffff"],contrast:1,duration:7,flow:.6,glow:0,grain:.6,inner:.38,iridescence:0,lightX:-.6,lightY:-1,refraction:.25,rim:1.3,shading:.05,shift:.23,softness:.005,specular:.2,turbulence:.4,wobble:0},O=4,Ue=2,Be=255,ze=.04045,Ge=Math.PI*2,le=1e3/30,$e=.65,Xe=5,He="120px",Ve=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,We=`#version 300 es
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
}`,qe=(e,t)=>{const o=document.createElement("span");o.style.color=e,(t.parentElement??document.body).appendChild(o);const r=getComputedStyle(o).color;o.remove();const d=document.createElement("canvas");d.width=1,d.height=1;const f=d.getContext("2d",{willReadFrequently:!0});if(!f)return[1,0,0];f.fillStyle=r,f.fillRect(0,0,1,1);const[g=0,x=0,c=0]=f.getImageData(0,0,1,1).data,[l=0,s=0,h=0]=[g,x,c].map(R=>{const w=R/Be;return w<=ze?w/12.92:((w+.055)/1.055)**2.4}),u=Math.cbrt(.4122214708*l+.5363325363*s+.0514459929*h),n=Math.cbrt(.2119034982*l+.6806995451*s+.1073969566*h),_=Math.cbrt(.0883024619*l+.2817188376*s+.6299787005*h);return[.2104542553*u+.793617785*n-.0040720468*_,1.9779984951*u-2.428592205*n+.4505937099*_,.0259040371*u+.7827717662*n-.808675766*_]},ce=(e,t,o)=>{const r=e.createShader(t);return r?(e.shaderSource(r,o),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null};function Ye({className:e,size:t=240,...o}){const r=p.useRef(null),[d,f]=p.useState(!0),[g,x]=p.useState(0),c=p.useRef(null),l=p.useRef({...K,...o});l.current={...K,...o},p.useEffect(()=>{const u=r.current;if(!u)return;const n=u.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,powerPreference:"low-power",premultipliedAlpha:!0,stencil:!1});if(!n){f(!1);return}const _=ce(n,n.VERTEX_SHADER,Ve),R=ce(n,n.FRAGMENT_SHADER,We),w=n.createProgram();if(!(_&&R&&w)){_&&n.deleteShader(_),R&&n.deleteShader(R),w&&n.deleteProgram(w),f(!1);return}if(n.attachShader(w,_),n.attachShader(w,R),n.linkProgram(w),n.deleteShader(_),n.deleteShader(R),!n.getProgramParameter(w,n.LINK_STATUS)){n.deleteProgram(w),f(!1);return}n.useProgram(w),f(!0),n.disable(n.DEPTH_TEST),n.disable(n.BLEND);const v=m=>n.getUniformLocation(w,m),i={aberr:v("uAberr"),balance:v("uBalance"),chroma:v("uChroma"),contrast:v("uContrast"),count:v("uCount"),flow:v("uFlow"),glow:v("uGlow"),grain:v("uGrain"),inner:v("uInner"),irid:v("uIrid"),lab:v("uLab"),light:v("uLight"),phase:v("uPhase"),refract:v("uRefract"),res:v("uRes"),rim:v("uRim"),scaleN:v("uScaleN"),shading:v("uShading"),shift:v("uShift"),soft:v("uSoft"),spec:v("uSpec"),turb:v("uTurb"),wobble:v("uWobble")},A=()=>{const m=l.current,j=m.colors.slice(0,O),S=new Float32Array(O*3);for(let y=0;y<O;y++){const[N,X,H]=qe(j[Math.min(y,j.length-1)]??"#ffffff",u);S[y*3]=N,S[y*3+1]=X,S[y*3+2]=H}n.uniform3fv(i.lab,S),n.uniform1f(i.count,Math.max(2,Math.min(j.length,O))),n.uniform1f(i.scaleN,1.45/Math.max(m.blobScale,.05)),n.uniform1f(i.flow,m.flow),n.uniform1f(i.turb,m.turbulence),n.uniform1f(i.shift,m.shift),n.uniform1f(i.balance,Xe**((.5-m.balance)*2)),n.uniform1f(i.chroma,m.chroma),n.uniform1f(i.contrast,m.contrast),n.uniform1f(i.rim,m.rim),n.uniform1f(i.spec,m.specular),n.uniform1f(i.inner,m.inner),n.uniform1f(i.shading,m.shading),n.uniform1f(i.refract,m.refraction),n.uniform1f(i.irid,m.iridescence),n.uniform1f(i.aberr,m.aberration),n.uniform1f(i.grain,m.grain),n.uniform1f(i.soft,m.softness),n.uniform1f(i.wobble,m.wobble),n.uniform1f(i.glow,m.glow),n.uniform3f(i.light,m.lightX,m.lightY,$e)},T=m=>{const j=m==null?void 0:m.devicePixelContentBoxSize;let S,y;if(j!=null&&j[0])S=j[0].inlineSize,y=j[0].blockSize;else{const X=Math.min(window.devicePixelRatio||1,Ue),H=u.getBoundingClientRect();S=Math.round(H.width*X),y=Math.round(H.height*X)}S=Math.max(1,S),y=Math.max(1,y);const N=u.width!==S||u.height!==y;return N&&(u.width=S,u.height=y),n.viewport(0,0,S,y),n.uniform2f(i.res,S,y),N},E=()=>{n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)};let M=0,P=0,C=0,G=0,k=0,D=!1,W=!0;const I=window.matchMedia("(prefers-reduced-motion: reduce)"),Q=m=>{var y,N;k=requestAnimationFrame(Q);const j=G?Math.min(m-G,100):le;if(G=m,C+=j,C<le-j*.5)return;const S=Math.max(0,Math.min(1,((N=(y=l.current).getAudioLevel)==null?void 0:N.call(y))??0));P+=(S-P)*(1-Math.exp(-C/1e3*(S>P?12:4))),u.dataset.audioLevel=P.toFixed(3),n.uniform1f(i.flow,l.current.flow+P*.45),n.uniform1f(i.turb,l.current.turbulence+P*.16),n.uniform1f(i.wobble,l.current.wobble+P*.035),M=(M+C/1e3*(1+P*1.5)/l.current.duration)%1,C=0,n.uniform1f(i.phase,M*Ge),E()},q=()=>{D||I.matches||l.current.paused||!W||document.hidden||n.isContextLost()||(D=!0,G=0,C=0,k=requestAnimationFrame(Q))},F=()=>{D=!1,k&&cancelAnimationFrame(k),k=0},$=()=>{if(I.matches||l.current.paused){F(),I.matches&&n.uniform1f(i.phase,0),E();return}q()};c.current=()=>{A(),$(),D||E()},A(),T(),n.uniform1f(i.phase,0),E();const Y=new ResizeObserver(m=>{T(m[0])&&!D&&E()});try{Y.observe(u,{box:"device-pixel-content-box"})}catch{Y.observe(u)}const Z=new IntersectionObserver(m=>{var j;W=((j=m.at(-1))==null?void 0:j.isIntersecting)??!0,W?q():F()},{rootMargin:He});Z.observe(u);const ee=()=>{document.hidden?F():q()},te=m=>{m.preventDefault(),F(),f(!1)},ae=()=>{x(m=>m+1)};return document.addEventListener("visibilitychange",ee),u.addEventListener("webglcontextlost",te),u.addEventListener("webglcontextrestored",ae),I.addEventListener("change",$),$(),()=>{c.current=null,F(),Y.disconnect(),Z.disconnect(),I.removeEventListener("change",$),document.removeEventListener("visibilitychange",ee),u.removeEventListener("webglcontextlost",te),u.removeEventListener("webglcontextrestored",ae),n.deleteProgram(w)}},[g]),p.useEffect(()=>{var u;(u=c.current)==null||u.call(c)});const s=typeof t=="number"?`${t}px`:t,h=(o.colors??K.colors).slice(0,O);return a.jsxs("div",{"aria-hidden":"true",className:e,style:{position:"relative",height:s,width:s},children:[!d&&a.jsx("div",{"data-orb-fallback":!0,style:{position:"absolute",inset:"7%",borderRadius:"50%",backgroundImage:`radial-gradient(circle at 32% 28%, ${h.join(", ")})`}}),a.jsx("canvas",{"aria-hidden":"true",className:"block",ref:r,style:{height:s,width:s,visibility:d?"visible":"hidden"},tabIndex:-1})]})}function de({size:e="100%",getAudioLevel:t}){return a.jsx(Ye,{size:e,className:"ffVoiceOrb-sphere",colors:["#b9e20d","#dbf570","#f6fdd9"],chroma:0,shift:0,contrast:1.1,duration:10,flow:.65,turbulence:.4,grain:.22,rim:.9,shading:.08,specular:.2,glow:.04,getAudioLevel:t})}const ue="/conversation?mode=voice",Ke="/conversation?mode=text";function Je(){const e=z(),t=p.useId(),[o,r]=p.useState(!1),[d,f]=p.useState("checking");p.useEffect(()=>{let l=!0;return e.getVoiceAgentConnection().then(s=>l&&f(s.available?s.voice===!1?"typed-only":"open":"closed"),()=>l&&f("closed")),()=>{l=!1}},[e]);const g=d==="closed",x=g||d==="typed-only",c=g?b["assistant.unavailable"]:b["assistant.voice_unavailable"];return a.jsxs("section",{className:"ff-assistant","data-mode":"voice","aria-label":b["assistant.heading"],children:[a.jsx("div",{className:"ff-assistant-actions",children:!g&&a.jsx("a",{className:"ff-assistant-switch",href:Ke,children:b["assistant.type_instead"]})}),a.jsxs("div",{className:"ff-assistant-stage",children:[x?a.jsx("span",{className:"ff-assistant-orb","data-shader":"true","data-disabled":"true","aria-hidden":"true",children:a.jsx(de,{})}):a.jsx("a",{className:"ff-assistant-orbDoor",href:ue,"aria-label":b["assistant.orb_label"],children:a.jsx("span",{className:"ff-assistant-orb","data-shader":"true","aria-hidden":"true",children:a.jsx(de,{})})}),x?a.jsx("p",{className:"ff-assistant-note",role:"status",children:c}):a.jsxs(a.Fragment,{children:[a.jsx("a",{className:"ff-assistant-start",href:ue,children:b["assistant.start_voice"]}),a.jsxs("div",{className:"ff-assistant-privacy",children:[a.jsx("button",{type:"button",className:"ff-assistant-privacy-toggle","aria-expanded":o,"aria-controls":t,onClick:()=>r(!o),children:"AI assistant · How your information is used"}),a.jsx("p",{id:t,hidden:!o,className:"ff-assistant-disclosure",children:b["assistant.disclosure"]})]})]})]})]})}function Qe(e,t){const o=URL.createObjectURL(e),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}const Ze="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/",et="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/pdf.min.mjs",tt="/work/find-funding/assets/embeds/portal/assets/pdfjs/6.4.299/pdf.worker.min.mjs";let J=null;function at(){return import(et)}function nt(e=at){return J??(J=e().then(t=>(t.GlobalWorkerOptions.workerSrc=tt,t),t=>{throw J=null,t})),J}function rt(e,t){return e.getDocument({data:t.slice(),useWasm:!1,wasmUrl:Ze})}const ot=2;function he(e,t){const o=t instanceof Error?`${t.name}: ${t.message}`:String(t);console.error(`[data-room] preview failed at ${e}: ${o.slice(0,200)}`)}function st(e,t){return Object.entries(t).reduce((o,[r,d])=>o.replace(`{${r}}`,d),e)}function it({bytes:e,title:t,onFirstPage:o,onFailed:r}){const[d,f]=p.useState(null),g=p.useRef([]);if(p.useEffect(()=>{let c=!0;const l={task:null};return nt().then(async s=>{if(!c)return;l.task=rt(s,e);const h=await l.task.promise;if(!c)return;const u=(await h.getPage(1)).getViewport({scale:1});f({document:h,placeholder:{width:u.width,height:u.height}})}).catch(s=>{c&&(he("open",s),r())}),()=>{var s;c=!1,(s=l.task)==null||s.destroy();for(const h of g.current)h!==null&&(h.width=0,h.height=0)}},[e]),d===null)return null;const x=Array.from({length:d.document.numPages},(c,l)=>l+1);return a.jsx("div",{className:"reader-pages",children:x.map(c=>a.jsx(lt,{pdf:d.document,placeholder:d.placeholder,pageNumber:c,label:st(b["dataroom.page_label"],{title:t,page:String(c),pages:String(d.document.numPages)}),register:l=>{l!==null&&(g.current[c-1]=l)},onDrawn:o,onFailed:r},c))})}function lt({pdf:e,placeholder:t,pageNumber:o,label:r,register:d,onDrawn:f,onFailed:g}){const x=p.useRef(null),[c,l]=p.useState(o<=2);return p.useEffect(()=>{const s=x.current;if(c||s===null)return;if(typeof IntersectionObserver!="function"){l(!0);return}const h=new IntersectionObserver(u=>{u.some(n=>n.isIntersecting)&&l(!0)},{root:s.closest(".reader-preview"),rootMargin:"200% 0px"});return h.observe(s),()=>h.disconnect()},[c]),p.useEffect(()=>{const s=x.current;if(!c||s===null)return;let h=!0;const u={renderTask:null};return e.getPage(o).then(n=>{var i;if(!h)return;const _=n.getViewport({scale:1}),R=((i=s.parentElement)==null?void 0:i.clientWidth)||_.width,w=Math.min(window.devicePixelRatio||1,ot),v=n.getViewport({scale:R/_.width*w});return s.width=Math.floor(v.width),s.height=Math.floor(v.height),u.renderTask=n.render({canvas:s,viewport:v}),u.renderTask.promise.then(()=>{n.cleanup(),f()})}).catch(n=>{h&&(he(`page ${o}`,n),g())}),()=>{var n;h=!1,(n=u.renderTask)==null||n.cancel()}},[c,e,o]),a.jsx("div",{className:"reader-page",children:a.jsx("canvas",{ref:s=>{x.current=s,d(s)},width:Math.round(t.width),height:Math.round(t.height),role:"img","aria-label":r})})}function wt(){const e=ve();return a.jsxs(ge,{layout:"data-room",headerAction:a.jsx(Oe,{}),children:[a.jsx(ct,{session:e}),a.jsx(Je,{})]})}function ct({session:e}){const t=z(),o=p.useCallback(()=>t.getDataRoomDocuments(),[t]),{data:r,retry:d}=xe(o);return r.kind==="loading"?a.jsx(we,{}):r.kind==="failed"?a.jsx(ye,{code:r.code,onRetry:d}):a.jsx(dt,{response:r.value,session:e})}function dt({response:e,session:t}){const o=_e(t);if(e.gateClosed&&o)return a.jsx("p",{className:"gate-notice",children:b["dataroom.gate_closed_message"]});const r=o?e.documents.filter(d=>d.isOutsiderAvailable):e.documents;return r.length===0?a.jsx(Se,{message:b["dataroom.empty_message"]}):a.jsx(ht,{documents:r})}function U(e){return e.format==="PDF"}function B(e){const t=`${b["header.brand_name"]} `,{title:o}=e;return o.startsWith(t)&&o.length>t.length?o.slice(t.length):o}function ut(){return typeof window.matchMedia=="function"&&window.matchMedia("(pointer: fine)").matches}let fe=null;function me(e){fe??(fe=new Promise(t=>{const o=()=>{if(typeof window.requestIdleCallback!="function")return t();const r=performance.now();let d;const f=()=>{d==null||d.disconnect(),clearTimeout(g),window.requestIdleCallback(()=>t(),{timeout:2e3})},g=setTimeout(f,1e3);try{d=new PerformanceObserver(x=>{x.getEntries().some(c=>c.startTime>=r)&&f()}),d.observe({type:"largest-contentful-paint",buffered:!0})}catch{}};document.readyState==="complete"?o():window.addEventListener("load",o,{once:!0})})),fe.then(e)}function ft(e,t){const o=z(),[r,d]=p.useState(0),f=e.id,g=U(e),[x,c]=p.useState({documentId:f,state:{phase:"loading"}}),l=h=>c({documentId:f,state:h});return p.useEffect(()=>{if(!g)return;let h=!0;const u=t.get(f);return l(u?{phase:"ready",bytes:u}:{phase:"loading"}),me(()=>{h&&o.downloadDocument(f).then(pe).then(n=>{h&&!u&&l({phase:"ready",bytes:n})},()=>l({phase:"failed"}))}),()=>{h=!1}},[o,f,g,r]),{preview:x.documentId===f?x.state:{phase:"loading"},retry:()=>d(h=>h+1)}}function pe(e){return typeof e.arrayBuffer=="function"?e.arrayBuffer().then(t=>new Uint8Array(t)):new Promise((t,o)=>{const r=new FileReader;r.onload=()=>t(new Uint8Array(r.result)),r.onerror=()=>o(r.error),r.readAsArrayBuffer(e)})}function ht({documents:e}){var v;const t=z(),[o,r]=p.useState((v=e[0])==null?void 0:v.id),[d,f]=p.useState(null),[g,x]=p.useState(null),[c]=p.useState(ut),l=e.find(i=>i.id===o)??e[0],s=e.indexOf(l),h=p.useRef(new Map).current,{preview:u,retry:n}=ft(l,h);p.useEffect(()=>{var T;const i=(T=t.preloadDocument)==null?void 0:T.bind(t);if(i===void 0)return;let A=!0;return me(async()=>{for(const E of e){if(!A)return;if(!(!U(E)||E.id===l.id))try{const M=await pe(await i(E.id));A&&h.set(E.id,M)}catch{}}}),()=>{A=!1}},[t,e]);const _=u.phase==="ready"&&g===u.bytes?{phase:"failed"}:u,R=_.phase==="ready"&&d===_.bytes,w=a.jsxs("div",{className:"reader-toolbar-actions",children:[U(l)&&a.jsx("button",{type:"button",className:"reader-open",onClick:()=>t.viewDocument(l.id),children:b["dataroom.open_tab_button"]}),a.jsx("button",{type:"button",className:"reader-download",onClick:()=>t.saveDocument(l.id),children:b["dataroom.download_button"]})]});return a.jsxs("section",{className:"data-room-reader",children:[a.jsxs("header",{className:"reader-heading",children:[a.jsxs("div",{children:[a.jsx("h1",{children:b["dataroom.title"]}),a.jsx("p",{children:b["dataroom.subtitle"]})]}),a.jsx(mt,{documents:e,automatic:c})]}),a.jsxs("div",{className:"reader-workspace",children:[a.jsxs("nav",{className:"reader-nav","aria-label":b["dataroom.nav_heading"],children:[a.jsx("p",{className:"reader-nav-heading",children:b["dataroom.nav_heading"]}),e.map((i,A)=>a.jsx(pt,{document:i,position:A,isCurrent:i.id===l.id,onChoose:()=>r(i.id)},i.id))]}),a.jsxs("div",{className:"reader-main",children:[a.jsxs("div",{className:"reader-toolbar",children:[a.jsxs("div",{className:"reader-current",children:[a.jsx("h2",{children:B(l)}),a.jsx("span",{children:L(b["dataroom.position"],{current:String(s+1),total:String(e.length)})})]}),w]}),a.jsxs("label",{className:"reader-mobile-select",children:[b["dataroom.select_label"],a.jsx("select",{value:l.id,onChange:i=>r(i.target.value),children:e.map(i=>a.jsx("option",{value:i.id,children:B(i)},i.id))})]}),a.jsx("div",{className:"reader-preview","aria-busy":U(l)&&!R,children:a.jsx(bt,{document:l,preview:_,pagesShown:R,onFirstPage:i=>f(i),onRenderFailed:i=>x(i),onRetry:n})}),a.jsxs("div",{className:"reader-footer",children:[a.jsx("button",{type:"button",disabled:s===0,onClick:()=>{var i;return r((i=e[s-1])==null?void 0:i.id)},children:b["dataroom.previous_button"]}),a.jsx("button",{type:"button",disabled:s===e.length-1,onClick:()=>{var i;return r((i=e[s+1])==null?void 0:i.id)},children:b["dataroom.next_button"]})]})]})]})]})}function mt({documents:e,automatic:t}){const o=z(),[r,d]=p.useState({phase:"idle"}),[f,g]=p.useState(0),x=p.useRef(!1),c=e.length;if(!t){const s=()=>{const h=e[f];h!==void 0&&(o.saveDocument(h.id),g(f+1))};return a.jsxs("div",{className:"reader-download-all",children:[a.jsx("button",{type:"button",onClick:s,disabled:f>=c,children:f===0||f>=c?b["dataroom.download_all_button"]:L(b["dataroom.download_next_button"],{current:String(f+1),total:String(c)})}),f>0&&a.jsx("p",{role:"status",children:L(b["dataroom.download_all_done"],{saved:String(f),total:String(c)})})]})}const l=async()=>{if(x.current)return;x.current=!0;let s=0;for(const[h,u]of e.entries()){d({phase:"running",current:h+1,total:c});try{Qe(await o.downloadDocument(u.id),u.filename),s+=1}catch{}}x.current=!1,d({phase:"done",saved:s,failed:c-s,total:c})};return a.jsxs("div",{className:"reader-download-all",children:[a.jsx("button",{type:"button",onClick:l,disabled:r.phase==="running",children:r.phase==="running"?L(b["dataroom.download_all_progress"],{current:String(r.current),total:String(c)}):b["dataroom.download_all_button"]}),r.phase==="done"&&r.failed===0&&a.jsx("p",{role:"status",children:L(b["dataroom.download_all_done"],{saved:String(r.saved),total:String(c)})}),r.phase==="done"&&r.failed>0&&a.jsx("p",{role:"alert",children:L(b["dataroom.download_all_failed"],{failed:String(r.failed),total:String(c)})})]})}function pt({document:e,position:t,isCurrent:o,onChoose:r}){const d=p.useId();return a.jsxs("button",{type:"button",className:"reader-document","aria-label":B(e),"aria-describedby":d,"aria-current":o?"true":void 0,onClick:r,children:[a.jsx("span",{className:"reader-number","aria-hidden":"true",children:String(t+1).padStart(2,"0")}),a.jsxs("span",{children:[a.jsx("span",{className:"reader-document-name",children:B(e)}),a.jsxs("span",{className:"reader-document-meta",id:d,children:[e.format," · ",e.fileSize]})]})]})}function bt({document:e,preview:t,pagesShown:o,onFirstPage:r,onRenderFailed:d,onRetry:f}){if(!U(e))return a.jsx("p",{className:"reader-no-preview",children:b["dataroom.no_preview_message"]});if(t.phase==="failed")return a.jsxs("div",{className:"reader-preview-error",children:[a.jsx("p",{role:"alert",children:b["dataroom.preview_error"]}),a.jsx("button",{type:"button",onClick:f,children:b["dataroom.retry_button"]})]});const g=t.phase==="ready"?t.bytes:null;return a.jsxs(a.Fragment,{children:[!o&&a.jsx("div",{className:"reader-loading",role:"status",children:b["dataroom.preview_loading"]}),g!==null&&a.jsx(it,{bytes:g,title:B(e),onFirstPage:()=>r(g),onFailed:()=>d(g)})]})}export{wt as DataRoomScreen,ut as savesWithoutATap};
