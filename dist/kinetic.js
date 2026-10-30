(() => {
  const heading = document.querySelector('.hero-title h1');
  const lines = [...heading.querySelectorAll('.line')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = [
    ['FUERA DE LO', 'AUTOMÁTICO.'],
    ['MENOS CAOS.', 'MÁS SISTEMA.'],
    ['IDEAS QUE', 'SE CONECTAN.'],
    ['CÓDIGO CON', 'PROPÓSITO.']
  ];
  let index = 0, heroVisible = true, switching = false;
  const enabled = () => !preference.matches && !document.body.classList.contains('paused') && !document.hidden;
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }).observe(heading);
  function setPhrase(phrase) {
    lines.forEach((line, i) => {
      line.replaceChildren();
      if (i === 1 && phrase[i].endsWith('.')) {
        line.append(document.createTextNode(phrase[i].slice(0, -1)));
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.textContent = '.';
        line.append(dot);
      } else line.textContent = phrase[i];
      line.dataset.text = phrase[i];
    });
    heading.setAttribute('aria-label', phrase.join(' '));
  }
  setInterval(() => {
    if (!enabled() || !heroVisible || switching || document.querySelector('dialog[open]') || !document.querySelector('#menu').hidden) return;
    switching = true;
    heading.classList.add('phrase-switch');
    setTimeout(() => {
      index = (index + 1) % phrases.length;
      setPhrase(phrases[index]);
    }, 190);
    setTimeout(() => {
      heading.classList.remove('phrase-switch');
      switching = false;
    }, 780);
  }, 5200);

  const canvas = document.createElement('canvas');
  canvas.id = 'acidTrail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const context = canvas.getContext('2d');
  if (!context) return;
  let width, height, particles = [], frame = null, lastPoint = null, lastEmission = 0;
  function size() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function clear() {
    particles = [];
    lastPoint = null;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    context.clearRect(0, 0, width, height);
  }
  function star(x, y, radius, rotation) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.beginPath();
    context.moveTo(0, -radius);
    context.lineTo(radius * .19, -radius * .19);
    context.lineTo(radius, 0);
    context.lineTo(radius * .19, radius * .19);
    context.lineTo(0, radius);
    context.lineTo(-radius * .19, radius * .19);
    context.lineTo(-radius, 0);
    context.lineTo(-radius * .19, -radius * .19);
    context.closePath();
    context.fill();
    context.restore();
  }
  function render(time) {
    frame = null;
    if (!enabled()) { clear(); return; }
    context.clearRect(0, 0, width, height);
    particles = particles.filter(particle => time - particle.born < particle.life);
    context.globalCompositeOperation = 'lighter';
    for (const particle of particles) {
      const age = (time - particle.born) / particle.life;
      const fade = (1 - age) ** 1.5;
      const x = particle.x + particle.vx * age;
      const y = particle.y + particle.vy * age + age * age * 15;
      const radius = particle.radius * (1 - age * .6);
      const glow = context.createRadialGradient(x, y, 0, x, y, radius * 4.5);
      glow.addColorStop(0, `rgba(${particle.color},${fade * .3})`);
      glow.addColorStop(1, `rgba(${particle.color},0)`);
      context.fillStyle = glow;
      context.fillRect(x - radius * 4.5, y - radius * 4.5, radius * 9, radius * 9);
      context.fillStyle = `rgba(${particle.color},${fade})`;
      if (particle.star) star(x, y, radius, particle.rotation + age * .8);
      else context.fillRect(x, y, radius * .75, radius * .75);
    }
    context.globalCompositeOperation = 'source-over';
    if (particles.length) frame = requestAnimationFrame(render);
  }
  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !enabled() || document.querySelector('dialog[open]')) return;
    const now = performance.now();
    if (now - lastEmission < 18) return;
    lastEmission = now;
    const start = lastPoint || { x: event.clientX, y: event.clientY };
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    const count = Math.min(6, Math.max(2, Math.ceil(Math.hypot(dx, dy) / 15)));
    for (let i = 0; i < count; i++) {
      const part = (i + 1) / count;
      particles.push({ x: start.x + dx * part + (Math.random() - .5) * 12,
        y: start.y + dy * part + (Math.random() - .5) * 12,
        vx: (Math.random() - .5) * 55 - dx * .12, vy: (Math.random() - .5) * 55 - dy * .12,
        radius: 3 + Math.random() * 5, born: now, life: 900 + Math.random() * 750,
        rotation: Math.random() * Math.PI, star: Math.random() > .35,
        color: Math.random() > .85 ? '161,125,255' : '194,250,56' });
    }
    particles = particles.slice(-90);
    lastPoint = { x: event.clientX, y: event.clientY };
    if (frame === null) frame = requestAnimationFrame(render);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { lastPoint = null; });
  addEventListener('resize', () => { clear(); size(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  preference.addEventListener('change', clear);
  new MutationObserver(() => { if (!enabled()) clear(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  size();
})();
