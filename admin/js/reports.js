document.addEventListener("DOMContentLoaded", loadReports);


async function loadReports(){

  try{

    /* =========================
       FETCH ORDERS
    ========================== */

    const res = await fetch('/api/orders');

    if(!res.ok){
      throw new Error('Failed to load orders');
    }

    const orders = await res.json();


    /* =========================
       SUMMARY
    ========================== */

    document.getElementById("totalOrders").textContent =
      orders.length;


    let revenue = 0;
    let pending = 0;
    let delivered = 0;

    orders.forEach(o => {

      revenue += Number(o.total_amount);

      if(o.status === "pending"){
        pending++;
      }

      if(o.status === "delivered"){
        delivered++;
      }

    });


    document.getElementById("totalRevenue").textContent =
      revenue.toLocaleString();

    document.getElementById("pendingOrders").textContent =
      pending;

    document.getElementById("deliveredOrders").textContent =
      delivered;



    /* =========================
       RECENT ORDERS
    ========================== */

    const recentTable = document.getElementById("recentOrders");

    recentTable.innerHTML = "";


    orders.slice(0,10).forEach(o => {

      const tr = document.createElement("tr");

      tr.innerHTML = `

        <td>#${o.id}</td>

        <td>
          ${o.user_name || "Customer"}
        </td>

        <td>
          ${new Date(o.order_date).toLocaleDateString()}
        </td>

        <td>
          ${o.status}
        </td>

        <td>
          KSh ${Number(o.total_amount).toLocaleString()}
        </td>

      `;

      recentTable.appendChild(tr);

    });



    /* =========================
       TOP PRODUCTS
    ========================== */

    const productMap = {};


    orders.forEach(order => {

      if(!order.items) return;

      order.items.forEach(item => {

        if(!productMap[item.product_name]){

          productMap[item.product_name] = {
            qty:0,
            total:0
          };

        }

        productMap[item.product_name].qty += item.quantity;

        productMap[item.product_name].total +=
          item.quantity * item.price;

      });

    });


    const sortedProducts =
      Object.entries(productMap)
        .sort((a,b)=> b[1].qty - a[1].qty)
        .slice(0,5);


    const productTable =
      document.getElementById("topProducts");

    productTable.innerHTML = "";


    sortedProducts.forEach(p => {

      const tr = document.createElement("tr");

      tr.innerHTML = `

        <td>${p[0]}</td>

        <td>${p[1].qty}</td>

        <td>KSh ${p[1].total.toLocaleString()}</td>

      `;

      productTable.appendChild(tr);

    });


  }catch(err){

    console.error("❌ REPORT ERROR:", err);

    alert("Failed to load reports");

  }

}
