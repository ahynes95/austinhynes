import React, { useRef, useEffect } from "react";

interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: { text: string; onClick?: () => void };
    secondary?: { text: string; onClick?: () => void };
  };
  className?: string;
}

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, defaultShaderSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");

    let raf = 0;
    const render = (now: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <section
      className={`relative h-screen w-screen overflow-hidden bg-black text-white ${className}`}
    >
      <style>{`
        @keyframes fade-in-down { from { opacity:0; transform: translateY(-20px);} to { opacity:1; transform:none;} }
        @keyframes fade-in-up { from { opacity:0; transform: translateY(30px);} to { opacity:1; transform:none;} }
        .animate-fade-in-down { animation: fade-in-down .8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up .8s ease-out forwards; opacity: 0; }
        .animation-delay-200 { animation-delay: .2s; }
        .animation-delay-400 { animation-delay: .4s; }
        .animation-delay-600 { animation-delay: .6s; }
      `}</style>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        {trustBadge && (
          <div className="mb-6 inline-flex animate-fade-in-down items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-wider text-white/80 backdrop-blur">
            {trustBadge.icons && (
              <span className="flex gap-1">
                {trustBadge.icons.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </span>
            )}
            {trustBadge.text}
          </div>
        )}

        <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block animate-fade-in-up animation-delay-200">
            {headline.line1}
          </span>
          <span className="block animate-fade-in-up animation-delay-400 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(251,146,60,0.3)]">
            {headline.line2}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-in-up animation-delay-600 text-base text-white/70 sm:text-lg md:text-xl">
          {subtitle}
        </p>

        {buttons && (buttons.primary || buttons.secondary) && (
          <div className="mt-10 flex animate-fade-in-up animation-delay-600 flex-col items-center gap-4 sm:flex-row">
            {buttons.primary && (
              <button
                onClick={buttons.primary.onClick}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                {buttons.primary.text}
              </button>
            )}
            {buttons.secondary && (
              <button
                onClick={buttons.secondary.onClick}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                {buttons.secondary.text}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
