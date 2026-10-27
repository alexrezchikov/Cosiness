// contacts.html — обработка формы обратной связи
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Сообщение отправлено');
  form.reset();
});