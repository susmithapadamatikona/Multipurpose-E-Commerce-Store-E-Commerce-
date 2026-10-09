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
 const form = document.querySelector('#signup-form');
 const password = document.querySelector('#signup-password');
 const confirm = document.querySelector('#confirm-password');
 const status = document.querySelector('#signup-status');
 const showStatus = text => {status.hidden=false;status.textContent=text;};
 document.querySelector('.password-toggle').addEventListener('click', event => {
  const show=password.type==='password';password.type=show?'text':'password';
  event.currentTarget.setAttribute('aria-label',show?'Hide password':'Show password');
  event.currentTarget.setAttribute('aria-pressed',String(show));
 });
 function validateMatch(){confirm.setCustomValidity(confirm.value&&confirm.value!==password.value?'Passwords must match.':'');}
 password.addEventListener('input',validateMatch);confirm.addEventListener('input',validateMatch);
 form.addEventListener('submit',event=>{
  event.preventDefault();validateMatch();if(!form.reportValidity())return;
  showStatus('Registration is not connected yet. Account creation and verification codes require an authentication service.');
 });
 document.querySelectorAll('[data-provider]').forEach(button=>button.addEventListener('click',()=>showStatus(`${button.dataset.provider} registration is not connected yet.`)));
})();
