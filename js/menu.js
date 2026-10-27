// ===== Аккордеон категорий =====
document.querySelectorAll('.category-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.closest('.menu-category');
    const content = category.querySelector('.category-content');
    const isOpen = category.classList.contains('open');

    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => { content.style.maxHeight = '0px'; });
      category.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      category.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.menu-category.open .category-content').forEach((content) => {
    content.style.maxHeight = content.scrollHeight + 'px';
  });
});

// ===== Анимация появления =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// ===== Счётчики на карточках блюд =====
function syncCounters() {
  const cart = getCart();
  document.querySelectorAll('.dish-card[data-id]').forEach((card) => {
    const id = card.dataset.id;
    const qty = cart[id] ? cart[id].qty : 0;
    const valueEl = card.querySelector('.counter-value');
    if (valueEl) valueEl.textContent = qty;
    card.classList.toggle('in-cart', qty > 0);
  });
}

document.querySelectorAll('.dish-card[data-id]').forEach((card) => {
  const minus = card.querySelector('.counter-btn.minus');
  const plus = card.querySelector('.counter-btn.plus');
  const valueEl = card.querySelector('.counter-value');

  plus.addEventListener('click', () => {
    const cart = getCart();
    const id = card.dataset.id;
    if (cart[id]) cart[id].qty++;
    else cart[id] = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      qty: 1
    };
    saveCart(cart);
    valueEl.textContent = cart[id].qty;
    card.classList.add('in-cart');
  });

  minus.addEventListener('click', () => {
    const cart = getCart();
    const id = card.dataset.id;
    if (!cart[id]) return;
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    valueEl.textContent = cart[id] ? cart[id].qty : 0;
    if (!cart[id]) card.classList.remove('in-cart');
  });
});

syncCounters();