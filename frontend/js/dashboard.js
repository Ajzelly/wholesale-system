// USER DASHBOARD


// MOCK DATA (replace with API later)

const user = {
  name: "Samuel"
};

const orders = [
  { id: 101, date: "2026-01-12", total: 5400, status: "Delivered" },
  { id: 102, date: "2026-01-20", total: 3200, status: "Pending" },
  { id: 103, date: "2026-01-25", total: 8700, status: "Delivered" }
];

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