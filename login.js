(() => {
  const menus = [...document.querySelectorAll('.nav-menu')].map(menu => ({
    menu,
    toggle: menu.querySelector('.shop-toggle, .collection-toggle'),
    panel: menu.querySelector('.shop-dropdown, .collection-dropdown')
  })).filter(item => item.toggle && item.panel);
  function close(item) {
    item.panel.hidden = true;
    item.toggle.setAttribute('aria-expanded', 'false');
  }
  menus.forEach(item => {
    item.toggle.setAttribute('aria-expanded', 'false');
    item.toggle.setAttribute('aria-controls', item.panel.id);
    item.toggle.addEventListener('click', event => {
      event.preventDefault();
      const open = item.panel.hidden;
      menus.forEach(close);
      item.panel.hidden = !open;
      item.toggle.setAttribute('aria-expanded', String(open));
    });
    item.panel.addEventListener('click', event => {
      if (event.target.closest('a')) close(item);
    });
  });
  document.addEventListener('click', event => {
    menus.forEach(item => { if (!item.menu.contains(event.target)) close(item); });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') menus.forEach(item => {
      if (!item.panel.hidden) { close(item); item.toggle.focus(); }
    });
  });
})();


(() => {
  const form = document.querySelector('#login-form');
  const password = document.querySelector('#login-password');
  const passwordField = document.querySelector('#password-field');
  const status = document.querySelector('#login-status');
  const submitLabel = document.querySelector('.login-submit span');
  let mode = 'signin';
  const announce = message => { status.hidden = false; status.textContent = message; };
  document.querySelector('.password-toggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    button.setAttribute('aria-pressed', String(show));
  });
  function setMode(next) {
    mode = next;
    status.hidden = true;
    passwordField.hidden = next === 'otp' || next === 'reset';
    password.required = !passwordField.hidden;
    password.autocomplete = next === 'register' ? 'new-password' : 'current-password';
    document.querySelector('#login-title').textContent = {
      signin: 'Sign in to Stackly', otp: 'Sign in with a passcode',
      reset: 'Reset your password', register: 'Create your OmniCart account'
    }[next];
    submitLabel.textContent = { signin: 'Sign In', otp: 'Send Passcode', reset: 'Send Reset Link', register: 'Create Account' }[next];
    document.querySelector('#login-identifier').focus();
    document.querySelector('#login-otp span').textContent = next === 'signin' ? 'Sign in with One-Time Passcode' : 'Back to password sign in';
  }
  document.querySelector('#forgot-password').addEventListener('click', () => setMode('reset'));
  document.querySelector('#login-otp').addEventListener('click', () => setMode(mode === 'signin' ? 'otp' : 'signin'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (mode !== 'signin') {
      announce('Password recovery and verification codes require a connected account service.');
      return;
    }
    const identifier = document.querySelector('#login-identifier').value.trim();
    try { sessionStorage.setItem('stackly-dashboard-user', JSON.stringify({ identifier })); } catch {}
    window.location.assign('dashboard.html');
  });
  document.querySelectorAll('[data-provider]').forEach(button => {
    button.addEventListener('click', () => announce(`${button.dataset.provider} sign-in is not connected yet.`));
  });
})();
