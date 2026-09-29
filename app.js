
const products = window.NBCOM_PRODUCTS || [];
const grid = document.getElementById('productGrid');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const resultCount = document.getElementById('resultCount');
let activeFilter = 'All';
let cart = JSON.parse(localStorage.getItem('nbcom-eu-cart') || '[]');

function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v)}
function card(p){return `<article class="product-card">
  <div class="product-media"><img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallback}'" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="quick-add" onclick="addToCart(${p.id})" aria-label="Add ${p.name} to bag">+</button></div>
  <div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><strong>${money(p.price)}</strong><button onclick="addToCart(${p.id})">ADD TO BAG</button></div></div>
</article>`}
function render(){let list=[...products]; const q=searchInput.value.trim().toLowerCase(); if(activeFilter!=='All') list=list.filter(p=>p.category===activeFilter); if(q) list=list.filter(p=>(p.name+' '+p.category+' '+p.tag+' '+p.desc).toLowerCase().includes(q)); if(sortSelect.value==='low') list.sort((a,b)=>a.price-b.price); if(sortSelect.value==='high') list.sort((a,b)=>b.price-a.price); if(sortSelect.value==='az') list.sort((a,b)=>a.name.localeCompare(b.name)); grid.innerHTML=list.map(card).join(''); resultCount.textContent=`${list.length} product${list.length===1?'':'s'}`;}
filters.addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(!b)return;activeFilter=b.dataset.filter;[...filters.children].forEach(x=>x.classList.toggle('active',x===b));render();});
searchInput.addEventListener('input',render);sortSelect.addEventListener('change',render);
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>setFilter(a.dataset.filterLink)));
document.querySelectorAll('.category-card').forEach(a=>a.addEventListener('click',()=>{setFilter(a.dataset.cat);document.getElementById('shop').scrollIntoView({behavior:'smooth'});}));
function setFilter(cat){activeFilter=cat;[...filters.children].forEach(x=>x.classList.toggle('active',x.dataset.filter===cat));render();}
document.getElementById('searchFocus').onclick=()=>{document.getElementById('shop').scrollIntoView({behavior:'smooth'});setTimeout(()=>searchInput.focus(),450)};

const drawer=document.getElementById('cartDrawer'), scrim=document.getElementById('scrim');
function openCart(){drawer.classList.add('open');scrim.classList.add('show');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');scrim.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('cartOpen').onclick=openCart;document.getElementById('cartClose').onclick=closeCart;scrim.onclick=closeCart;
function toast(msg='Added to your bag'){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1400)}
window.addToCart=function(id){const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart();toast();}
window.removeCart=function(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function saveCart(){localStorage.setItem('nbcom-eu-cart',JSON.stringify(cart));renderCart();}
function renderCart(){const count=cart.reduce((a,x)=>a+x.qty,0);document.getElementById('cartCount').textContent=count;const items=document.getElementById('cartItems');const empty=document.getElementById('cartEmpty');let total=0;if(!cart.length){items.innerHTML='';empty.style.display='block';}else{empty.style.display='none';items.innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);total+=p.price*x.qty;return `<div class="cart-item"><img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallback}'"><div><h5>${p.name}</h5><small>${x.qty} × ${money(p.price)}</small></div><button onclick="removeCart(${p.id})">×</button></div>`}).join('');}document.getElementById('cartTotal').textContent=money(total)}
document.getElementById('newsletter').addEventListener('submit',e=>{e.preventDefault();e.currentTarget.reset();toast('Welcome to the performance club');});
render();renderCart();
