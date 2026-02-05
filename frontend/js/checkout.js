document.addEventListener("DOMContentLoaded", renderOrderSummary);

function renderOrderSummary() {

  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const cartKey = `cart_${user.id}`;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const orderSummary = document.getElementById("order-summary");

  let total = 0;

  orderSummary.innerHTML = '';

  if (cart.length === 0) {
    orderSummary.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = "0";

  cart.forEach(item => {

    total += item.price * item.qty;

    const li = document.createElement('li');

    li.style.marginBottom = "10px";

    li.innerHTML = `
      ${item.name} x ${item.qty}
      <span style="float:right">
        KSh ${(item.price * item.qty).toLocaleString()}
      </span>
    `;

    ul.appendChild(li);

  });

  orderSummary.appendChild(ul);

  orderSummary.innerHTML += `
    <h3>Total: KSh ${total.toLocaleString()}</h3>
  `;
}



// ================= PLACE ORDER =================

const checkoutForm = document.getElementById('checkout-form');

checkoutForm.addEventListener('submit', async function(e){

  e.preventDefault();

  const user = getUser();

  if (!user) {
    alert("Login required");
    return;
  }

  const cartKey = `cart_${user.id}`;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }

  let total = 0;

  cart.forEach(p=>{
    total += p.price * p.qty;
  });


  // Send to backend
  const res = await fetch("/api/orders", {

    method: "POST",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({

      user_id: user.id,
      total_amount: total

    })

  });


  if(!res.ok){
    alert("Order failed ❌");
    return;
  }


  // Clear cart
  localStorage.removeItem(cartKey);

  alert("Order placed successfully ✅");

  window.location.href = "dashboard.html";

});
