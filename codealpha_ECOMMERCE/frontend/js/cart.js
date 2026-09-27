document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('cart-list'); const total = document.getElementById('cart-total'); const qty = document.getElementById('cart-qty');
  function render() {
    const cart = getCart(); qty.textContent = cart.reduce((s, i) => s + i.quantity, 0); total.textContent = `$${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`;
    list.innerHTML = cart.length ? cart.map(i => `<div class="cart-row"><img src="${escapeHtml(imageSource(i.image))}" alt=""><div><h3>${escapeHtml(i.name)}</h3><small>$${Number(i.price).toFixed(2)} each</small></div><div class="quantity"><button data-action="dec" data-id="${i.product}">−</button><span>${i.quantity}</span><button data-action="inc" data-id="${i.product}">+</button></div><button class="btn btn-danger" data-action="remove" data-id="${i.product}">Remove</button></div>`).join('') : '<div class="empty"><p>Your cart is empty.</p><a class="btn btn-primary" href="index.html">Browse products</a></div>';
    list.querySelectorAll('button').forEach(button => button.onclick = () => { const item = cart.find(i => i.product === button.dataset.id); if (button.dataset.action === 'remove') cart.splice(cart.indexOf(item), 1); if (button.dataset.action === 'inc' && item.quantity < item.stock) item.quantity += 1; if (button.dataset.action === 'dec') item.quantity -= 1; saveCart(cart.filter(i => i.quantity > 0)); render(); });
  }
  render();
});
