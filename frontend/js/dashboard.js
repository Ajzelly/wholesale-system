document.addEventListener("DOMContentLoaded", loadDashboard);


async function loadDashboard(){

  const user = getUser();

  if(!user){
    window.location.href="login.html";
    return;
  }


  document.getElementById("username").textContent = user.name;


  const cartKey = `cart_${user.id}`;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];


  // LOAD ORDERS
  const res = await fetch("/api/orders");
  const orders = await res.json();


  // Filter only this user's orders
  const myOrders = orders.filter(o => o.user_id == user.id);


  // ================= STATS =================

  document.getElementById("orderCount").textContent =
    myOrders.length;

  document.getElementById("cartCount").textContent =
    cart.length;

  document.getElementById("pendingCount").textContent =
    myOrders.filter(o=>o.status==="pending").length;


  let balance = 0;

  myOrders.forEach(o=>{
    balance += Number(o.total_amount);
  });

  document.getElementById("balance").textContent =
    balance.toLocaleString();


  // ================= TABLE =================

  const table = document.getElementById("ordersTable");

  table.innerHTML = "";


  if(myOrders.length === 0){

    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          No orders yet
        </td>
      </tr>
    `;

    return;
  }


  myOrders.forEach(o=>{

    const tr = document.createElement("tr");

    tr.innerHTML = `

      <td>#${o.id}</td>

      <td>
        ${new Date(o.order_date).toLocaleDateString()}
      </td>

      <td>
        KSh ${Number(o.total_amount).toLocaleString()}
      </td>

      <td>
        ${o.status}
      </td>

    `;

    table.appendChild(tr);

  });

}
