(() => {
  const dialog = document.querySelector('#projectDialog');
  const form = document.querySelector('#projectForm');
  const ready = document.querySelector('#projectReady');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let previousFocus, previousOverflow = '', sending = false;
  const sendStatus = document.querySelector('#projectSendStatus');
  const submitButton = form.querySelector('[type="submit"]');
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
    sendStatus.textContent = '';
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
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
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
    if (!data.get('access_key')) {
      sendStatus.textContent = 'El envío todavía no está habilitado. Podés escribir a acunaleandro3@gmail.com.';
      return;
    }
    if (data.get('botcheck')) return;
    sending = true;
    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = 'ENVIANDO <span>↗</span>';
    sendStatus.textContent = 'Transmitiendo tu consulta…';
    const service = String(data.get('service'));
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: String(data.get('access_key')), name, email,
          service, subject: `Proyecto DST — ${service}`, from_name: 'DST — Desarrollo Tecnológico',
          message: idea, botcheck: false }),
        signal: AbortSignal.timeout(25000)
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('send_failed');
      form.hidden = true;
      ready.hidden = false;
      form.reset();
      sendStatus.textContent = '';
      glitch();
      ready.focus();
    } catch {
      sendStatus.textContent = 'No pudimos confirmar el envío. Tus datos siguen acá; podés volver a intentar o escribir a acunaleandro3@gmail.com.';
    } finally {
      sending = false;
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
      submitButton.innerHTML = 'ENVIAR CONSULTA <span>↗</span>';
    }
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  document.querySelector('#projectNew').addEventListener('click', () => {
    ready.hidden = true;
    form.hidden = false;
    form.elements.idea.focus();
  });
})();
