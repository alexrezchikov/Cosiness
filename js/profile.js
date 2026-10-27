// profile.html — данные профиля и история заказов
const PROFILE_KEY = 'cosiness_profile';
const ORDERS_KEY = 'cosiness_orders';

const form = document.getElementById('profileForm');
const fields = {
  name: document.getElementById('name'),
  surname: document.getElementById('surname'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  birthday: document.getElementById('birthday')
};
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');
const avatar = document.getElementById('avatar');
const toast = document.getElementById('toast');
const ordersList = document.getElementById('ordersList');
const ordersCount = document.getElementById('ordersCount');

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (!saved) return;
    Object.keys(fields).forEach((key) => {
      if (saved[key] !== undefined) fields[key].value = saved[key];
    });
    updateCard();
  } catch (e) {}
}

function updateCard() {
  const name = fields.name.value.trim() || 'Гость';
  const surname = fields.surname.value.trim();
  const email = fields.email.value.trim();
  displayName.textContent = (name + ' ' + surname).trim();
  displayEmail.textContent = email || '—';
  avatar.textContent = name.charAt(0).toUpperCase();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function renderOrders() {
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) { orders = []; }

  ordersCount.textContent = orders.length;

  if (orders.length === 0) {
    ordersList.innerHTML = '<p class="orders-empty">Пока нет заказов. Загляните в меню — и история появится здесь.</p>';
    return;
  }

  ordersList.innerHTML = orders.map((o) => {
    const itemsText = o.items.map((i) => i.name + (i.qty > 1 ? ' ×' + i.qty : '')).join(', ');
    const shortId = '№ ' + o.id.slice(-6);
    return (
      '<div class="order-row">' +
        '<span>' + shortId + ' · ' + formatDate(o.date) + '</span>' +
        '<span>' + itemsText + '</span>' +
        '<span class="dish-price">' + o.total + ' ₽</span>' +
      '</div>'
    );
  }).join('');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {};
  Object.keys(fields).forEach((key) => {
    data[key] = fields[key].value.trim();
  });
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  updateCard();
  showToast('Данные сохранены');
});

// Анимация появления
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// Старт
loadProfile();
renderOrders();