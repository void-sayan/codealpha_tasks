const API_BASE = window.API_BASE || '';
const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e2e8f0"/><text x="400" y="310" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="28">CodeAlphaStore product</text></svg>')}`;

function getToken() { return localStorage.getItem('token'); }
function imageSource(url) { return url || FALLBACK_IMAGE; }
function getUser() { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } }
function setAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = 'index.html'; }
function getCart() { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count; el.hidden = count === 0; });
}
function showToast(message) {
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message;
  document.body.appendChild(toast); setTimeout(() => toast.remove(), 2800);
}
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
function renderNav() {
  const user = getUser();
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.innerHTML = `<a href="index.html">Shop</a><a href="cart.html" class="cart-link">Cart <span class="cart-count"></span></a>
    ${user ? `${user.role === 'admin' ? '<a href="admin.html">Admin</a>' : '<a href="orders.html">My Orders</a>'}<a href="#" id="logout-link">Hi, ${escapeHtml(user.name.split(' ')[0])} · Log out</a>` : '<a href="login.html">Login</a><a class="btn btn-primary" href="register.html">Register</a>'}`;
  document.getElementById('logout-link')?.addEventListener('click', e => { e.preventDefault(); logout(); });
  updateCartCount();
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  document.querySelector('.nav-toggle')?.addEventListener('click', () => document.querySelector('.nav-links')?.classList.toggle('open'));
});
document.addEventListener('error', event => {
  const image = event.target;
  if (image?.tagName === 'IMG' && image.dataset.fallbackApplied !== 'true') {
    image.dataset.fallbackApplied = 'true';
    image.src = FALLBACK_IMAGE;
  }
}, true);
