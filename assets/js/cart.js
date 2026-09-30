class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('rubielle_cart')) || [];
  }

  save() {
    localStorage.setItem('rubielle_cart', JSON.stringify(this.cart));
  }

  addItem(product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.save();
  }

  removeItem(id) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.save();
  }

  updateQuantity(id, delta) {
    const item = this.cart.find(item => item.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.save();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.cart = [];
    this.save();
  }
}

export const cart = new CartManager();