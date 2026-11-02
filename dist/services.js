(() => {
  const dialog = document.querySelector('#demoImageDialog');
  document.querySelector('#demoZoom').addEventListener('click', () => dialog.showModal());
  document.querySelector('#demoImageClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
})();
