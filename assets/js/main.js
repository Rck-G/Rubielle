import { products } from './products.js';
import { store } from './store.js';
import { showToast } from './toast.js';

const PHONE_NUMBER = "51939183704"; // Número de WhatsApp oficial Rubielle

// Tarifario de envíos ajustado desde el taller en Av. Nicolás Ayllón 872, La Victoria
const DISTRICT_RATES = {
  "Recojo en Taller (Av. Nicolás Ayllón 872, La Victoria)": 0.00,
  "La Victoria": 7.00,
  "El Agustino": 8.00,
  "San Luis": 8.00,
  "Lince": 9.00,
  "Lima Cercado": 10.00,
  "Breña": 10.00,
  "San Borja": 10.00,
  "Jesús María": 10.00,
  "Pueblo Libre": 11.00,
  "San Isidro": 12.00,
  "Surquillo": 12.00,
  "Miraflores": 12.00,
  "Magdalena del Mar": 12.00,
  "Ate (Salamanca / Olimpo)": 12.00,
  "Rímac": 12.00,
  "Santiago de Surco": 14.00,
  "Barranco": 14.00,
  "San Miguel": 14.00,
  "San Juan de Lurigancho (Zárate)": 14.00,
  "La Molina": 16.00,
  "Chorrillos": 16.00,
  "Los Olivos": 18.00,
  "San Martín de Porres": 18.00,
  "San Juan de Miraflores": 18.00,
  "Callao / Bellavista": 18.00
};

let currentCategory = 'Todas';
let currentOccasion = 'Todas';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  renderProducts();
  updateUI();
  setupDistrictSelector();
  setupMinDeliveryDates();

  // Dark Mode Toggle
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  // Filtros de Categoría
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-rosepastel-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border');
      });

      const target = e.currentTarget;
      target.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border');
      target.classList.add('bg-rosepastel-600', 'text-white', 'shadow-md');

      currentCategory = target.dataset.category || 'Todas';
      renderProducts();
    });
  });

  // Filtros de Ocasión
  document.querySelectorAll('.occasion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.occasion-btn').forEach(b => {
        b.classList.remove('bg-rosepastel-100', 'dark:bg-slate-800', 'text-rosepastel-700', 'dark:text-rosepastel-300');
        b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-600', 'dark:text-slate-400');
      });

      const target = e.currentTarget;
      target.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-600', 'dark:text-slate-400');
      target.classList.add('bg-rosepastel-100', 'dark:bg-slate-800', 'text-rosepastel-700', 'dark:text-rosepastel-300');

      currentOccasion = target.dataset.occasion || 'Todas';
      renderProducts();
    });
  });

  // Buscador
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Control de Modales (Carrito)
  const cartModal = document.getElementById('cart-modal');
  document.getElementById('open-cart-btn')?.addEventListener('click', () => {
    setupMinDeliveryDates();
    cartModal?.classList.remove('hidden');
  });
  document.getElementById('close-cart-btn')?.addEventListener('click', () => cartModal?.classList.add('hidden'));

  // Control de Modales (QuickView)
  const quickViewModal = document.getElementById('quickview-modal');
  document.getElementById('close-quickview-btn')?.addEventListener('click', () => quickViewModal?.classList.add('hidden'));

  // Control de Modales (Wishlist)
  const wishlistModal = document.getElementById('wishlist-modal');
  document.getElementById('wishlist-btn')?.addEventListener('click', () => {
    renderWishlistModal();
    wishlistModal?.classList.remove('hidden');
  });
  document.getElementById('close-wishlist-btn')?.addEventListener('click', () => {
    wishlistModal?.classList.add('hidden');
  });

  // Formulario de Ramo Personalizado -> WhatsApp
  const customForm = document.getElementById('custom-bouquet-form');
  customForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const flowers = document.getElementById('cust-flowers')?.value || 'No especificado';
    const paper = document.getElementById('cust-paper')?.value || 'No especificado';
    const date = document.getElementById('cust-date')?.value || 'A coordinar';
    const location = document.getElementById('cust-location')?.value || 'No especificado';
    const note = document.getElementById('cust-note')?.value || 'Sin nota';

    const msg = `✨ *COTIZACIÓN DE RAMO PERSONALIZADO - RUBIELLE* ✨\n\n` +
      `🌸 *Composición:* ${flowers}\n` +
      `🎀 *Envoltura:* ${paper}\n` +
      `📅 *Fecha Deseada:* ${date}\n` +
      `📍 *Entrega en:* ${location}\n` +
      `✍️ *Dedicatoria:* ${note}`;

    window.open(`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Finalizar Compra Carrito -> WhatsApp
  const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
  checkoutBtn?.addEventListener('click', () => {
    if (store.cart.length === 0) {
      showToast('El carrito está vacío', '⚠️', 'warning');
      return;
    }

    const dateInput = document.getElementById('cart-delivery-date');
    const addressInput = document.getElementById('cart-delivery-address');
    const districtSelect = document.getElementById('cart-delivery-district');

    const date = dateInput ? dateInput.value : '';
    const address = addressInput ? addressInput.value : '';
    const district = districtSelect ? districtSelect.value : '';

    if (!date || !address) {
      showToast('Por favor, ingresa la fecha y dirección de entrega.', '⚠️', 'warning');
      return;
    }

    // Validar si la fecha seleccionada es domingo
    if (date) {
      const selectedDate = new Date(date + 'T00:00:00');
      if (selectedDate.getDay() === 0) {
        showToast('No realizamos entregas los domingos. Elige otra fecha.', '🚫', 'error');
        return;
      }
    }

    const subtotal = store.getCartTotal();
    const isPickup = district.includes("Recojo en Taller");
    const deliveryFee = (district && DISTRICT_RATES[district] !== undefined) ? DISTRICT_RATES[district] : 0;
    const total = subtotal + deliveryFee;

    let msg = `🛒 *NUEVO PEDIDO DESDE LA WEB - RUBIELLE* 🌸\n\n*Productos Seleccionados:*\n`;
    store.cart.forEach(item => {
      msg += `• ${item.name} (x${item.quantity}) - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    msg += `\n💵 *Subtotal:* S/ ${subtotal.toFixed(2)}`;
    
    if (district) {
      if (isPickup) {
        msg += `\n📍 *Método:* Recojo en Taller (GRATIS)`;
      } else {
        msg += `\n🚚 *Envío (${district}):* S/ ${deliveryFee.toFixed(2)}`;
      }
      msg += `\n💰 *TOTAL A PAGAR:* S/ ${total.toFixed(2)}\n`;
    } else {
      msg += `\n💰 *Total:* S/ ${subtotal.toFixed(2)}\n`;
    }

    msg += `📅 *Fecha de Entrega/Recojo:* ${date}\n`;
    msg += `📍 *Dirección:* ${address}${district && !isPickup ? ` (${district})` : ''}\n`;

    window.open(`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(msg)}`, '_blank');
  });
});

// Configura la fecha mínima en el selector
function setupMinDeliveryDates() {
  const dateInput = document.getElementById('cart-delivery-date');
  const customDateInput = document.getElementById('cust-date');
  
  const today = new Date();
  today.setDate(today.getDate() + 1); // Mínimo a partir de mañana
  const minDateStr = today.toISOString().split('T')[0];

  if (dateInput) dateInput.min = minDateStr;
  if (customDateInput) customDateInput.min = minDateStr;
}

// Carga las opciones de distrito y recojo si el selector existe en el HTML
function setupDistrictSelector() {
  const select = document.getElementById('cart-delivery-district');
  if (!select) return;

  select.innerHTML = '<option value="">Selecciona Método de Entrega / Distrito</option>';
  
  Object.keys(DISTRICT_RATES).forEach(district => {
    const option = document.createElement('option');
    option.value = district;
    const rate = DISTRICT_RATES[district];
    
    if (rate === 0) {
      option.textContent = `📍 ${district} (GRATIS)`;
    } else {
      option.textContent = `🚚 ${district} (+S/ ${rate.toFixed(2)})`;
    }
    
    select.appendChild(option);
  });

  select.addEventListener('change', () => updateUI());
}

// Renderizado del Catálogo de Productos
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let items = products;

  if (currentCategory !== 'Todas') items = items.filter(p => p.category === currentCategory);
  if (currentOccasion !== 'Todas') items = items.filter(p => p.occasion === currentOccasion);
  if (searchQuery) {
    items = items.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  if (items.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-sm">No encontramos productos con ese filtro.</div>`;
    return;
  }

  items.forEach(p => {
    const isFav = store.isInWishlist(p.id);
    const card = document.createElement('div');
    card.className = 'glass-card rounded-3xl overflow-hidden border border-rosepastel-200/50 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group';
    card.innerHTML = `
      <div>
        <div class="relative overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <button onclick="window.toggleFav('${p.id}')" class="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md text-rosepastel-600 transition-transform hover:scale-110">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rosepastel-600' : ''}"></i>
          </button>
          <span class="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            ⏱ Confección: ${p.prepTime}
          </span>
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[11px] font-extrabold text-rosepastel-700 dark:text-rosepastel-300 bg-rosepastel-100/60 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">${p.category}</span>
            <span class="text-[10px] text-slate-400 uppercase font-bold">${p.occasion}</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">${p.name}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">${p.description}</p>
        </div>
      </div>
      <div class="p-5 pt-0 flex items-center justify-between gap-2">
        <span class="text-lg font-black text-slate-900 dark:text-white">S/ ${p.price.toFixed(2)}</span>
        <div class="flex items-center gap-1.5">
          <button onclick="window.openQuickView('${p.id}')" class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors" title="Vista Rápida">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          <button onclick="window.addToCart('${p.id}')" class="px-3.5 py-2.5 bg-rosepastel-600 hover:bg-rosepastel-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Agregar
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

// Renderizado del Modal de Favoritos
function renderWishlistModal() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;

  container.innerHTML = '';
  const favProducts = products.filter(p => store.isInWishlist(p.id));

  if (favProducts.length === 0) {
    container.innerHTML = `<p class="text-center py-8 text-slate-400 text-xs">Aún no tienes favoritos guardados. ❤️</p>`;
    return;
  }

  favProducts.forEach(item => {
    const el = document.createElement('div');
    el.className = 'flex items-center justify-between bg-cream-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-rosepastel-200/40 dark:border-slate-800';
    el.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover" alt="${item.name}">
        <div>
          <h4 class="font-bold text-xs text-slate-900 dark:text-white">${item.name}</h4>
          <span class="text-[10px] font-extrabold text-rosepastel-600 dark:text-rosepastel-400">S/ ${item.price.toFixed(2)}</span>
        </div>
      </div>
      <button onclick="window.moveWishlistToCart('${item.id}')" class="p-2 bg-rosepastel-600 text-white rounded-xl text-xs font-bold hover:bg-rosepastel-700 transition-colors">
        🛒 + Carrito
      </button>
    `;
    container.appendChild(el);
  });
}

// Actualización Global de la UI
function updateUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartTotal = document.getElementById('cart-total');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const districtSelect = document.getElementById('cart-delivery-district');

  const selectedDistrict = districtSelect?.value;
  const deliveryFee = (selectedDistrict && DISTRICT_RATES[selectedDistrict] !== undefined) ? DISTRICT_RATES[selectedDistrict] : 0;
  const grandTotal = store.getCartTotal() + deliveryFee;

  if (cartBadge) cartBadge.innerText = store.getCartCount();
  if (cartTotal) cartTotal.innerText = `S/ ${grandTotal.toFixed(2)}`;
  if (wishlistBadge) wishlistBadge.innerText = store.wishlist.length;

  const container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = '';

  if (store.cart.length === 0) {
    container.innerHTML = `<p class="text-center py-8 text-slate-400 text-xs">Tu carrito está vacío.</p>`;
    return;
  }

  store.cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'flex justify-between items-center bg-cream-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-rosepastel-200/40 dark:border-slate-800';
    el.innerHTML = `
      <div>
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">${item.name}</h4>
        <span class="text-[10px] text-slate-500 dark:text-slate-400">S/ ${item.price.toFixed(2)}</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="window.updateQty('${item.id}', -1)" class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100">-</button>
        <span class="text-xs font-bold text-slate-900 dark:text-white">${item.quantity}</span>
        <button onclick="window.updateQty('${item.id}', 1)" class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100">+</button>
      </div>
    `;
    container.appendChild(el);
  });
}

// --- FUNCIONES EXPUESTAS EN WINDOW PARA INTERACCIÓN HTML ---

window.addToCart = (id) => {
  const product = products.find(p => p.id === id);
  if (product) {
    store.addToCart(product);
    showToast(`"${product.name}" agregado al carrito`, '🛒', 'success');
    updateUI();
  }
};

window.toggleFav = (id) => {
  store.toggleWishlist(id);
  const isFav = store.isInWishlist(id);
  const product = products.find(p => p.id === id);
  
  if (product) {
    showToast(isFav ? `"${product.name}" guardado en favoritos` : `"${product.name}" removido de favoritos`, isFav ? '❤️' : '🤍', 'info');
  }

  updateUI();
  renderProducts();
  renderWishlistModal();
};

window.moveWishlistToCart = (id) => {
  const product = products.find(p => p.id === id);
  if (product) {
    store.addToCart(product);
    showToast(`"${product.name}" agregado al carrito`, '🛒', 'success');
    renderWishlistModal();
    updateUI();
  }
};

window.openQuickView = (id) => {
  const p = products.find(item => item.id === id);
  if (!p) return;

  const content = document.getElementById('quickview-content');
  if (!content) return;

  content.innerHTML = `
    <img src="${p.image}" class="w-full h-64 object-cover rounded-2xl shadow-md" alt="${p.name}">
    <div class="space-y-3">
      <span class="text-xs font-bold text-rosepastel-700 dark:text-rosepastel-300 bg-rosepastel-100 dark:bg-slate-800 px-3 py-1 rounded-full">${p.category}</span>
      <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${p.name}</h3>
      <p class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">${p.description}</p>
      <ul class="text-xs text-slate-500 dark:text-slate-400 space-y-1 py-1">
        ${p.details ? p.details.map(d => `<li class="flex items-center gap-1.5">🌸 ${d}</li>`).join('') : ''}
      </ul>
      <div class="flex items-center justify-between pt-2">
        <span class="text-2xl font-black text-rosepastel-600 dark:text-rosepastel-300">S/ ${p.price.toFixed(2)}</span>
        <button onclick="window.addToCart('${p.id}')" class="px-5 py-3 bg-rosepastel-600 hover:bg-rosepastel-700 text-white font-bold rounded-xl text-xs shadow-md">
          + Añadir al Carrito
        </button>
      </div>
    </div>
  `;

  document.getElementById('quickview-modal')?.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.updateQty = (id, delta) => {
  store.updateQuantity(id, delta);
  updateUI();
};

window.copyToClipboard = (text, message) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Copiado al portapapeles', '📋', 'info');
  });
};