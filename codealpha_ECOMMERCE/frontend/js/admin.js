document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!getToken() || user?.role !== 'admin') { location.href = getToken() ? 'index.html' : 'login.html?redirect=admin.html'; return; }
  const productsTable = document.getElementById('products-table');
  const ordersTable = document.getElementById('orders-table');
  const form = document.getElementById('product-form');
  const message = document.getElementById('admin-message');
  let products = [];

  document.getElementById('logout-button').onclick = logout;
  document.getElementById('cancel-edit').onclick = resetForm;

  function notify(text, isError = false) {
    message.textContent = text;
    message.className = `admin-message ${isError ? 'form-error' : 'form-success'}`;
  }
  function resetForm() {
    form.reset();
    form.elements.id.value = '';
    document.getElementById('product-form-title').textContent = 'Add a product';
    document.getElementById('cancel-edit').hidden = true;
  }
  function populateForm(product) {
    Object.entries({ id: product._id, name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, image: product.image || '' }).forEach(([key, value]) => { form.elements[key].value = value; });
    document.getElementById('product-form-title').textContent = 'Edit product';
    document.getElementById('cancel-edit').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function loadProducts() {
    const data = await api('/api/products'); products = data.products || data;
    productsTable.innerHTML = products.length ? `<table class="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>${products.map(p => `<tr><td><img src="${escapeHtml(imageSource(p.image))}" alt="">${escapeHtml(p.name)}</td><td>$${Number(p.price).toFixed(2)}</td><td>${p.stock}</td><td class="admin-actions"><button class="btn btn-secondary edit-product" data-id="${p._id}">Edit</button><button class="btn btn-danger delete-product" data-id="${p._id}">Delete</button></td></tr>`).join('')}</tbody></table>` : '<div class="empty">No products yet.</div>';
    productsTable.querySelectorAll('.edit-product').forEach(button => button.onclick = () => populateForm(products.find(p => p._id === button.dataset.id)));
    productsTable.querySelectorAll('.delete-product').forEach(button => button.onclick = async () => { if (!confirm('Delete this product?')) return; try { await api(`/api/products/${button.dataset.id}`, { method: 'DELETE' }); notify('Product deleted.'); await loadProducts(); } catch (error) { notify(error.message, true); } });
  }
  async function loadOrders() {
    const data = await api('/api/orders/admin/all'); const orders = data.orders || data;
    ordersTable.innerHTML = orders.length ? `<table class="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>${orders.map(o => `<tr><td>#${escapeHtml(o._id.slice(-8))}<br><small class="muted">${new Date(o.createdAt).toLocaleDateString()}</small></td><td>${escapeHtml(o.user?.name || 'Customer')}</td><td>$${Number(o.totalAmount ?? o.total).toFixed(2)}</td><td><select class="order-status" data-id="${o._id}">${['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(status => `<option value="${status}" ${o.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>` : '<div class="empty">No orders yet.</div>';
    ordersTable.querySelectorAll('.order-status').forEach(select => select.onchange = async () => { try { await api(`/api/orders/admin/${select.dataset.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: select.value }) }); notify('Order status updated.'); } catch (error) { notify(error.message, true); } });
  }
  form.onsubmit = async event => {
    event.preventDefault(); notify('');
    const values = Object.fromEntries(new FormData(form)); const id = values.id; delete values.id;
    values.price = Number(values.price); values.stock = Number(values.stock);
    try { await api(id ? `/api/products/${id}` : '/api/products', { method: id ? 'PUT' : 'POST', body: JSON.stringify(values) }); notify(id ? 'Product updated.' : 'Product added.'); resetForm(); await loadProducts(); } catch (error) { notify(error.message, true); }
  };
  Promise.all([loadProducts(), loadOrders()]).catch(error => notify(error.message, true));
});
