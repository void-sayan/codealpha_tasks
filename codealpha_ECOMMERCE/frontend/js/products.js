document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid'); const search = document.getElementById('search-input'); const category = document.getElementById('category-filter');
  let products = [];
  try { const data = await api('/api/products'); products = data.products || data; render(); } catch (error) { grid.innerHTML = `<p class="form-error">${escapeHtml(error.message)}</p>`; }
  [...new Set(products.map(p => p.category))].sort().forEach(c => category.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`));
  function render() {
    const term = (search.value || '').toLowerCase(); const selected = category.value;
    const filtered = products.filter(p => (!selected || p.category === selected) && `${p.name} ${p.description}`.toLowerCase().includes(term));
    grid.innerHTML = filtered.length ? filtered.map(p => `<article class="card product-card">
      <img src="${escapeHtml(imageSource(p.image))}" alt="${escapeHtml(p.name)}" loading="lazy"><div class="product-body"><h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description)}</p><div><span class="price">$${Number(p.price).toFixed(2)}</span> <span class="stock">${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span></div>
      <div class="actions"><a class="btn btn-secondary" href="product.html?id=${p._id}">View Details</a><button class="btn btn-primary add-product" data-id="${p._id}" ${p.stock < 1 ? 'disabled' : ''}>Add to Cart</button></div></div></article>`).join('') : '<div class="empty"><p>No products matched your search.</p></div>';
    grid.querySelectorAll('.add-product').forEach(btn => btn.addEventListener('click', () => {
      const product = products.find(p => p._id === btn.dataset.id); const cart = getCart(); const existing = cart.find(item => item.product === product._id);
      if (existing && existing.quantity >= product.stock) return showToast('You reached the available stock.');
      if (existing) existing.quantity += 1; else cart.push({ product: product._id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: product.stock });
      saveCart(cart); showToast('Added to cart');
    }));
  }
  search.addEventListener('input', render); category.addEventListener('change', render);
  document.getElementById('search-form')?.addEventListener('submit', event => event.preventDefault());
});
