// Example for loading dashboard counts and orders — you can add your own logic here

async function loadDashboardSummary() {
  try {
    const resOrders = await fetch('/api/orders/count');
    const totalOrders = await resOrders.json();
    document.getElementById('total-orders').textContent = totalOrders.count || 0;

    const resProducts = await fetch('/api/products/count');
    const totalProducts = await resProducts.json();
    document.getElementById('total-products').textContent = totalProducts.count || 0;

    const resUsers = await fetch('/api/users/count');
    const totalUsers = await resUsers.json();
    document.getElementById('total-users').textContent = totalUsers.count || 0;

    const resRevenue = await fetch('/api/orders/revenue');
    const totalRevenue = await resRevenue.json();
    document.getElementById('total-revenue').textContent = (totalRevenue.revenue || 0).toFixed(2);

    // total-feedback handled inside dashboard.html script
  } catch (err) {
    console.error('Dashboard load error', err);
  }
}

async function loadRecentOrders() {
  try {
    const res = await fetch('/api/orders/recent');
    const orders = await res.json();

    const tbody = document.getElementById('recent-orders');
    tbody.innerHTML = '';

    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer || 'N/A'}</td>
        <td>${new Date(order.order_date).toLocaleDateString()}</td>
        <td>${order.status}</td>
        <td>${order.total_amount || 'undefined'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Recent orders load error', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardSummary();
  loadRecentOrders();
});
