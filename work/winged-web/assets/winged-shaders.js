(()=>{var Z=null,K=[];function ee(r){Z=r,K=[]}function G(){return{get current(){return Z}}}function V(r){K.push(r)}function re(){return K.map(function(r){return r()})}function F(){return null}var ne=`#version 300 es
precision mediump float;
in vec3 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
out vec2 vTextureCoord;
out vec3 vVertexPosition;
void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
}`,D=`#version 300 es
precision mediump float;
in vec3 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;
out vec2 vTextureCoord;
out vec3 vVertexPosition;
void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}`,ce=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
out vec4 fragColor;
void main() { fragColor = vec4(0.0, 0.0, 0.0, 1.0); }`,se=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec4 applyLayerMix(vec4 color, vec4 bg, float amount) {
  color.rgb = mix(bg.rgb, color.rgb, amount);
  color.a   = max(bg.a, amount);
  return color;
}

uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.y * 1664525u + 1013904223u;
  v.y += v.x * v.x * 1664525u + 1013904223u;
  v ^= v >> 16u;
  v.x += v.y * v.y * 1664525u + 1013904223u;
  v.y += v.x * v.x * 1664525u + 1013904223u;
  return v;
}
float randFibo(vec2 p) {
  uvec2 v = floatBitsToUint(p); v = pcg2d(v);
  return float(v.x ^ v.y) / float(0xffffffffu);
}
float deband() { return (randFibo(gl_FragCoord.xy) - 0.5) / 255.0; }

const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

vec3 anchoredPal(float t, vec3 col1, vec3 col2, float chroma) {
  vec3 mid     = 0.5 * (col1 + col2);
  vec3 axisAmp = 0.5 * (col2 - col1);
  vec3 base    = mid + axisAmp * cos(TAU * t);
  vec3 axis    = length(axisAmp) > 0.0001 ? normalize(axisAmp) : vec3(1,0,0);
  vec3 ref     = abs(axis.x) > 0.9 ? vec3(0,1,0) : vec3(1,0,0);
  vec3 t1      = normalize(cross(axis, ref));
  vec3 t2      = normalize(cross(axis, t1));
  float rich   = 0.24 * length(axisAmp) + 0.02;
  vec3 ripple  = t1 * sin(TAU * (t * 2.0 + 0.123)) + t2 * sin(TAU * (t * 3.0 + 0.437));
  vec3 col     = base + (rich * chroma) * ripple;
  col = clamp(col, -10.0, 10.0);
  col = 1.0 / (1.0 + exp(-col * 4.0 + 0.25) * 7.5);
  return clamp(col, 0.0, 1.0);
}

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

float voronoise(vec2 uv, float driftVal, float time, float direction, float scale, float phase) {
  vec2 skew = vec2(direction, 1.0 - direction);
  vec2 d    = vec2(0.0, driftVal * time * 0.008);
  vec2 x    = (uv * skew * 2.0) - d * mix(1.0, 14.0, scale) * 2.0;
  vec2 p    = floor(x);
  vec2 f    = fract(x);
  float va  = 0.0, wt = 0.0;
  for (int j = -2; j <= 2; j++)
  for (int i = -2; i <= 2; i++) {
    vec2  g  = vec2(float(i), float(j));
    vec3  o  = hash3(p + g);
    // autonomous phase drift using time
    o.xy    += 0.5 * vec2(sin(time * 0.1 + phase + o.x * 6.28));
    vec2  r  = g - f + o.xy;
    float dd = dot(r, r);
    float ww = pow(max(0.0, 1.0 - smoothstep(0.0, 1.414, sqrt(dd))), 1.0);
    va += o.z * ww;
    wt += ww;
  }
  return va / max(wt, 1e-5);
}

void main() {
  vec2 uv = vTextureCoord;
  float ar = uResolution.x / uResolution.y;
  vec2 aspect = vec2(ar, 1.0);
  vec2 pos = vec2(0.5, 0.5);
  float scale = mix(1.0, 14.0, 0.12);

  // Slow autonomous centre drift \u2014 gentle lissajous in UV space
  vec2 autonomousDrift = vec2(
    sin(uTime * 0.07) * 0.04,
    cos(uTime * 0.05) * 0.03
  );
  vec2 st = (uv - pos - autonomousDrift) * aspect * scale;

  // turbulence=0.54 baked in: mix(0.5, noise, 0.54*2.5) = mix(0.5, noise, 1.35) clamped
  float raw   = voronoise(st, 0.03, uTime, 0.5, 0.12, 0.0);
  float noise = clamp(mix(0.5, raw, 1.35), 0.0, 1.0);

  // Magenta palette from noise-fill.txt
  // shift is time-animated: 0.37 + uTime * 0.01
  float shift = 0.37 + uTime * 0.01;
  vec3 noiseColor = anchoredPal(
    noise + shift,
    vec3(0.2588, 0.0,  0.5176),   // col1: deep purple  #420084
    vec3(1.0,    0.459, 0.792),   // col2: hot pink/magenta
    0.63                           // chroma: vivid
  );

  vec4 color = texture(uTexture, uv);
  vec4 bg    = color;
  color.rgb  = noiseColor;
  color.rgb += deband() * 0.5;
  fragColor  = applyLayerMix(clamp(color, 0.0, 1.0), bg, 1.0);
}`,ue=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;
uniform vec2 uArtboardResolution;
uniform float uTime;
uniform sampler2D uBgTexture;
out vec4 fragColor;

const float TAU = 6.28318530718;

vec3 blendOverlay(vec3 src, vec3 dst) {
  return vec3(
    (dst.x <= 0.5) ? (2.0*src.x*dst.x) : (1.0-2.0*(1.0-dst.x)*(1.0-src.x)),
    (dst.y <= 0.5) ? (2.0*src.y*dst.y) : (1.0-2.0*(1.0-dst.y)*(1.0-src.y)),
    (dst.z <= 0.5) ? (2.0*src.z*dst.z) : (1.0-2.0*(1.0-dst.z)*(1.0-src.z))
  );
}

vec2 rotate2D(vec2 p, float a) { float s=sin(a),c=cos(a); return vec2(p.x*c-p.y*s,p.x*s+p.y*c); }

float sdEllipse(vec2 p, vec2 ab) { vec2 q=p/ab; return (length(q)-1.0)*min(ab.x,ab.y); }

float sdShape(vec2 cPx, vec2 ePx, vec2 eSz) {
  eSz = abs(eSz);
  vec2 ctr = ePx + eSz * 0.5;
  vec2 rel = cPx - ctr;
  vec2 loc = rotate2D(rel, 0.0) + eSz * 0.5;
  vec2 p   = loc - eSz * 0.5;
  vec2 h   = eSz * 0.5;
  return sdEllipse(p, vec2(max(h.x, 0.00001), max(h.y, 0.00001)));
}

void main() {
  vec2 uv = vTextureCoord;

  // Autonomous ellipse drift \u2014 slow lissajous, different frequencies from noise
  // Keeps orbiting gently so the highlight never settles
  vec2 drift = vec2(
    sin(uTime * 0.19) * 0.10 + sin(uTime * 0.07) * 0.05,
    cos(uTime * 0.14) * 0.08 + cos(uTime * 0.09) * 0.04
  );
  uv -= drift;

  vec2 cPx = vec2(uv.x * uArtboardResolution.x, (1.0 - uv.y) * uArtboardResolution.y);

  float aw = 0.60 * uArtboardResolution.x;
  float ah = aw / 1.0256;
  vec2 eSz = vec2(aw, ah);
  vec2 ePx = vec2(0.5, 0.4993) * uArtboardResolution - vec2(0.5, 0.5) * eSz;

  float dist = sdShape(cPx, ePx, eSz);
  float aa   = max(length(vec2(dFdx(dist), dFdy(dist))), 0.75);
  float fillAlpha = 1.0 - smoothstep(mix(0.0, -150.0, 1.5), mix(aa, 150.0, 1.5), dist);

  vec4 bg  = texture(uBgTexture, vTextureCoord);
  vec4 col;
  if (fillAlpha > 0.001) {
    vec3 unpre   = vec3(1.0); // white fill
    vec3 blended = blendOverlay(unpre, bg.rgb);
    col = vec4(blended, 1.0) * (fillAlpha * 0.60);
    col = col + bg * (1.0 - col.a);
  } else {
    col = bg;
  }
  fragColor = col;
}`,ve=`#version 300 es
precision highp float;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3((p3.x+p3.y)*p3.z,(p3.x+p3.z)*p3.y,(p3.y+p3.z)*p3.x));
}
float perlin(vec3 p) {
  vec3 pi=floor(p), pf=p-pi, w=pf*pf*(3.0-2.0*pf);
  float n000=dot(pf-vec3(0,0,0),hash33(pi+vec3(0,0,0)));
  float n100=dot(pf-vec3(1,0,0),hash33(pi+vec3(1,0,0)));
  float n010=dot(pf-vec3(0,1,0),hash33(pi+vec3(0,1,0)));
  float n110=dot(pf-vec3(1,1,0),hash33(pi+vec3(1,1,0)));
  float n001=dot(pf-vec3(0,0,1),hash33(pi+vec3(0,0,1)));
  float n101=dot(pf-vec3(1,0,1),hash33(pi+vec3(1,0,1)));
  float n011=dot(pf-vec3(0,1,1),hash33(pi+vec3(0,1,1)));
  float n111=dot(pf-vec3(1,1,1),hash33(pi+vec3(1,1,1)));
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),
             mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z);
}

const float PI = 3.14159265359;

void main() {
  vec2 uv = vTextureCoord, st = uv;
  float ar  = uResolution.x / max(uResolution.y, 0.001);
  vec2  av  = vec2(ar, 1.0);
  // Fixed centre \u2014 no mouse, global flow
  vec2  pos = vec2(0.5017, 0.4916);
  float d   = max(0.0, 1.0 - length(st*av - pos*av) * 4.0);
  float sprd = (0.20 + 0.01) / ((ar + 1.0) / 2.0);
  float amt  = (0.80 * 2.0) * 0.01 * d;
  if (amt > 0.0) {
    vec2  inv  = 1.0 - pos;
    float freq = 5.0 * sprd;
    float t2   = uTime * 0.0166;
    float rad  = 360.0 * 0.5 * 6.0 * PI / 180.0;
    for (int i = 0; i < 8; i++) {
      vec2  cs = clamp(st, -1.0, 2.0);
      vec2  sc = (cs - 0.5) * av + inv;
      float pn = perlin(vec3((sc - 0.5) * freq, t2)) - 0.5;
      st      += vec2(cos(pn * rad), sin(pn * rad)) * amt;
    }
    st = mix(uv, clamp(st, 0.0, 1.0), 1.0);
  }
  fragColor = texture(uTexture, st);
}`,fe=`#version 300 es
precision highp float;
precision highp int;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec3 blendOverlay(vec3 src, vec3 dst) {
  return vec3(
    (dst.x<=0.5)?(2.0*src.x*dst.x):(1.0-2.0*(1.0-dst.x)*(1.0-src.x)),
    (dst.y<=0.5)?(2.0*src.y*dst.y):(1.0-2.0*(1.0-dst.y)*(1.0-src.y)),
    (dst.z<=0.5)?(2.0*src.z*dst.z):(1.0-2.0*(1.0-dst.z)*(1.0-src.z))
  );
}

uvec2 pcg2d(uvec2 v) {
  v = v*1664525u+1013904223u;
  v.x += v.y*v.y*1664525u+1013904223u;
  v.y += v.x*v.x*1664525u+1013904223u;
  v ^= v>>16u;
  v.x += v.y*v.y*1664525u+1013904223u;
  v.y += v.x*v.x*1664525u+1013904223u;
  return v;
}
float randFibo(vec2 p) {
  uvec2 v = floatBitsToUint(p); v = pcg2d(v);
  return float(v.x ^ v.y) / float(0xffffffffu);
}

void main() {
  vec2 uv    = vTextureCoord;
  vec4 color = texture(uTexture, uv);
  if (color.a <= 0.001) { fragColor = vec4(0); return; }
  vec2  st    = uv * uResolution;
  float delta = fract(floor(uTime) / 20.0);
  vec3  grain = vec3(
    randFibo(st + vec2(1,2) + delta),
    randFibo(st + vec2(2,3) + delta),
    randFibo(st + vec2(3,4) + delta)
  );
  color.rgb = mix(color.rgb, blendOverlay(grain, color.rgb), 0.10);
  fragColor = color;
}`;function oe(r,n,i){let o=r.createShader(n);if(r.shaderSource(o,i),r.compileShader(o),!r.getShaderParameter(o,r.COMPILE_STATUS))throw new Error(r.getShaderInfoLog(o)??"shader compile error");return o}function L(r,n,i){let o=r.createProgram();if(r.attachShader(o,oe(r,r.VERTEX_SHADER,n)),r.attachShader(o,oe(r,r.FRAGMENT_SHADER,i)),r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(r.getProgramInfoLog(o)??"program link error");return o}function z(r,n,i){let o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,n,i,0,r.RGBA,r.UNSIGNED_BYTE,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);let e=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,e),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),{fbo:e,tex:o}}var J=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);function te({className:r="",style:n}){let i=G(null);return V(()=>{let o=i.current,e=o.getContext("webgl2",{antialias:!1,alpha:!1});if(!e)return;let T,b,R,A,h;try{T=L(e,ne,ce),b=L(e,D,se),R=L(e,D,ue),A=L(e,D,ve),h=L(e,D,fe)}catch(t){console.error("WingedGradientCanvas shader error:",t);return}let N=new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),X=new Float32Array([0,0,1,0,0,1,1,1]),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,N,e.STATIC_DRAW);let P=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,P),e.bufferData(e.ARRAY_BUFFER,X,e.STATIC_DRAW);function d(t){let a=e.createVertexArray();e.bindVertexArray(a);let l=e.getAttribLocation(t,"aVertexPosition"),x=e.getAttribLocation(t,"aTextureCoord");return e.bindBuffer(e.ARRAY_BUFFER,y),l>=0&&(e.enableVertexAttribArray(l),e.vertexAttribPointer(l,3,e.FLOAT,!1,0,0)),e.bindBuffer(e.ARRAY_BUFFER,P),x>=0&&(e.enableVertexAttribArray(x),e.vertexAttribPointer(x,2,e.FLOAT,!1,0,0)),e.bindVertexArray(null),a}let O=d(T),k=d(b),q=d(R),Y=d(A),H=d(h),c=0,s=0,v=z(e,1,1),f=z(e,1,1),g=()=>{c=o.width=o.offsetWidth*Math.min(window.devicePixelRatio,2),s=o.height=o.offsetHeight*Math.min(window.devicePixelRatio,2),e.viewport(0,0,c,s),e.deleteTexture(v.tex),e.deleteFramebuffer(v.fbo),e.deleteTexture(f.tex),e.deleteFramebuffer(f.fbo),v=z(e,c,s),f=z(e,c,s)};g();let w=new ResizeObserver(g);w.observe(o);function u(t,a){return e.getUniformLocation(t,a)}function m(t,a,l,x){e.uniformMatrix4fv(u(t,"uMVMatrix"),!1,J),e.uniformMatrix4fv(u(t,"uPMatrix"),!1,J);let C=u(t,"uTextureMatrix");C&&e.uniformMatrix4fv(C,!1,J);let M=u(t,"uTime");M&&e.uniform1f(M,a);let S=u(t,"uResolution");S&&e.uniform2f(S,c,s);let U=u(t,"uArtboardResolution");if(U&&e.uniform2f(U,c,s),l){let p=u(t,"uTexture");p&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,l),e.uniform1i(p,0))}if(x){let p=u(t,"uBgTexture");p&&(e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,x),e.uniform1i(p,1))}}let j=performance.now(),E=0,_=t=>{let a=(t-j)/1e3;e.bindFramebuffer(e.FRAMEBUFFER,v.fbo),e.viewport(0,0,c,s),e.useProgram(T),e.bindVertexArray(O),m(T,a),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,f.fbo),e.useProgram(b),e.bindVertexArray(k),m(b,a,v.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,v.fbo),e.useProgram(R),e.bindVertexArray(q),m(R,a,null,f.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,f.fbo),e.useProgram(A),e.bindVertexArray(Y),m(A,a,v.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,c,s),e.useProgram(h),e.bindVertexArray(H),m(h,a*.5,f.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindVertexArray(null),E=requestAnimationFrame(_)};return E=requestAnimationFrame(_),()=>{w.disconnect(),cancelAnimationFrame(E)}},[]),F("canvas",{ref:i,className:`absolute inset-0 w-full h-full ${r}`,style:n})}var le=`#version 300 es
precision mediump float;
in vec3 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
out vec2 vTextureCoord;
out vec3 vVertexPosition;
void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
}`,I=`#version 300 es
precision mediump float;
in vec3 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;
out vec2 vTextureCoord;
out vec3 vVertexPosition;
void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}`,xe=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
out vec4 fragColor;
void main() { fragColor = vec4(1.0, 1.0, 1.0, 1.0); }`,de=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec4 applyLayerMix(vec4 color, vec4 bg, float amount) {
  color.rgb = mix(bg.rgb, color.rgb, amount);
  color.a   = max(bg.a, amount);
  return color;
}
uvec2 pcg2d(uvec2 v) {
  v = v*1664525u+1013904223u;
  v.x += v.y*v.y*1664525u+1013904223u;
  v.y += v.x*v.x*1664525u+1013904223u;
  v ^= v>>16u;
  v.x += v.y*v.y*1664525u+1013904223u;
  v.y += v.x*v.x*1664525u+1013904223u;
  return v;
}
float randFibo(vec2 p) { uvec2 v=floatBitsToUint(p); v=pcg2d(v); return float(v.x^v.y)/float(0xffffffffu); }
float deband() { return (randFibo(gl_FragCoord.xy)-0.5)/255.0; }

const float TAU = 6.28318530718;

vec3 anchoredPal(float t, vec3 col1, vec3 col2, float chroma) {
  vec3 mid=0.5*(col1+col2), axisAmp=0.5*(col2-col1);
  vec3 base=mid+axisAmp*cos(TAU*t);
  vec3 axis=length(axisAmp)>0.0001?normalize(axisAmp):vec3(1,0,0);
  vec3 ref=abs(axis.x)>0.9?vec3(0,1,0):vec3(1,0,0);
  vec3 t1=normalize(cross(axis,ref)), t2=normalize(cross(axis,t1));
  float rich=0.24*length(axisAmp)+0.02;
  vec3 ripple=t1*sin(TAU*(t*2.+0.123))+t2*sin(TAU*(t*3.+0.437));
  vec3 col=base+(rich*chroma)*ripple;
  col=clamp(col,-10.,10.);
  col=1./(1.+exp(-col*4.+0.25)*7.5);
  return clamp(col,0.,1.);
}

vec3 hash3(vec2 p) {
  vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)));
  return fract(sin(q)*43758.5453);
}

// tight voronoi: turbulence=1.0, scale=1 \u2192 uniform weight k\u22481
float voronoise(vec2 uv, float time) {
  // scale=1, direction=0.5, drift=0.03
  vec2 skew=vec2(0.5,0.5);
  vec2 d=vec2(0., 0.03*time*0.008);
  vec2 x=(uv*skew*2.)-d*2.;
  vec2 p=floor(x), f=fract(x);
  float va=0.,wt=0.;
  for(int j=-2;j<=2;j++) for(int i=-2;i<=2;i++){
    vec2 g=vec2(float(i),float(j));
    vec3 o=hash3(p+g);
    o.xy+=0.5*vec2(sin(time*0.1+o.x*6.28));
    vec2 r=g-f+o.xy;
    float dd=dot(r,r);
    // k=1 (v=1 \u2192 pow(\u2026,0)=1, but k=1+63*0=1)
    float ww=pow(max(0.,1.-smoothstep(0.,1.414,sqrt(dd))),1.);
    va+=o.z*ww; wt+=ww;
  }
  return va/max(wt,1e-5);
}

void main() {
  vec2 uv=vTextureCoord;
  float ar=uResolution.x/uResolution.y;

  // Slow autonomous drift
  vec2 drift=vec2(sin(uTime*0.06)*0.03, cos(uTime*0.05)*0.025);
  vec2 st=(uv-vec2(0.5)-drift)*vec2(ar,1.); // scale=1

  float raw=voronoise(st, uTime);
  // turbulence=1.0 \u2192 mix(0.5, noise, 1.0*2.5)=mix(0.5,noise,2.5) \u2014 clamp to [0,1]
  float noise=clamp(mix(0.5,raw,2.5),0.,1.);

  float shift=0.37+uTime*0.01;
  vec3 noiseColor=anchoredPal(
    noise+shift,
    vec3(0.,0.,0.),           // col1: black
    vec3(0.25,0.12,0.72),     // col2: deep indigo (between mobile/desktop)
    0.15                       // chroma: low \u2014 near-monochrome dark cells
  );

  vec4 color=texture(uTexture,uv);
  vec4 bg=color;
  color.rgb=noiseColor;
  color.rgb+=deband()*0.5;
  fragColor=applyLayerMix(clamp(color,0.,1.),bg,1.);
}`,me=`#version 300 es
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;
uniform vec2 uArtboardResolution;
uniform float uTime;
uniform sampler2D uBgTexture;
out vec4 fragColor;

vec3 blendOverlay(vec3 src, vec3 dst) {
  return vec3(
    dst.x<=0.5?2.*src.x*dst.x:1.-2.*(1.-dst.x)*(1.-src.x),
    dst.y<=0.5?2.*src.y*dst.y:1.-2.*(1.-dst.y)*(1.-src.y),
    dst.z<=0.5?2.*src.z*dst.z:1.-2.*(1.-dst.z)*(1.-src.z)
  );
}
vec2 rotate2D(vec2 p,float a){float s=sin(a),c=cos(a);return vec2(p.x*c-p.y*s,p.x*s+p.y*c);}
float sdEllipse(vec2 p,vec2 ab){vec2 q=p/ab;return(length(q)-1.)*min(ab.x,ab.y);}
float sdShape(vec2 cPx,vec2 ePx,vec2 eSz){
  eSz=abs(eSz);vec2 ctr=ePx+eSz*.5;
  vec2 rel=cPx-ctr,loc=rotate2D(rel,0.)+eSz*.5;
  vec2 h=eSz*.5;
  return sdEllipse(loc-h,vec2(max(h.x,0.00001),max(h.y,0.00001)));
}

void main() {
  vec2 uv=vTextureCoord;
  // Autonomous lissajous drift
  vec2 drift=vec2(
    sin(uTime*0.17)*0.07+sin(uTime*0.06)*0.03,
    cos(uTime*0.12)*0.05+cos(uTime*0.08)*0.03
  );
  uv-=drift;
  vec2 cPx=vec2(uv.x*uArtboardResolution.x,(1.-uv.y)*uArtboardResolution.y);
  float aw=0.60*uArtboardResolution.x, ah=aw/1.0256;
  vec2 eSz=vec2(aw,ah);
  vec2 ePx=vec2(0.5,0.4993)*uArtboardResolution-vec2(0.5)*eSz;
  float dist=sdShape(cPx,ePx,eSz);
  float aa=max(length(vec2(dFdx(dist),dFdy(dist))),0.75);
  float fillAlpha=1.-smoothstep(mix(0.,-150.,1.5),mix(aa,150.,1.5),dist);
  vec4 bg=texture(uBgTexture,vTextureCoord);
  vec4 col;
  if(fillAlpha>0.001){
    vec3 fill=vec3(0.318,0.314,0.969); // #5150F7 indigo
    vec3 blended=blendOverlay(fill,bg.rgb);
    col=vec4(blended,1.)*fillAlpha*0.60;
    col=col+bg*(1.-col.a);
  } else { col=bg; }
  fragColor=col;
}`,pe=`#version 300 es
precision highp float;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec3 hash33(vec3 p3){
  p3=fract(p3*vec3(0.1031,0.11369,0.13787));
  p3+=dot(p3,p3.yxz+19.19);
  return -1.+2.*fract(vec3((p3.x+p3.y)*p3.z,(p3.x+p3.z)*p3.y,(p3.y+p3.z)*p3.x));
}
float perlin(vec3 p){
  vec3 pi=floor(p),pf=p-pi,w=pf*pf*(3.-2.*pf);
  float n000=dot(pf-vec3(0,0,0),hash33(pi+vec3(0,0,0)));
  float n100=dot(pf-vec3(1,0,0),hash33(pi+vec3(1,0,0)));
  float n010=dot(pf-vec3(0,1,0),hash33(pi+vec3(0,1,0)));
  float n110=dot(pf-vec3(1,1,0),hash33(pi+vec3(1,1,0)));
  float n001=dot(pf-vec3(0,0,1),hash33(pi+vec3(0,0,1)));
  float n101=dot(pf-vec3(1,0,1),hash33(pi+vec3(1,0,1)));
  float n011=dot(pf-vec3(0,1,1),hash33(pi+vec3(0,1,1)));
  float n111=dot(pf-vec3(1,1,1),hash33(pi+vec3(1,1,1)));
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),
             mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z);
}

const float PI=3.14159265359;
void main(){
  vec2 uv=vTextureCoord,st=uv;
  float ar=uResolution.x/max(uResolution.y,0.001);
  vec2 av=vec2(ar,1.);
  vec2 pos=vec2(0.5017,0.4916);
  float d=max(0.,1.-length(st*av-pos*av)*4.);
  // Mobile: spread=0.36, amount=1.0
  float sprd=(0.36+0.01)/((ar+1.)/2.);
  float amt=(1.0*2.)*0.01*d;
  if(amt>0.){
    vec2 inv=1.-pos;
    float freq=5.*sprd;
    // phase=0.07, time speed=0.15 mapped to 0.0166 factor
    float t2=0.07*5.+uTime*0.0166*0.15/0.1;
    // angle=0.2079*6*360 degrees
    float rad=360.*0.2079*6.*PI/180.;
    for(int i=0;i<8;i++){
      vec2 cs=clamp(st,-1.,2.);
      vec2 sc=(cs-0.5)*av+inv;
      float pn=perlin(vec3((sc-0.5)*freq,t2))-0.5;
      st+=vec2(cos(pn*rad),sin(pn*rad))*amt;
    }
    // blend=1.0 (full)
    st=mix(uv,clamp(st,0.,1.),1.);
  }
  fragColor=texture(uTexture,st);
}`,Te=`#version 300 es
precision highp float;
precision highp int;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

vec3 blendOverlay(vec3 src,vec3 dst){
  return vec3(
    dst.x<=0.5?2.*src.x*dst.x:1.-2.*(1.-dst.x)*(1.-src.x),
    dst.y<=0.5?2.*src.y*dst.y:1.-2.*(1.-dst.y)*(1.-src.y),
    dst.z<=0.5?2.*src.z*dst.z:1.-2.*(1.-dst.z)*(1.-src.z)
  );
}
uvec2 pcg2d(uvec2 v){
  v=v*1664525u+1013904223u;
  v.x+=v.y*v.y*1664525u+1013904223u;
  v.y+=v.x*v.x*1664525u+1013904223u;
  v^=v>>16u;
  v.x+=v.y*v.y*1664525u+1013904223u;
  v.y+=v.x*v.x*1664525u+1013904223u;
  return v;
}
float randFibo(vec2 p){uvec2 v=floatBitsToUint(p);v=pcg2d(v);return float(v.x^v.y)/float(0xffffffffu);}

void main(){
  vec2 uv=vTextureCoord;
  vec4 color=texture(uTexture,uv);
  if(color.a<=0.001){fragColor=vec4(0);return;}
  vec2 st=uv*uResolution;
  float delta=fract(floor(uTime)/20.);
  vec3 grain=vec3(randFibo(st+vec2(1,2)+delta),randFibo(st+vec2(2,3)+delta),randFibo(st+vec2(3,4)+delta));
  color.rgb=mix(color.rgb,blendOverlay(grain,color.rgb),0.10);
  fragColor=color;
}`;function ae(r,n,i){let o=r.createShader(n);if(r.shaderSource(o,i),r.compileShader(o),!r.getShaderParameter(o,r.COMPILE_STATUS))throw new Error(r.getShaderInfoLog(o)??"shader error");return o}function B(r,n,i){let o=r.createProgram();if(r.attachShader(o,ae(r,r.VERTEX_SHADER,n)),r.attachShader(o,ae(r,r.FRAGMENT_SHADER,i)),r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(r.getProgramInfoLog(o)??"link error");return o}function W(r,n,i){let o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,n,i,0,r.RGBA,r.UNSIGNED_BYTE,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);let e=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,e),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),{fbo:e,tex:o}}var Q=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);function ie({className:r="",style:n}){let i=G(null);return V(()=>{let o=i.current,e=o.getContext("webgl2",{antialias:!1,alpha:!1});if(!e)return;let T,b,R,A,h;try{T=B(e,le,xe),b=B(e,I,de),R=B(e,I,me),A=B(e,I,pe),h=B(e,I,Te)}catch(t){console.error("WingedNoiseCanvas:",t);return}let N=new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),X=new Float32Array([0,0,1,0,0,1,1,1]),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,N,e.STATIC_DRAW);let P=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,P),e.bufferData(e.ARRAY_BUFFER,X,e.STATIC_DRAW);function d(t){let a=e.createVertexArray();e.bindVertexArray(a);let l=e.getAttribLocation(t,"aVertexPosition"),x=e.getAttribLocation(t,"aTextureCoord");return e.bindBuffer(e.ARRAY_BUFFER,y),l>=0&&(e.enableVertexAttribArray(l),e.vertexAttribPointer(l,3,e.FLOAT,!1,0,0)),e.bindBuffer(e.ARRAY_BUFFER,P),x>=0&&(e.enableVertexAttribArray(x),e.vertexAttribPointer(x,2,e.FLOAT,!1,0,0)),e.bindVertexArray(null),a}let O=d(T),k=d(b),q=d(R),Y=d(A),H=d(h),c=0,s=0,v=W(e,1,1),f=W(e,1,1),g=()=>{c=o.width=o.offsetWidth*Math.min(window.devicePixelRatio,2),s=o.height=o.offsetHeight*Math.min(window.devicePixelRatio,2),e.viewport(0,0,c,s),e.deleteTexture(v.tex),e.deleteFramebuffer(v.fbo),e.deleteTexture(f.tex),e.deleteFramebuffer(f.fbo),v=W(e,c,s),f=W(e,c,s)};g();let w=new ResizeObserver(g);w.observe(o);function u(t,a){return e.getUniformLocation(t,a)}function m(t,a,l,x){e.uniformMatrix4fv(u(t,"uMVMatrix"),!1,Q),e.uniformMatrix4fv(u(t,"uPMatrix"),!1,Q);let C=u(t,"uTextureMatrix");C&&e.uniformMatrix4fv(C,!1,Q);let M=u(t,"uTime");M&&e.uniform1f(M,a);let S=u(t,"uResolution");S&&e.uniform2f(S,c,s);let U=u(t,"uArtboardResolution");if(U&&e.uniform2f(U,c,s),l){let p=u(t,"uTexture");p&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,l),e.uniform1i(p,0))}if(x){let p=u(t,"uBgTexture");p&&(e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,x),e.uniform1i(p,1))}}let j=performance.now(),E=0,_=t=>{let a=(t-j)/1e3;e.bindFramebuffer(e.FRAMEBUFFER,v.fbo),e.viewport(0,0,c,s),e.useProgram(T),e.bindVertexArray(O),m(T,a),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,f.fbo),e.useProgram(b),e.bindVertexArray(k),m(b,a,v.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,v.fbo),e.useProgram(R),e.bindVertexArray(q),m(R,a,null,f.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,f.fbo),e.useProgram(A),e.bindVertexArray(Y),m(A,a,v.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,c,s),e.useProgram(h),e.bindVertexArray(H),m(h,a*.5,f.tex),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindVertexArray(null),E=requestAnimationFrame(_)};return E=requestAnimationFrame(_),()=>{w.disconnect(),cancelAnimationFrame(E)}},[]),F("canvas",{ref:i,className:`absolute inset-0 w-full h-full ${r}`,style:n})}window.mountWingedShader=function(r,n){ee(n),(r==="date"?ie:te)({});var i=re();return function(){i.forEach(function(o){typeof o=="function"&&o()})}};})();
