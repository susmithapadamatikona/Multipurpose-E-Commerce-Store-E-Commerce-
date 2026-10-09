(() => {
  document.querySelectorAll('#best-discounts .discount-add').forEach(button => {
    button.addEventListener('click', () => {
      const badge = document.querySelector('.cart-icon i');
      const count = (Number(badge?.textContent) || 0) + 1;
      if (badge) badge.textContent = String(count);
      const cartLabel = document.querySelector('.cart > b');
      if (cartLabel) cartLabel.textContent = `Cart (${count})`;
      const name = button.closest('article').querySelector('b').textContent;
      document.querySelector('#discount-cart-status').textContent = `${name} added to cart.`;
      button.textContent = 'Added to Cart';
      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => { button.textContent = 'Add to Cart'; }, 1500);
    });
  });
})();
