(() => {
 const header=document.querySelector('.topbar');
 const update=()=>{document.documentElement.style.setProperty('--site-scrollbar-width',(window.innerWidth-document.documentElement.clientWidth)+'px');if(header)document.documentElement.style.setProperty('--mobile-header-height',Math.ceil(header.getBoundingClientRect().bottom)+'px');};
 update();window.addEventListener('resize',update,{passive:true});
 window.addEventListener('scroll',update,{passive:true});
 if('ResizeObserver' in window&&header)new ResizeObserver(update).observe(header);
 window.addEventListener('load',update,{once:true});
})();
