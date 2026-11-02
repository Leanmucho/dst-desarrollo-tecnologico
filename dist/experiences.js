(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function pulse(element) {
    if (reduced.matches || document.body.classList.contains('paused')) return;
    element.classList.remove('experience-change');
    void element.offsetWidth;
    element.classList.add('experience-change');
  }
  const routes = {
    consultas: ['CHATBOTS + WEB', 'Que cada consulta tenga un siguiente paso.', 'Un asistente puede responder preguntas frecuentes, reunir los datos necesarios y derivar la consulta. Tu web puede recibirla y enviarla al responsable.', 'Por ejemplo: un estudio recibe consultas por servicios, reúne lo que necesita para un presupuesto y deja cada solicitud registrada.', 'Chatbots y asistentes comerciales'],
    tareas: ['AUTOMATIZACIÓN', 'Que la información viaje una sola vez.', 'Conectamos formularios, correos y planillas para registrar datos, avisar al responsable y preparar seguimientos según reglas definidas.', 'Por ejemplo: una solicitud de turno se registra y genera un aviso al equipo, sin volver a copiar sus datos en otra planilla.', 'Automatización de tareas'],
    orden: ['SISTEMAS + PANELES', 'Que tu equipo vea qué pasó y qué sigue.', 'Reunimos clientes, consultas, responsables y estados de trabajo en una herramienta que acompañe tu operación.', 'Por ejemplo: una empresa de servicios ve los presupuestos pendientes, quién atiende cada caso y cuál es el próximo paso.', 'Sistemas y paneles a medida']
  };
  document.querySelectorAll('[data-problem]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-problem]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const route = routes[button.dataset.problem];
    document.querySelector('#solutionType').textContent = 'RUTA SUGERIDA / ' + route[0];
    document.querySelector('#solutionTitle').textContent = route[1];
    document.querySelector('#solutionText').textContent = route[2];
    document.querySelector('#solutionExample').textContent = route[3];
    document.querySelector('#solutionContact').dataset.projectService = route[4];
    pulse(document.querySelector('#solutionResult'));
  }));
  const explanations = {
    catalogo: ['01 / CATÁLOGO', 'La respuesta se apoya en tus datos.', 'El asistente consulta el catálogo disponible antes de responder sobre un producto. En esta demo, los productos, referencias y existencias son ficticios.'],
    memoria: ['02 / CONTEXTO', 'Cada consulta conserva su hilo.', 'El contexto permite relacionar una pregunta nueva con lo conversado antes, sin mezclar clientes. El panel de la demo separa cada conversación y su borrador.'],
    borrador: ['03 / BORRADOR', 'Lo conversado se convierte en algo revisable.', 'Los productos y cantidades quedan en un borrador separado de los faltantes. El equipo puede revisarlo; un borrador no equivale a un pedido confirmado.'],
    equipo: ['04 / EQUIPO', 'Las personas tienen el control.', 'El panel reúne conversaciones, clientes, productos y borradores. En una implementación se define cuándo debe intervenir una persona y qué decisiones requieren su revisión.']
  };
  const toggle = document.querySelector('#xrayToggle');
  toggle.addEventListener('click', () => {
    const active = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(active));
    toggle.querySelector('span').textContent = active ? 'ON' : 'OFF';
    document.querySelector('#xrayPoints').hidden = !active;
    document.querySelector('#xrayInfo').hidden = !active;
    document.querySelector('#xrayStage').classList.toggle('xray-active', active);
    if (active) pulse(document.querySelector('#xrayStage'));
  });
  document.querySelectorAll('[data-xray]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-xray]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const text = explanations[button.dataset.xray];
    ['#xrayNumber', '#xrayTitle', '#xrayText'].forEach((selector, index) => { document.querySelector(selector).textContent = text[index]; });
    pulse(document.querySelector('#xrayInfo'));
  }));
  const range = document.querySelector('#systemRange');
  range.addEventListener('input', () => {
    const value = Number(range.value);
    document.querySelector('#compareStage').style.setProperty('--reveal', value + '%');
    document.querySelector('#systemOutput').textContent = value + '%';
    range.setAttribute('aria-valuetext', value + ' por ciento del sistema organizado');
  });
})();
