const ordersTable = document.getElementById("ordersTable");
const searchInput = document.getElementById("searchTransaction");

// ================== LOAD ORDERS ==================
async function loadOrders(query = "") {
  try {
    const url = query
      ? `/api/orders/search?q=${encodeURIComponent(query)}`
      : "/api/orders";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch orders");

    const orders = await res.json();
    ordersTable.innerHTML = "";

    if (orders.length === 0) {
      ordersTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">No orders found</td></tr>`;
      return;
    }

    orders.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.transaction_code || ""}</td>
        <td>${o.customer || ""}</td>
        <td>${o.items && o.items.length > 0
          ? o.items.map(item =>
            `${item.name} (x${item.quantity})`
          ).join("<br>")
          : "No items"}
        </td>
        <td>${Number(o.total_amount).toLocaleString()}</td>
        <td>
          <select onchange="updateStatus(${o.id}, this.value)">
            <option ${o.status === "pending" ? "selected" : ""}>pending</option>
            <option ${o.status === "confirmed" ? "selected" : ""}>confirmed</option>
            <option ${o.status === "delivered" ? "selected" : ""}>delivered</option>
            <option ${o.status === "cancelled" ? "selected" : ""}>cancelled</option>
          </select>
        </td>
        <td>${new Date(o.order_date).toLocaleString()}</td>
        <td>
          <button onclick="deleteOrder(${o.id})">Delete</button>
        </td>
      `;
      ordersTable.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    ordersTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">Error loading orders</td></tr>`;
  }
}

// ================== UPDATE STATUS ==================
async function updateStatus(id, status) {
  try {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update status");
    alert("Status updated ✅");
  } catch (err) {
    console.error(err);
    alert("Failed to update status ❌");
  }
}

// ================== DELETE ORDER ==================
async function deleteOrder(id) {
  if (!confirm("Delete this order?")) return;
  try {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete order");
    alert("Order deleted ✅");
    loadOrders(searchInput.value.trim());
  } catch (err) {
    console.error(err);
    alert("Failed to delete order ❌");
  }
}

// ================== SEARCH ==================
searchInput.addEventListener("input", () => {
  loadOrders(searchInput.value.trim());
});

// ================== INITIAL LOAD ==================
loadOrders();
