const toastBox=document.querySelector('.toast');let toastTimeout;
function showToast(message){toastBox.textContent=message;toastBox.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toastBox.classList.remove('show'),1800)}
document.addEventListener('click',event=>{const add=event.target.closest('.arrival-add');if(add){add.textContent='✓ Added';showToast('Added to your bag');return}const favorite=event.target.closest('.drop-image .favorite');if(favorite){favorite.textContent=favorite.textContent==='♡'?'♥':'♡';showToast(favorite.textContent==='♥'?'Saved to favorites':'Removed from favorites')}});
const shopToggle=document.querySelector('.shop-toggle'),shopDropdown=document.querySelector('#shop-dropdown');
shopToggle?.addEventListener('click',()=>{const open=shopToggle.getAttribute('aria-expanded')!=='true';shopToggle.setAttribute('aria-expanded',String(open));shopDropdown.hidden=!open});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-menu')&&shopToggle){shopToggle.setAttribute('aria-expanded','false');shopDropdown.hidden=true}});
document.querySelector('.arrival-newsletter form')?.addEventListener('submit',event=>{event.preventDefault();showToast('Your $15 drop credit is on its way!');event.target.reset()});
