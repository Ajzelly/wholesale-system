// USER DASHBOARD
const cart = JSON.parse(localStorage.getItem("cart")) || [];


// LOAD USER
document.getElementById("username").textContent = user.name;


// STATS
document.getElementById("orderCount").textContent = orders.length;

document.getElementById("cartCount").textContent = cart.length;

document.getElementById("pendingCount").textContent =
  orders.filter(o => o.status === "Pending").length;

document.getElementById("balance").textContent = "0";


// LOAD ORDERS
const table = document.getElementById("ordersTable");

orders.forEach(o => {

  const row = document.createElement("tr");

  row.innerHTML = `

    <td>#${o.id}</td>
    <td>${o.date}</td>
    <td>KSh ${o.total}</td>
    <td>${o.status}</td>

  `;

  table.appendChild(row);

});


// LOGOUT
document.getElementById("logoutBtn")
  .addEventListener("click", () => {

    localStorage.clear();
    window.location.href = "login.html";

});

const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });