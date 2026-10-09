document.querySelector('#error-go-back').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
  else window.location.assign('index.html');
});
