(() => {
  const dialog = document.querySelector('#projectDialog');
  const form = document.querySelector('#projectForm');
  const ready = document.querySelector('#projectReady');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let previousFocus, previousOverflow = '', draft = '';
  function glitch() {
    if (reducedMotion.matches || document.body.classList.contains('paused')) return;
    dialog.classList.remove('project-glitch');
    void dialog.offsetWidth;
    dialog.classList.add('project-glitch');
  }
  function openProject(service) {
    previousFocus = document.activeElement;
    if (service) for (const radio of form.elements.service) radio.checked = radio.value === service;
    form.hidden = false;
    ready.hidden = true;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    glitch();
    form.elements.name.focus({ preventScroll: true });
  }
  const services = ['Software a medida', 'Automatización', 'IA aplicada', 'Integraciones'];
  document.querySelectorAll('.service-list details').forEach((detail, index) => {
    const summary = detail.querySelector('summary');
    summary.setAttribute('aria-haspopup', 'dialog');
    summary.setAttribute('aria-controls', 'projectDialog');
    summary.addEventListener('click', event => {
      event.preventDefault();
      detail.open = true;
      openProject(services[index]);
    });
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'service-contact';
    button.textContent = 'CONSULTAR ESTE SERVICIO ↗';
    button.addEventListener('click', () => openProject(services[index]));
    detail.querySelector('.service-body').append(button);
  });
  document.querySelectorAll('[data-project-open]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openProject('Necesito orientación');
  }));
  document.querySelector('#projectClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    previousFocus?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const idea = String(data.get('idea')).trim();
    if (!name || idea.length < 10) {
      const field = !name ? form.elements.name : form.elements.idea;
      field.setCustomValidity(!name ? 'Escribí tu nombre.' : 'Contanos un poco más: al menos 10 caracteres.');
      field.reportValidity();
      return;
    }
    const service = String(data.get('service'));
    const subject = `Proyecto DST — ${service}`;
    draft = `Hola DST,\n\nSoy ${name}.\nMi email: ${email}\nServicio: ${service}\n\nMi idea:\n${idea}\n\nGracias.`;
    document.querySelector('#projectMail').href = `mailto:acunaleandro3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
    document.querySelector('#projectGmail').href = `https://mail.google.com/mail/?view=cm&fs=1&to=acunaleandro3%40gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
    document.querySelector('#projectPreview').textContent = draft;
    document.querySelector('#projectStatus').textContent = '';
    form.hidden = true;
    ready.hidden = false;
    glitch();
    document.querySelector('#projectMail').focus();
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  document.querySelector('#projectEdit').addEventListener('click', () => {
    ready.hidden = true;
    form.hidden = false;
    form.elements.idea.focus();
  });
  document.querySelector('#projectCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draft);
      document.querySelector('#projectStatus').textContent = 'Consulta copiada. Pegala en tu correo y enviala a acunaleandro3@gmail.com.';
    } catch {
      document.querySelector('#projectStatus').textContent = 'Podés seleccionar y copiar el texto del borrador que aparece arriba.';
    }
  });
})();
