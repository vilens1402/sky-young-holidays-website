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
  const hero = document.querySelector('.cinematic-hero');
  if (!hero) return;
  const scenes = [...hero.querySelectorAll('.film-scene')];
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