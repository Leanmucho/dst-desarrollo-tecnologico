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

})();
