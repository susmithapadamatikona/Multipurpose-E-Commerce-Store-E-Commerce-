(() => {
 'use strict';
 const surfaces = [
  'main article','main .product-card','main .category','main .department','main .brand',
  'main .collection-card','main .topic-card','main .info-card','main .style-card',
  '.hero','.offer-hero','.shop-hero','.journal-hero','.help-hero','.signup-card','.login-card','.login-create',
  '.dashboard-sidebar','.dashboard-box','.dashboard-stats>a','.dashboard-promo','.dashboard-product',
  '.coupon-strip','.coupon-code','.member-banner','.season-sale','.offer-final','.newsletter-inner',
  '.about-card','.value-card','.team-card','.about-review','.sustainability','.philosophy-list article',
  '.featured-story','.guide-card','.collection-hero','.collection-spotlight','.bundle-card',
  '.filters','.catalog-product','.help-search','.faq-panel','.returns-panel','.help-contact',
  '.community-grid>img','.community-photo','.about-hero-photo'
 ].join(',');
 const actions = [
  'main button','main .btn','main .about-button','main .offer-btn','main .dashboard-primary',
  '.login-create>a','.signup-signin>a','.season-sale a','.offer-final a','.button-primary',
  '.topbar .delivery','.topbar .cart','.topbar .search-submit','.footer-socials a'
 ].join(',');
 const recessed = '.login-input,.help-search,.search-wrap,.dashboard-form input:not([type=checkbox]),.newsletter input,.price-filter input';
 const reveals = [
  'main article','main .section-head','main .offer-section-head','main .about-heading',
  'main .help-heading','main .dashboard-section-head','main .community-header',
  'main .category','main .department','main .brand','main .topic-card','main .info-card',
  '.hero','.offer-hero','.shop-hero','.journal-hero','.help-hero','.login-card','.login-create','.signup-card',
  '.dashboard-stats>a','.dashboard-promo','.season-sale','.offer-final','.newsletter-inner',
  '.value-card','.team-card','.about-review','.community-grid>img','.community-photo'
 ].join(',');
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 let initialized = false;
 function shade(element) {
  const color = getComputedStyle(element).backgroundColor;
  const values = color.match(/[\d.]+/g);
  if (!values || values.length < 3 || (values.length > 3 && Number(values[3]) < .15)) return;
  const [r,g,b] = values.map(Number);
  if (.2126*r+.7152*g+.0722*b < 90) element.classList.add('neo-dark');
  else if (Math.max(r,g,b)-Math.min(r,g,b)>65) element.classList.add('neo-colored');
 }
 function decorate() {
  document.querySelectorAll(surfaces).forEach(element => {
   if (element.classList.contains('neo-surface')) return;
   element.classList.add('neo-surface');shade(element);
  });
  document.querySelectorAll(actions).forEach(element => {
   if (element.matches('.password-toggle,.shop-toggle,.team-share,.favorite,.login-text-button,.help-close') || element.classList.contains('neo-action')) return;
   element.classList.add('neo-action');shade(element);
  });
  document.querySelectorAll(recessed).forEach(element=>element.classList.add('neo-recessed'));
  if (reduced.matches || !window.AOS) return;
  document.querySelectorAll(reveals).forEach(element => {
   // Keep the fixed sidebar, its ancestors and form fields free of animation transforms.
   if (element.closest('.dashboard-sidebar') || element.querySelector('.dashboard-sidebar') || element.hasAttribute('data-aos') || element.closest('[data-aos]')) return;
   element.dataset.aos = 'fade-up';
   const siblings = Array.from(element.parentElement.children);
   if (siblings.length > 1 && (element.tagName === 'ARTICLE' || element.matches('.category,.department,.brand,.value-card,.team-card,.dashboard-stats>a,.community-grid>img'))) {
    element.dataset.aosDelay = String((siblings.indexOf(element) % 4) * 50);
   }
  });
 }
 function revealCurrent() {
  if (!initialized || reduced.matches) return;
  requestAnimationFrame(()=>{
   AOS.refreshHard();
   // Newly opened account panels are visible immediately, even when they were hidden at initialization.
   document.querySelectorAll('.dashboard-panel:not([hidden]) [data-aos]').forEach(element => {
    const rect=element.getBoundingClientRect();
    if(rect.top<window.innerHeight && rect.bottom>0) element.classList.add('aos-animate');
   });
  });
 }
 function start() {
  decorate();
  if (window.AOS && !reduced.matches) {
   try {
    AOS.init({duration:600,easing:'ease-out-cubic',once:true,offset:40,disableMutationObserver:true});
    initialized=true;document.documentElement.classList.add('aos-ready');
    requestAnimationFrame(()=>AOS.refreshHard());
   } catch { document.documentElement.classList.remove('aos-ready'); }
  }
  let scheduled=false;
  new MutationObserver(records=>{
   if (!records.some(record=>record.addedNodes.length) || scheduled) return;
   scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorate();revealCurrent();});
  }).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',revealCurrent);
  window.addEventListener('load',revealCurrent);
  document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>{if(initialized)AOS.refresh();},{once:true}));
  reduced.addEventListener('change',()=>{
   if(reduced.matches)document.documentElement.classList.remove('aos-ready');
   else if(initialized){document.documentElement.classList.add('aos-ready');revealCurrent();}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
