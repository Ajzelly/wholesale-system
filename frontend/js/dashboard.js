const cart = JSON.parse(localStorage.getItem("cart")) || [];
const user = JSON.parse(localStorage.getItem("user"));


// ================= LOAD USER =================
if(user){
  document.getElementById("username").textContent = user.name;
}


// ================= LOAD ORDERS =================
async function loadDashboard(){

  const res = await fetch("/api/orders");
  const orders = await res.json();

  // Filter only this user's orders
  const myOrders = orders.filter(o => o.user_id == user.id);


  // STATS
  document.getElementById("orderCount").textContent =
    myOrders.length;

  document.getElementById("cartCount").textContent =
    cart.length;

  document.getElementById("pendingCount").textContent =
    myOrders.filter(o=>o.status==="pending").length;

  document.getElementById("balance").textContent = "0";


  // TABLE
  const table = document.getElementById("ordersTable");

  table.innerHTML = "";

  myOrders.forEach(o=>{

    table.innerHTML += `

      <tr>
        <td>#${o.id}</td>
        <td>${new Date(o.order_date).toLocaleDateString()}</td>
        <td>KSh ${Number(o.total_amount).toLocaleString()}</td>
        <td>${o.status}</td>
      </tr>

    `;

  });

}

loadDashboard();
