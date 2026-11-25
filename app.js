/* ============================================================
   SHOESHUB — app.js
   Features: Products, Filters, Sort, Cart, Currency Switcher,
             Checkout Modal, Toasts, Scroll-top, Counters
   ============================================================ */

'use strict';

// ================================================================
// 1. CURRENCY CONFIG
// ================================================================
const CURRENCIES = {
  MXN: { symbol: '$',    code: 'MXN', label: 'MXN 🇲🇽', rate: 1,       decimals: 0 },
  PEN: { symbol: 'S/',   code: 'PEN', label: 'SOL 🇵🇪', rate: 0.19,    decimals: 2 },
  USD: { symbol: '$',    code: 'USD', label: 'USD 🇺🇸', rate: 0.0497,  decimals: 2 },
};

// Free-shipping threshold in MXN
const FREE_SHIP_MXN = 999;

let activeCurrency = 'MXN';

function convertPrice(mxn) {
  const c = CURRENCIES[activeCurrency];
  return mxn * c.rate;
}

function formatPrice(mxn) {
  const c   = CURRENCIES[activeCurrency];
  const val = convertPrice(mxn);
  return `${c.symbol}${val.toLocaleString('es-MX', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals })} ${c.code}`;
}

function formatThreshold() {
  return formatPrice(FREE_SHIP_MXN);
}

// ================================================================
// 2. PRODUCTS DATA  (25 products, prices in MXN)
// ================================================================
const PRODUCTS = [
  /* ---- RUNNING (7) ---- */
  { id:1,  name:'CloudRunner Pro',   cat:'running', desc:'Amortiguación máxima para largas distancias.',          price:1899, oldPrice:2399, stars:4.8, reviews:312, emoji:'👟', bg:'#dbeafe', badge:'top'     },
  { id:2,  name:'SpeedForce X3',     cat:'running', desc:'Ligera y reactiva para competencia.',                   price:2499, oldPrice:null, stars:4.9, reviews:189, emoji:'👟', bg:'#ede9fe', badge:'new'     },
  { id:3,  name:'TrailBlaze 500',    cat:'running', desc:'Grip extremo para terrenos mixtos.',                    price:1699, oldPrice:2100, stars:4.6, reviews:97,  emoji:'🥾', bg:'#dcfce7', badge:'sale'    },
  { id:4,  name:'AeroStrike V2',     cat:'running', desc:'Placa de carbono para runners avanzados.',              price:3299, oldPrice:null, stars:5.0, reviews:65,  emoji:'👟', bg:'#fef3c7', badge:'limited' },
  { id:5,  name:'FlexPace Lite',     cat:'running', desc:'Ultra-flexible para entrenamientos diarios.',           price:1199, oldPrice:1499, stars:4.4, reviews:231, emoji:'👟', bg:'#fce7f3', badge:'sale'    },
  { id:6,  name:'PulseRun 200',      cat:'running', desc:'Control de pronación y suela duradera.',                price:1499, oldPrice:null, stars:4.5, reviews:144, emoji:'👟', bg:'#e0f2fe', badge:'new'     },
  { id:7,  name:'ZeroG Marathon',    cat:'running', desc:'Diseño minimalista de alto rendimiento.',               price:2799, oldPrice:3400, stars:4.7, reviews:78,  emoji:'👟', bg:'#f0fdf4', badge:'top'     },

  /* ---- CASUAL (7) ---- */
  { id:8,  name:'UrbanStep Classic', cat:'casual',  desc:'Cuero sintético premium para el día a día.',            price:1399, oldPrice:null, stars:4.6, reviews:267, emoji:'👟', bg:'#f1f5f9', badge:'top'     },
  { id:9,  name:'DriftCanvas Low',   cat:'casual',  desc:'Lona reforzada con suela cupsole.',                    price:899,  oldPrice:1199, stars:4.3, reviews:412, emoji:'👟', bg:'#fef9c3', badge:'sale'    },
  { id:10, name:'NeoChunk 90',       cat:'casual',  desc:'Chunky sole con estética retro vibrante.',              price:1699, oldPrice:null, stars:4.8, reviews:198, emoji:'👟', bg:'#fce7f3', badge:'new'     },
  { id:11, name:'SlipOn Zen',        cat:'casual',  desc:'Sin agujetas, cómodo para toda ocasión.',              price:749,  oldPrice:999,  stars:4.4, reviews:321, emoji:'🥿', bg:'#ecfdf5', badge:'sale'    },
  { id:12, name:'CoastalBreeze',     cat:'casual',  desc:'Ligera y transpirable para climas cálidos.',           price:1049, oldPrice:null, stars:4.5, reviews:155, emoji:'👟', bg:'#e0f2fe', badge:null      },
  { id:13, name:'StreetPunk High',   cat:'casual',  desc:'Bota alta con correas ajustables y look urbano.',      price:1899, oldPrice:2300, stars:4.7, reviews:88,  emoji:'👟', bg:'#ede9fe', badge:'top'     },
  { id:14, name:'Mellow Slide',      cat:'casual',  desc:'Sandalia casual perfecta para el hogar y la playa.',   price:549,  oldPrice:699,  stars:4.2, reviews:503, emoji:'🩴', bg:'#fef3c7', badge:'sale'    },

  /* ---- FORMAL (5) ---- */
  { id:15, name:'Oxford Royal',      cat:'formal',  desc:'Cuero genuino italiano, corte clásico.',               price:3499, oldPrice:null, stars:4.9, reviews:74,  emoji:'👞', bg:'#f8f7f4', badge:'top'     },
  { id:16, name:'Derby Elegance',    cat:'formal',  desc:'Brogue detail con suela de goma antideslizante.',      price:2799, oldPrice:3299, stars:4.7, reviews:112, emoji:'👞', bg:'#fef9c3', badge:'sale'    },
  { id:17, name:'Monk Strap Pro',    cat:'formal',  desc:'Dos hebillas premium, acabado oscuro brillante.',      price:3199, oldPrice:null, stars:4.8, reviews:59,  emoji:'👞', bg:'#f1f5f9', badge:'new'     },
  { id:18, name:'Chelsea Velvet',    cat:'formal',  desc:'Bota Chelsea en terciopelo para eventos nocturnos.',   price:2499, oldPrice:2999, stars:4.6, reviews:91,  emoji:'👟', bg:'#ede9fe', badge:'sale'    },
  { id:19, name:'LoaferPlus Slim',   cat:'formal',  desc:'Mocasín minimalista, perfecto para la oficina.',      price:1999, oldPrice:null, stars:4.5, reviews:138, emoji:'🥿', bg:'#ecfdf5', badge:null      },

  /* ---- OUTDOOR (6) ---- */
  { id:20, name:'PeakHiker GTX',     cat:'outdoor', desc:'Gore-Tex e impermeabilidad total para senderismo.',    price:3799, oldPrice:4499, stars:4.9, reviews:148, emoji:'🥾', bg:'#dcfce7', badge:'top'     },
  { id:21, name:'RockCrusher V4',    cat:'outdoor', desc:'Puntera reforzada y suela Vibram de alta tracción.',   price:2999, oldPrice:null, stars:4.8, reviews:102, emoji:'🥾', bg:'#fef3c7', badge:'new'     },
  { id:22, name:'DirtMaster Low',    cat:'outdoor', desc:'Versátil entre sendero y ciudad. Peso ultra ligero.', price:2199, oldPrice:2699, stars:4.6, reviews:77,  emoji:'🥾', bg:'#e0f2fe', badge:'sale'    },
  { id:23, name:'SnowPeak 3000',     cat:'outdoor', desc:'Bota de invierno con aislamiento térmico integrado.',  price:4299, oldPrice:null, stars:5.0, reviews:43,  emoji:'🥾', bg:'#dbeafe', badge:'limited' },
  { id:24, name:'JungleWalker Pro',  cat:'outdoor', desc:'Anti-reptiles, resistente a la humedad y al barro.',   price:3199, oldPrice:3800, stars:4.7, reviews:61,  emoji:'🥾', bg:'#f0fdf4', badge:'top'     },
  { id:25, name:'SandDune Runner',   cat:'outdoor', desc:'Diseñada para arena y terrenos arenosos extremos.',   price:2499, oldPrice:null, stars:4.5, reviews:85,  emoji:'👟', bg:'#fef9c3', badge:'new'     },
];

const SIZES = ['36','37','38','39','40','41','42','43','44','45'];

// ================================================================
// 3. STATE
// ================================================================
let cart         = JSON.parse(localStorage.getItem('sh_cart')  || '[]');
let activeFilter = 'all';
let activeSort   = 'default';
let wishlist     = JSON.parse(localStorage.getItem('sh_wish')  || '[]');

// ================================================================
// 4. DOM REFS (populated after DOMContentLoaded)
// ================================================================
let $grid, $noResults, $cartBadge, $cartBody, $cartFoot,
    $cartEmpty, $cartDrawer, $cartBackdrop, $cartSubtotal,
    $cartShipping, $cartTotal, $footerCurrency, $freeShipThreshold,
    $checkoutModal, $modalSummary, $orderCode, $stepForm, $stepSuccess;

// ================================================================
// 5. INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  renderProducts();
  updateCategoryCounts();
  initCurrencySwitchers();
  initCartDrawer();
  initFilters();
  initSort();
  initNavbar();
  initScrollTop();
  initContactForm();
  initCheckout();
  renderCartDrawer();
  updateBadge();
  updateFreeShipLabel();
});

function cacheDom() {
  $grid            = document.getElementById('productsGrid');
  $noResults       = document.getElementById('noResults');
  $cartBadge       = document.getElementById('cartBadge');
  $cartBody        = document.getElementById('cartBody');
  $cartFoot        = document.getElementById('cartFoot');
  $cartEmpty       = document.getElementById('cartEmpty');
  $cartDrawer      = document.getElementById('cartDrawer');
  $cartBackdrop    = document.getElementById('cartBackdrop');
  $cartSubtotal    = document.getElementById('cartSubtotal');
  $cartShipping    = document.getElementById('cartShipping');
  $cartTotal       = document.getElementById('cartTotal');
  $footerCurrency  = document.getElementById('footerCurrency');
  $freeShipThreshold = document.getElementById('freeShipThreshold');
  $checkoutModal   = document.getElementById('checkoutModal');
  $modalSummary    = document.getElementById('modalSummary');
  $orderCode       = document.getElementById('orderCode');
  $stepForm        = document.getElementById('stepForm');
  $stepSuccess     = document.getElementById('stepSuccess');
}

// ================================================================
// 6. RENDER PRODUCTS
// ================================================================
function renderProducts() {
  let list = [...PRODUCTS];

  // Filter
  if (activeFilter !== 'all') list = list.filter(p => p.cat === activeFilter);

  // Sort
  if (activeSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (activeSort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (activeSort === 'rating')     list.sort((a,b) => b.stars - a.stars);

  if (list.length === 0) {
    $grid.innerHTML = '';
    $noResults.style.display = 'block';
    return;
  }
  $noResults.style.display = 'none';

  $grid.innerHTML = list.map(p => productCard(p)).join('');

  // Bind events
  $grid.querySelectorAll('.btn-addcart').forEach(btn => {
    btn.addEventListener('click', e => {
      const id   = Number(btn.dataset.id);
      const card = btn.closest('.product-card');
      const sel  = card.querySelector('.size-btn.selected');
      const size = sel ? sel.dataset.size : null;
      if (!size) { showToast('Por favor selecciona una talla 👟', 'error'); return; }
      addToCart(id, size);
    });
  });

  $grid.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.sizes');
      wrap.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  $grid.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleWish(Number(btn.dataset.id), btn));
    // Restore state
    if (wishlist.includes(Number(btn.dataset.id))) {
      btn.classList.add('on');
      btn.textContent = '♥';
    }
  });
}

function productCard(p) {
  const badgeHTML = p.badge
    ? `<span class="prod-badge badge-${p.badge}">${badgeLabel(p.badge)}</span>` : '';
  const oldHTML = p.oldPrice
    ? `<span class="prod-old-price">${formatPrice(p.oldPrice)}</span>` : '';
  const sizesHTML = SIZES.map(s =>
    `<button class="size-btn" data-size="${s}">${s}</button>`).join('');

  return `
  <div class="product-card" data-id="${p.id}" data-cat="${p.cat}">
    <div class="product-thumb" style="background:${p.bg}">
      ${badgeHTML}
      <button class="wish-btn" data-id="${p.id}" title="Favorito">♡</button>
      <span class="product-thumb-emoji">${p.emoji}</span>
    </div>
    <div class="product-info">
      <div class="prod-category">${catLabel(p.cat)}</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-desc">${p.desc}</div>
      <div class="prod-rating">
        <span class="stars">${starsHTML(p.stars)}</span>
        <span class="rating-num">${p.stars} (${p.reviews})</span>
      </div>
      <div class="size-row">
        <span class="size-label">Talla (EU)</span>
        <div class="sizes">${sizesHTML}</div>
      </div>
      <div class="prod-footer">
        <div class="prod-pricing">
          <span class="prod-price">${formatPrice(p.price)}</span>
          ${oldHTML}
        </div>
        <button class="btn-addcart" data-id="${p.id}">+ Carrito</button>
      </div>
    </div>
  </div>`;
}

function badgeLabel(b) {
  return { new:'Nuevo', sale:'Oferta', top:'Top', limited:'Limitado' }[b] || b;
}
function catLabel(c) {
  return { running:'Running', casual:'Casual', formal:'Formal', outdoor:'Outdoor' }[c] || c;
}
function starsHTML(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(full) + half;
}

// ================================================================
// 7. CATEGORY COUNTS
// ================================================================
function updateCategoryCounts() {
  ['running','casual','formal','outdoor'].forEach(cat => {
    const el = document.getElementById(`cnt-${cat}`);
    if (el) el.textContent = PRODUCTS.filter(p => p.cat === cat).length + ' modelos';
  });
}

// ================================================================
// 8. FILTERS & SORT
// ================================================================
function initFilters() {
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  // Category cards also act as filters
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const f = card.dataset.filter;
      document.querySelectorAll('.filter').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === f);
      });
      activeFilter = f;
      renderProducts();
      document.getElementById('tienda').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initSort() {
  document.getElementById('sortSelect').addEventListener('change', e => {
    activeSort = e.target.value;
    renderProducts();
  });
}

// ================================================================
// 9. CURRENCY SWITCHER
// ================================================================
function initCurrencySwitchers() {
  // All currency buttons (navbar + cart)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-currency]');
    if (!btn) return;

    activeCurrency = btn.dataset.currency;

    // Update all currency buttons
    document.querySelectorAll('[data-currency]').forEach(b => {
      b.classList.toggle('active', b.dataset.currency === activeCurrency);
    });

    // Refresh UI
    renderProducts();
    renderCartDrawer();
    updateFreeShipLabel();
    if ($footerCurrency) $footerCurrency.textContent = CURRENCIES[activeCurrency].label;
  });
}

function updateFreeShipLabel() {
  if ($freeShipThreshold) $freeShipThreshold.textContent = formatThreshold();
}

// ================================================================
// 10. WISHLIST
// ================================================================
function toggleWish(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
    btn.classList.remove('on');
    btn.textContent = '♡';
    showToast('Eliminado de favoritos');
  } else {
    wishlist.push(id);
    btn.classList.add('on');
    btn.textContent = '♥';
    showToast('❤️ Guardado en favoritos');
  }
  localStorage.setItem('sh_wish', JSON.stringify(wishlist));
}

// ================================================================
// 11. CART — DATA
// ================================================================
function addToCart(id, size) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const key      = `${id}_${size}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
    showToast(`+1 ${product.name} (talla ${size})`);
  } else {
    cart.push({ key, id, size, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
    showToast(`✅ ${product.name} agregado al carrito`);
  }

  saveCart();
  updateBadge();
  renderCartDrawer();
  openCartDrawer();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  updateBadge();
  renderCartDrawer();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateBadge();
  renderCartDrawer();
  showToast('Producto eliminado del carrito');
}

function saveCart() {
  localStorage.setItem('sh_cart', JSON.stringify(cart));
}

function resetCart() {
  cart = [];
  saveCart();
  updateBadge();
  renderCartDrawer();
}

function cartSubtotalMXN() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function shippingMXN() {
  return cartSubtotalMXN() >= FREE_SHIP_MXN ? 0 : 99;
}

// ================================================================
// 12. CART — RENDER
// ================================================================
function updateBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  $cartBadge.textContent = count;
  $cartBadge.classList.add('bump');
  setTimeout(() => $cartBadge.classList.remove('bump'), 300);
}

function renderCartDrawer() {
  if (cart.length === 0) {
    $cartEmpty.style.display  = 'flex';
    $cartFoot.style.display   = 'none';
    // Clear items but keep empty placeholder
    $cartBody.querySelectorAll('.cart-item').forEach(el => el.remove());
    return;
  }

  $cartEmpty.style.display = 'none';
  $cartFoot.style.display  = 'flex';
  $cartFoot.style.flexDirection = 'column';
  $cartFoot.style.gap = '12px';

  // Rebuild items
  $cartBody.querySelectorAll('.cart-item').forEach(el => el.remove());

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className   = 'cart-item';
    div.dataset.key = item.key;
    div.innerHTML   = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Talla EU ${item.size}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <div class="qty-controls" style="margin-top:8px">
          <button class="qty-btn qty-dec" data-key="${item.key}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn qty-inc" data-key="${item.key}">+</button>
        </div>
      </div>
      <button class="del-btn" data-key="${item.key}" title="Eliminar">🗑</button>`;
    $cartBody.insertBefore(div, $cartEmpty);
  });

  // Bind qty & delete
  $cartBody.querySelectorAll('.qty-inc').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.key,  1)));
  $cartBody.querySelectorAll('.qty-dec').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.key, -1)));
  $cartBody.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.key)));

  // Totals
  const sub  = cartSubtotalMXN();
  const ship = shippingMXN();
  $cartSubtotal.textContent = formatPrice(sub);
  $cartShipping.textContent = ship === 0 ? '🎉 Gratis' : formatPrice(ship);
  $cartTotal.textContent    = formatPrice(sub + ship);
}

// ================================================================
// 13. CART DRAWER UI
// ================================================================
function initCartDrawer() {
  document.getElementById('cartTrigger').addEventListener('click', openCartDrawer);
  document.getElementById('closeCart').addEventListener('click', closeCart);
  $cartBackdrop.addEventListener('click', closeCart);

  document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito?')) { resetCart(); showToast('Carrito vaciado'); }
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    closeCart();
    openCheckout();
  });
}

function openCartDrawer() {
  $cartDrawer.classList.add('open');
  $cartBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $cartDrawer.classList.remove('open');
  $cartBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ================================================================
// 14. CHECKOUT MODAL
// ================================================================
function initCheckout() {
  document.getElementById('closeModal').addEventListener('click', closeModal);
  $checkoutModal.addEventListener('click', e => { if (e.target === $checkoutModal) closeModal(); });

  document.getElementById('checkoutForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;
    confirmOrder();
  });
}

function openCheckout() {
  if (cart.length === 0) { showToast('Tu carrito está vacío', 'error'); return; }
  $stepForm.style.display    = 'block';
  $stepSuccess.style.display = 'none';
  buildModalSummary();
  $checkoutModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $checkoutModal.style.display = 'none';
  document.body.style.overflow = '';
}

function buildModalSummary() {
  const sub  = cartSubtotalMXN();
  const ship = shippingMXN();
  const rows = cart.map(i =>
    `<div class="msum-row"><span>${i.name} ×${i.qty} (EU ${i.size})</span><span>${formatPrice(i.price * i.qty)}</span></div>`).join('');

  $modalSummary.innerHTML = `
    <h4>Resumen del pedido</h4>
    ${rows}
    <div class="msum-row"><span>Envío</span><span>${ship === 0 ? '🎉 Gratis' : formatPrice(ship)}</span></div>
    <div class="msum-row msum-total"><span>Total</span><strong>${formatPrice(sub + ship)}</strong></div>`;
}

function validateCheckoutForm() {
  const fields = ['oNombre','oTel','oDireccion','oCP','oEmail'];
  for (const id of fields) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      showToast('Por favor completa todos los campos', 'error');
      return false;
    }
  }
  return true;
}

function confirmOrder() {
  const code = 'SH-' + Date.now().toString(36).toUpperCase();
  $orderCode.textContent = code;
  $stepForm.style.display    = 'none';
  $stepSuccess.style.display = 'block';
  showToast('🎉 ¡Pedido confirmado!', 'success');
}

// resetCart is called by the success button in HTML
window.resetCart = resetCart;
window.closeModal = closeModal;

// ================================================================
// 15. NAVBAR
// ================================================================
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('raised', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ================================================================
// 16. SCROLL TOP
// ================================================================
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('vis', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================================
// 17. CONTACT FORM
// ================================================================
function initContactForm() {
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const ok = document.getElementById('formOk');
    ok.style.display = 'block';
    e.target.reset();
    showToast('🚀 Mensaje enviado con éxito', 'success');
    setTimeout(() => { ok.style.display = 'none'; }, 5000);
  });
}

// ================================================================
// 18. TOAST
// ================================================================
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = `toast${type ? ' ' + type : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ================================================================
// 19. REFRESH PRICES when currency changes (re-render)
// ================================================================
// Already handled via renderProducts() in currency switcher
