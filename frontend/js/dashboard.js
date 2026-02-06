// Utility function to get logged-in user info from localStorage
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

// Logout function to clear user session and redirect to login
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Load dashboard data on DOM content loaded
document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
  console.log('loadDashboard called');

  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Show user name on page
  document.getElementById("username").textContent = user.name || user.username || 'User';

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  try {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const orders = await res.json();

    // Filter orders belonging to logged in user
    const myOrders = orders.filter(o => o.user_id == user.id);

    // Update stats
    document.getElementById("orderCount").textContent = myOrders.length;
    document.getElementById("cartCount").textContent = cart.length;
    document.getElementById("pendingCount").textContent = myOrders.filter(o => o.status === "pending").length;

    let balance = 0;
    myOrders.forEach(o => {
      balance += Number(o.total_amount);
    });
    document.getElementById("balance").textContent = balance.toLocaleString();

    // Populate orders table
    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    if (myOrders.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;">No orders yet</td>
        </tr>`;
      return;
    }

    myOrders.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${o.id}</td>
        <td>${new Date(o.order_date).toLocaleDateString()}</td>
        <td>KSh ${Number(o.total_amount).toLocaleString()}</td>
        <td>${o.status}</td>
      `;
      table.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    alert("Could not load orders at this time.");
  }
}
