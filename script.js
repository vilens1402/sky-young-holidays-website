(() => {
  const preloader = document.querySelector('.preloader');
  const hideLoader = () => window.setTimeout(() => preloader?.classList.add('done'), 450);
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // A silent, movie-like opening sequence: four scenic chapters, slow camera moves and a star-dust layer.
  const kumbhHero = document.querySelector('.kumbh-hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (kumbhHero && !reduceMotion) {
    const layers = [...kumbhHero.querySelectorAll('[data-depth]')];
    let tx=0,ty=0,cx=0,cy=0,raf=0;
    const move=(x,y)=>{tx=x;ty=y;if(!raf)raf=requestAnimationFrame(tick)};
    const tick=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;layers.forEach(layer=>{const d=Number(layer.dataset.depth);layer.style.transform='translate3d('+(-cx*d*22)+'px,'+(-cy*d*15)+'px,'+(d*160-80)+'px) scale('+(1.04+d*.06)+')'});if(Math.abs(tx-cx)>.1||Math.abs(ty-cy)>.1)raf=requestAnimationFrame(tick);else raf=0};
    kumbhHero.addEventListener('pointermove',e=>{const r=kumbhHero.getBoundingClientRect();move((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5)});
    kumbhHero.addEventListener('pointerleave',()=>move(0,0));
  }
  const hero = document.querySelector('.cinematic-hero');
  if (!hero) return;
  const scenes = [...hero.querySelectorAll('.film-scene')];
  if (!scenes.length) {
    const canvas=hero.querySelector('.kumbh-diyas'),ctx=canvas?.getContext('2d');
    if(ctx&&!reduced){
      let w=0,h=0,embers=[],frame;
      const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);w=hero.clientWidth;h=hero.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);embers=Array.from({length:Math.min(65,Math.round(w/15))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+.7,vx:(Math.random()-.5)*.25,vy:-Math.random()*.45-.12,a:Math.random()*.55+.2,p:Math.random()*6}))};
      resize();window.addEventListener('resize',resize,{passive:true});
      const draw=()=>{ctx.clearRect(0,0,w,h);embers.forEach(e=>{e.x+=e.vx+Math.sin(e.p)*.08;e.y+=e.vy;e.p+=.02;if(e.y<-8){e.y=h+8;e.x=Math.random()*w}const glow=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*5);glow.addColorStop(0,'rgba(255,221,158,'+e.a+')');glow.addColorStop(1,'rgba(255,154,73,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(e.x,e.y,e.r*5,0,Math.PI*2);ctx.fill()});frame=requestAnimationFrame(draw)};
      draw();document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else draw()});
    }
    return;
  }
  const captions = ['THE JOURNEY BEGINS','FOLLOW THE HORIZON','FEEL THE FREEDOM','FIND YOUR ELSEWHERE'];
  const counter = hero.querySelector('.scene-counter');
  const caption = hero.querySelector('.scene-caption');
  const progress = hero.querySelector('.movie-progress span');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sceneIndex = 0;
  let sceneTimer;
  const setScene = index => {
    sceneIndex = index % scenes.length;
    scenes.forEach((scene,i) => scene.classList.toggle('active',i===sceneIndex));
    if(counter) counter.textContent = String(sceneIndex+1).padStart(2,'0')+' / 04';
    if(caption) caption.textContent = captions[sceneIndex];
  };
  const playIntro = () => {
    clearInterval(sceneTimer);
    setScene(0);
    hero.classList.remove('intro-playing');
    void hero.offsetWidth;
    hero.classList.add('intro-playing');
    if (!reduced) sceneTimer = setInterval(() => setScene(sceneIndex+1),4500);
  };
  hero.querySelector('.replay-intro')?.addEventListener('click',playIntro);
  if (!reduced) playIntro();

  const canvas = hero.querySelector('.sky-particles');
  const ctx = canvas?.getContext('2d');
  if (ctx && !reduced) {
    let w=0,h=0,particles=[];
    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,1.6);
      w=hero.clientWidth;h=hero.clientHeight;
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      particles=Array.from({length:Math.min(95,Math.round(w/12))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.25,a:Math.random()*.55+.12,s:Math.random()*.22+.06,phase:Math.random()*6}));
    };
    resize();window.addEventListener('resize',resize,{passive:true});
    let frame;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y-=p.s;p.phase+=.012;if(p.y<0){p.y=h;p.x=Math.random()*w}
        const alpha=p.a*(.65+.35*Math.sin(p.phase));
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(225,199,145,'+alpha+')';ctx.fill();
      });
      frame=requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame)}else draw()});
  }
})();