const table = document.getElementById("ordersTable");


async function loadOrders() {

  const res = await fetch("/api/orders");
  const orders = await res.json();

  table.innerHTML = "";

  orders.forEach(o => {

    table.innerHTML += `

      <tr>

        <td>${o.id}</td>

        <td>${o.customer}</td>

        <td>${Number(o.total_amount).toLocaleString()}</td>

        <td>
          <select onchange="updateStatus(${o.id}, this.value)">
            <option ${o.status=="pending"?"selected":""}>pending</option>
            <option ${o.status=="confirmed"?"selected":""}>confirmed</option>
            <option ${o.status=="delivered"?"selected":""}>delivered</option>
            <option ${o.status=="cancelled"?"selected":""}>cancelled</option>
          </select>
        </td>

        <td>${new Date(o.order_date).toLocaleString()}</td>

        <td>
          <button onclick="deleteOrder(${o.id})">Delete</button>
        </td>

      </tr>

    `;

  });

}


async function updateStatus(id, status){

  await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  alert("Status Updated");

}


async function deleteOrder(id){

  if(!confirm("Delete this order?")) return;

  await fetch(`/api/orders/${id}`, {
    method: "DELETE"
  });

  loadOrders();

}


loadOrders();
