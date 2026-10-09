(() => {
 const rules = {"shop.html": ["shop all", "explore collections", "check tradein value", "shop clearance outlet", "start shopping"], "index.html": ["start 30day free trial", "apply in 2 minutes", "view bundle", "read full story", "claim $15 voucher"], "arrivals.html": ["shop just dropped", "explore lookbook", "explore collection", "get staff pick", "acquire drop", "buy the bundle & save 15%", "claim $15 credit"], "collections.html": ["explore collections", "view autumn lookbook", "shop midcentury modern", "view guide", "explore collection", "browse", "add all 5 items to cart", "view line", "start the lifestyle quiz", "explore all collections"], "offers.html": ["shop todays deals", "view all offers", "explore all offers", "claim $20 code mega20"]};
 const normalize = value => value.toLowerCase().replace(/[^a-z0-9$%& ]/g, '').trim();
 const page = location.pathname.split('/').pop() || 'index.html';
 const shouldRedirect = element => {
  if(element.hasAttribute('data-error-route')) return true;
  if(!element.closest('main')) return false;
  const text=normalize(element.textContent.replace(/\s+/g,' '));
  return text==='add to cart' || (rules[page]||[]).includes(text);
 };
 document.addEventListener('click',event=>{
  const control=event.target.closest('a,button');
  if(!control || !shouldRedirect(control))return;
  event.preventDefault();event.stopImmediatePropagation();
  location.assign('404.html');
 },true);
 document.addEventListener('submit',event=>{
  if(!event.target.matches('form[data-error-route]'))return;
  event.preventDefault();event.stopImmediatePropagation();location.assign('404.html');
 },true);
})();
