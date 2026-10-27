// ===== Корзина: общая логика для всех страниц =====
const CART_KEY = 'cosiness_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const link = document.querySelector('nav a[href="cart.html"]');
  if (!link) return;

  link.classList.toggle('cart-filled', totalQty > 0);
  let badge = link.querySelector('.cart-badge');

  if (totalQty > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      link.appendChild(badge);
    }
    badge.textContent = totalQty;
  } else if (badge) {
    badge.remove();
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);