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

// Share a curator profile from the team cards.
document.querySelectorAll('.team-share').forEach(button => {
  button.addEventListener('click', async () => {
    const name = button.dataset.name;
    const url = new URL(window.location.href);
    url.hash = button.closest('.team-card').id;
    const status = document.querySelector('#team-share-status');
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} | OmniCart Team`, url: url.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.href);
        status.textContent = `${name} profile link copied.`;
      } else {
        status.textContent = `Profile link: ${url.href}`;
      }
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'Unable to share this profile. Please try again.';
    }
  });
});
