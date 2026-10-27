// cart.html — отрисовка корзины и оформление заказа
const ORDERS_KEY = 'cosiness_orders';

const EMOJI = {
  'espresso': '☕', 'americano': '☕', 'cappuccino': '☕', 'latte': '☕',
  'flatwhite': '☕', 'raf': '☕', 'cocoa': '🍫', 'seabuckthorn': '🍵',
  'croissant-almond': '🥐', 'croissant-choc': '🥐', 'cinnabon': '🥮',
  'muffin': '🧁', 'sandwich-turkey': '🥪', 'sandwich-salmon': '🥪',
  'oatmeal': '🥣', 'syrniki': '🥞', 'avocado': '🥗', 'caesar': '🥗',
  'greek': '🥗', 'tuna': '🥗', 'cheesecake': '🍰', 'tiramisu': '🍰',
  'brownie': '🍫', 'medovik': '🍰', 'pannacotta': '🍮', 'icecream': '🍦'
};

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById('cartItems');
  const summaryBody = document.getElementById('summaryBody');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const ids = Object.keys(cart);

  const totalQty = ids.reduce((s, id) => s + cart[id].qty, 0);
  const subtotal = ids.reduce((s, id) => s + cart[id].price * cart[id].qty, 0);

  if (ids.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Корзина пуста</h3>
        <p>Загляните в меню — там много вкусного.</p>
        <a href="menu.html" class="checkout-btn cart-empty-btn">Перейти в меню</a>
      </div>`;
    summaryBody.innerHTML = `
      <div class="summary-row"><span>Товары (0)</span><span>0 ₽</span></div>
      <hr>
      <div class="summary-row summary-total"><span>К оплате</span><span>0 ₽</span></div>`;
    checkoutBtn.disabled = true;
    return;
  }

  itemsEl.innerHTML = ids.map((id) => {
    const item = cart[id];
    return `
      <div class="cart-item" data-id="${id}">
        <div class="cart-thumb">${EMOJI[id] || '🍽️'}</div>
        <div class="cart-info">
          <h3>${item.name}</h3>
          <div class="cart-qty">
            <button type="button" class="qty-btn" data-action="minus">−</button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn" data-action="plus">+</button>
          </div>
        </div>
        <span class="dish-price">${item.price * item.qty} ₽</span>
      </div>`;
  }).join('');

  const discount = Math.round(subtotal * 0.05);
  const total = subtotal - discount;

  summaryBody.innerHTML = `
    <div class="summary-row"><span>Товары (${totalQty})</span><span>${subtotal} ₽</span></div>
    <div class="summary-row"><span>Скидка постоянного гостя</span><span>−${discount} ₽</span></div>
    <div class="summary-row"><span>Доставка</span><span>0 ₽</span></div>
    <hr>
    <div class="summary-row summary-total"><span>К оплате</span><span>${total} ₽</span></div>`;

  checkoutBtn.disabled = false;

  itemsEl.querySelectorAll('.cart-item').forEach((row) => {
    const id = row.dataset.id;
    row.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const c = getCart();
        if (!c[id]) return;
        if (btn.dataset.action === 'plus') c[id].qty++;
        else {
          c[id].qty--;
          if (c[id].qty <= 0) delete c[id];
        }
        saveCart(c);
        renderCart();
        updateCartBadge();
      });
    });
  });
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
  const cart = getCart();
  const ids = Object.keys(cart);
  if (ids.length === 0) return;

  const items = ids.map((id) => ({
    name: cart[id].name,
    qty: cart[id].qty,
    price: cart[id].price
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal - discount;

  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: items,
    subtotal: subtotal,
    discount: discount,
    total: total
  };

  try {
    const history = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    history.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(history));
  } catch (e) {}

  alert('Спасибо! Заказ оформлен. Мы свяжемся с вами.');
  localStorage.removeItem(CART_KEY);
  renderCart();
  updateCartBadge();
});

// Анимация появления
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// Старт
renderCart();
updateCartBadge();