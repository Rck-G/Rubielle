class StoreManager {
  constructor() {
    this.cart = this.loadFromStorage('rubielle_cart', []);
    this.wishlist = this.loadFromStorage('rubielle_wishlist', []);
  }

  // --- MÉTODOS PRIVADOS / AUXILIARES ---
  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error al cargar ${key} desde localStorage:`, e);
      return fallback;
    }
  }

  saveCart() {
    try {
      localStorage.setItem('rubielle_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Error al guardar el carrito en localStorage:', e);
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem('rubielle_wishlist', JSON.stringify(this.wishlist));
    } catch (e) {
      console.warn('Error al guardar la wishlist en localStorage:', e);
    }
  }

  // --- CARRITO ---
  addToCart(product) {
    if (!product || !product.id) return;

    const existingIndex = this.cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  }

  updateQuantity(id, delta) {
    const item = this.cart.find(item => item.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(id);
        return;
      }
      this.saveCart();
    }
  }

  removeFromCart(id) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // --- WISHLIST ---
  toggleWishlist(productId) {
    if (!productId) return false;

    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    this.saveWishlist();
    return this.isInWishlist(productId);
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  clearWishlist() {
    this.wishlist = [];
    this.saveWishlist();
  }
}

export const store = new StoreManager();