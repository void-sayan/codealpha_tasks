document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { location.href = `login.html?redirect=checkout.html`; return; }
  const cart = getCart(); const summary = document.getElementById('checkout-summary'); const message = document.getElementById('form-message');
  if (!cart.length) { summary.innerHTML = '<div class="empty">Your cart is empty.</div>'; document.getElementById('checkout-form').style.display = 'none'; return; }
  const amount = cart.reduce((s, i) => s + i.price * i.quantity, 0); summary.innerHTML = cart.map(i => `<div class="summary-line"><span>${escapeHtml(i.name)} × ${i.quantity}</span><strong>$${(i.price * i.quantity).toFixed(2)}</strong></div>`).join('') + `<div class="summary-line summary-total"><span>Total</span><strong>$${amount.toFixed(2)}</strong></div>`;
  document.getElementById('checkout-form').onsubmit = async e => { e.preventDefault(); message.textContent = ''; const shippingAddress = Object.fromEntries(new FormData(e.target)); try { await api('/api/orders', { method: 'POST', body: JSON.stringify({ items: cart.map(i => ({ product: i.product, quantity: i.quantity })), shippingAddress }) }); saveCart([]); location.href = 'orders.html'; } catch (err) { message.textContent = err.message; } };
});
