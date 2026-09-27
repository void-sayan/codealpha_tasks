document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('product-detail'); const id = new URLSearchParams(location.search).get('id');
  if (!id) { root.innerHTML = '<p class="form-error">Product not found.</p>'; return; }
  try {
    const response = await api(`/api/products/${id}`);
    const product = response.product || response;
    root.innerHTML = `<div><img src="${escapeHtml(imageSource(product.image))}" alt="${escapeHtml(product.name)}"></div><div>
      <span class="muted">${escapeHtml(product.category)}</span><h1>${escapeHtml(product.name)}</h1><div class="price">$${Number(product.price).toFixed(2)}</div>
      <p class="detail-description">${escapeHtml(product.description)}</p><p class="stock">${product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
      <div class="quantity"><button id="decrease">−</button><span id="quantity">1</span><button id="increase">+</button></div>
      <button id="add" class="btn btn-primary full" ${product.stock < 1 ? 'disabled' : ''}>Add to Cart</button><p class="muted">Product ID: ${escapeHtml(product._id)}</p></div>`;
    let quantity = 1; const quantityEl = document.getElementById('quantity');
    document.getElementById('decrease').onclick = () => { quantity = Math.max(1, quantity - 1); quantityEl.textContent = quantity; };
    document.getElementById('increase').onclick = () => { quantity = Math.min(product.stock, quantity + 1); quantityEl.textContent = quantity; };
    document.getElementById('add').onclick = () => { const cart = getCart(); const existing = cart.find(item => item.product === product._id); if (existing) existing.quantity = Math.min(product.stock, existing.quantity + quantity); else cart.push({ product: product._id, name: product.name, price: product.price, image: product.image, quantity, stock: product.stock }); saveCart(cart); showToast('Added to cart'); };
  } catch (error) { root.innerHTML = `<p class="form-error">${escapeHtml(error.message)}</p>`; }
});
