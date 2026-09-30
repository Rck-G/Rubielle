import { store } from './store.js';
import { showToast } from './toast.js';

// Número oficial de WhatsApp
const PHONE_NUMBER = "51939183704";

// Tarifas y cobertura de envío por distrito (Lima, Perú)
export const LIMA_DISTRICTS = [
  { name: "Miraflores", fee: 10.00 },
  { name: "San Isidro", fee: 10.00 },
  { name: "Barranco", fee: 10.00 },
  { name: "Surco", fee: 12.00 },
  { name: "San Borja", fee: 10.00 },
  { name: "La Molina", fee: 15.00 },
  { name: "Jesús María", fee: 10.00 },
  { name: "Lince", fee: 10.00 },
  { name: "Pueblo Libre", fee: 10.00 },
  { name: "Magdalena del Mar", fee: 10.00 },
  { name: "San Miguel", fee: 12.00 },
  { name: "Cercado de Lima", fee: 12.00 },
  { name: "Chorrillos", fee: 15.00 },
  { name: "Los Olivos", fee: 18.00 },
  { name: "San Martín de Porres", fee: 18.00 },
  { name: "Ate", fee: 18.00 },
  { name: "San Juan de Lurigancho", fee: 20.00 },
  { name: "San Juan de Miraflores", fee: 15.00 },
  { name: "Villa María del Triunfo", fee: 20.00 },
  { name: "Villa El Salvador", fee: 20.00 }
];

/**
 * Obtiene la fecha mínima permitida para entrega según el tiempo de preparación de los productos en el carrito.
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function getMinDeliveryDate() {
  const cart = store.cart;
  let maxPrepDays = 1; // Mínimo 1 día de anticipación por defecto

  cart.forEach(item => {
    if (item.prepTime) {
      const daysMatch = item.prepTime.match(/\d+/);
      if (daysMatch) {
        const days = parseInt(daysMatch[0], 10);
        if (days > maxPrepDays) maxPrepDays = days;
      }
    }
  });

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + maxPrepDays);

  // Formato YYYY-MM-DD
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Valida si una fecha seleccionada cumple los requisitos mínimos y no cae en domingo.
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {{ valid: boolean, message: string }}
 */
export function validateDeliveryDate(dateString) {
  if (!dateString) {
    return { valid: false, message: "Por favor selecciona una fecha de entrega." };
  }

  const selectedDate = new Date(`${dateString}T00:00:00`);
  const minDateStr = getMinDeliveryDate();
  const minDate = new Date(`${minDateStr}T00:00:00`);

  if (selectedDate < minDate) {
    return { 
      valid: false, 
      message: `La fecha mínima de entrega para tu pedido es el ${minDateStr.split('-').reverse().join('/')} por el tiempo de confección artesanal.` 
    };
  }

  // Verificar si es domingo (0 = Domingo)
  if (selectedDate.getDay() === 0) {
    return { 
      valid: false, 
      message: "Atendemos entregas de Lunes a Sábado. Por favor selecciona otro día." 
    };
  }

  return { valid: true, message: "" };
}

/**
 * Procesa la orden de compra y redirige a WhatsApp.
 * @param {Object} orderData
 * @param {string} orderData.date - Fecha seleccionada
 * @param {string} orderData.district - Nombre del distrito
 * @param {string} orderData.address - Dirección exacta / Referencia
 * @param {string} [orderData.note] - Mensaje o dedicatoria
 */
export function processWhatsAppCheckout({ date, district, address, note = '' }) {
  if (store.cart.length === 0) {
    showToast('Tu carrito está vacío', '⚠️', 'warning');
    return;
  }

  const dateValidation = validateDeliveryDate(date);
  if (!dateValidation.valid) {
    showToast(dateValidation.message, '📅', 'error');
    return;
  }

  if (!district) {
    showToast('Por favor selecciona un distrito de entrega.', '📍', 'warning');
    return;
  }

  if (!address || address.trim().length < 5) {
    showToast('Por favor ingresa una dirección clara con referencia.', '🏠', 'warning');
    return;
  }

  const districtData = LIMA_DISTRICTS.find(d => d.name.toLowerCase() === district.toLowerCase());
  const deliveryFee = districtData ? districtData.fee : 0.00;
  const subtotal = store.getCartTotal();
  const total = subtotal + deliveryFee;

  let msg = `🛒 *NUEVO PEDIDO DESDE LA WEB - RUBIELLE* 🌸\n\n`;
  msg += `*Productos Seleccionados:*\n`;

  store.cart.forEach(item => {
    msg += `• ${item.name} (x${item.quantity}) - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
  });

  msg += `\n💵 *Subtotal:* S/ ${subtotal.toFixed(2)}\n`;
  msg += `🚚 *Envío (${district}):* S/ ${deliveryFee.toFixed(2)}\n`;
  msg += `💰 *Total a Pagar:* S/ ${total.toFixed(2)}\n\n`;
  msg += `📅 *Fecha de Entrega:* ${date.split('-').reverse().join('/')}\n`;
  msg += `📍 *Dirección:* ${address.trim()} (${district})\n`;

  if (note && note.trim()) {
    msg += `✍️ *Dedicatoria/Nota:* ${note.trim()}\n`;
  }

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
}