document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form'); if (!form) return;
  const isRegister = form.dataset.mode === 'register'; const error = document.getElementById('form-message');
  form.onsubmit = async e => { e.preventDefault(); error.textContent = ''; const values = Object.fromEntries(new FormData(form));
    if (isRegister && values.password !== values.confirmPassword) { error.textContent = 'Passwords do not match.'; return; }
    try {
      const data = await api(isRegister ? '/api/auth/register' : '/api/auth/login', { method: 'POST', body: JSON.stringify(values) });
      setAuth(data);
      const redirect = new URLSearchParams(location.search).get('redirect');
      location.href = redirect || (data.user.role === 'admin' ? 'admin.html' : 'index.html');
    } catch (err) { error.textContent = err.message; }
  };
});
