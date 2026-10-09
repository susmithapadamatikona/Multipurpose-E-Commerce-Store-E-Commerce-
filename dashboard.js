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
 const read=(key,fallback)=>{try{return JSON.parse(sessionStorage.getItem(key))||fallback;}catch{return fallback;}};
 const write=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
 let user=read('stackly-dashboard-user',{identifier:''});
 let saved=read('stackly-dashboard-wishlist',[]);
 let address=read('stackly-dashboard-address',null);
 const products=[
  {id:'headphones',name:'Premium Wireless Headphones',category:'EVERYDAY TECH',price:'$119.00',image:'collection-assets/deal-headphones.jpg'},
  {id:'lamp',name:'Warm Globe Desk Lamp',category:'THOUGHTFUL HOME',price:'$49.00',image:'collection-assets/warm-globe-lamp.jpg'},
  {id:'keyboard',name:'Mechanical Wireless Keyboard',category:'WORKSPACE ESSENTIALS',price:'$77.50',image:'collection-assets/deal-keyboard.jpg'}
 ];
 const status=document.querySelector('#dashboard-status');
 const announce=text=>{status.textContent=text;};
 function updateUser(){
  const name=user.name||'Shopper';
  document.querySelector('#welcome-name').textContent=name;
  document.querySelector('#sidebar-name').textContent=user.name||'Stackly Shopper';
  document.querySelector('#sidebar-email').textContent=user.identifier||'Your personal shopping space';
  document.querySelector('.dashboard-avatar').textContent=name.charAt(0).toUpperCase();
  document.querySelector('#display-name').value=user.name||'';
  document.querySelector('#profile-identifier').value=user.identifier||'';
 }
 function productCard(product){
  const article=document.createElement('article');article.className='dashboard-product';
  const image=document.createElement('img');image.src=product.image;image.alt=product.name;image.loading='lazy';article.append(image);
  const content=document.createElement('div');
  const category=document.createElement('small');category.textContent=product.category;
  const heading=document.createElement('h3');heading.textContent=product.name;
  const price=document.createElement('strong');price.textContent=product.price;
  const actions=document.createElement('div');actions.className='dashboard-product-actions';
  const link=document.createElement('a');link.href='shop.html#catalog';link.textContent='View Product \u2192';
  const button=document.createElement('button');button.type='button';button.dataset.save=product.id;
  button.textContent=saved.includes(product.id)?'Remove':'Save';button.setAttribute('aria-pressed',String(saved.includes(product.id)));
  actions.append(link,button);content.append(category,heading,price,actions);article.append(content);return article;
 }
 function renderProducts(){
  document.querySelector('#recommendations').replaceChildren(...products.map(productCard));
  const favorites=products.filter(product=>saved.includes(product.id));
  const target=document.querySelector('#wishlist-products');target.replaceChildren(...favorites.map(productCard));
  if(!favorites.length){const empty=document.createElement('p');empty.textContent='No saved favorites yet. Save a product from your dashboard to start your wishlist.';target.append(empty);}
  document.querySelectorAll('.wishlist-count').forEach(count=>count.textContent=String(favorites.length));
 }
 function renderAddress(){
  document.querySelector('#address-count').textContent=address?'1':'0';
  const card=document.querySelector('#saved-address');card.hidden=!address;card.replaceChildren();
  if(address){
   for(const text of [address.name,address.street,`${address.city}, ${address.region} ${address.postal}`,address.country]){const row=document.createElement('div');row.textContent=text;card.append(row);}
   const remove=document.createElement('button');remove.type='button';remove.textContent='Remove address';
   remove.addEventListener('click',()=>{address=null;write('stackly-dashboard-address',null);renderAddress();announce('Address removed.');});card.append(remove);
   const form=document.querySelector('#address-form');for(const [key,value] of Object.entries(address)){if(form.elements.namedItem(key))form.elements.namedItem(key).value=value;}
  }
 }
 function showPanel(){
  const requested=location.hash.slice(1)||'overview';
  const current=['overview','orders','wishlist','addresses','profile','support'].includes(requested)?requested:'overview';
  document.querySelectorAll('.dashboard-panel').forEach(panel=>panel.hidden=panel.id!==current);
  document.querySelectorAll('.dashboard-nav-link').forEach(link=>{if(link.dataset.panel===current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  status.textContent='';
 }
 window.addEventListener('hashchange',showPanel);
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-save]');if(!button)return;
  const id=button.dataset.save;saved=saved.includes(id)?saved.filter(item=>item!==id):[...saved,id];
  write('stackly-dashboard-wishlist',saved);renderProducts();announce('Wishlist updated.');
 });
 document.querySelector('#profile-form').addEventListener('submit',event=>{
  event.preventDefault();if(!event.currentTarget.reportValidity())return;
  const data=new FormData(event.currentTarget);user={name:String(data.get('name')).trim(),identifier:String(data.get('identifier')).trim(),updates:data.has('updates')};
  const stored=write('stackly-dashboard-user',user);updateUser();announce(stored?'Profile saved for this session.':'Profile updated. Browser storage is unavailable.');
 });
 document.querySelector('#profile-form input[name=updates]').checked=Boolean(user.updates);
 document.querySelector('#address-form').addEventListener('submit',event=>{
  event.preventDefault();if(!event.currentTarget.reportValidity())return;
  address=Object.fromEntries(new FormData(event.currentTarget));const stored=write('stackly-dashboard-address',address);renderAddress();announce(stored?'Address saved for this session.':'Address updated. Browser storage is unavailable.');
 });
 document.querySelector('#sign-out').addEventListener('click',()=>{try{['stackly-dashboard-user','stackly-dashboard-address','stackly-dashboard-wishlist'].forEach(key=>sessionStorage.removeItem(key));}catch{}});
 updateUser();renderProducts();renderAddress();showPanel();
})();
