// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();

  const mpesaRadio = document.getElementById("mpesaRadio");
  const cashRadio = document.getElementById("cashRadio");
  const mpesaDetails = document.getElementById("mpesaDetails");
  const mpesaOption = document.getElementById("mpesaOption");
  const mpesaInstructions = document.getElementById("mpesaInstructions");
  const transactionCodeInput = document.getElementById("transactionCode");

  if (!mpesaRadio || !cashRadio || !mpesaDetails) {
    console.error("Payment elements missing in checkout.html");
    return;
  }

  // Show Mpesa section
  mpesaRadio.addEventListener("change", () => {
    mpesaDetails.style.display = "block";
    if (mpesaOption) mpesaOption.required = true;
    if (transactionCodeInput) transactionCodeInput.required = true;
  });

  // Hide Mpesa section
  cashRadio.addEventListener("change", () => {
    mpesaDetails.style.display = "none";
    if (mpesaOption) {
      mpesaOption.value = "";
      mpesaOption.required = false;
    }
    if (mpesaInstructions) mpesaInstructions.innerHTML = "";
    if (transactionCodeInput) {
      transactionCodeInput.value = "";
      transactionCodeInput.required = false;
    }
  });

  // Mpesa instructions
  if (mpesaOption) {
    mpesaOption.addEventListener("change", () => {
      if (mpesaOption.value === "paybill") {
        mpesaInstructions.innerHTML = `
          <strong>Paybill Instructions</strong>
          <ol>
            <li>Mpesa → Lipa na Mpesa → Paybill</li>
            <li>Paybill Number: <b>123456</b></li>
            <li>Account: <b>Your Phone Number</b></li>
            <li>Confirm payment</li>
          </ol>
        `;
      } else if (mpesaOption.value === "till") {
        mpesaInstructions.innerHTML = `
          <strong>Till Instructions</strong>
          <ol>
            <li>Mpesa → Buy Goods</li>
            <li>Till Number: <b>654321</b></li>
            <li>Confirm payment</li>
          </ol>
        `;
      } else {
        mpesaInstructions.innerHTML = "";
      }
    });
  }
});

// ================== ORDER SUMMARY ==================
function renderOrderSummary() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const orderSummary = document.getElementById("order-summary");

  orderSummary.innerHTML = "";
  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";

  cart.forEach(item => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    li.innerHTML = `
      ${item.name} x ${item.qty}
      <span style="float:right">KSh ${(item.price * item.qty).toLocaleString()}</span>
    `;
    ul.appendChild(li);
  });

  orderSummary.appendChild(ul);
  orderSummary.innerHTML += `<h3>Total: KSh ${total.toLocaleString()}</h3>`;
}

// ================== PLACE ORDER ==================
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = getUser();
  if (!user) {
    alert("Login required");
    return;
  }

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let total = 0;
  cart.forEach(p => total += p.price * p.qty);

  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }

  const paymentMethod = selectedPayment.value;
  const transactionCodeInput = document.getElementById("transactionCode");
  const transactionCode = transactionCodeInput?.value.trim() || null;

  // Mpesa requires transaction code
  if (paymentMethod === "mpesa" && !transactionCode) {
    alert("Please enter your Mpesa transaction code.");
    transactionCodeInput.focus();
    return;
  }

  // SEND TO BACKEND
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        total_amount: total,
        transaction_code: paymentMethod === "mpesa" ? transactionCode : null
      })
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Order failed ❌ " + (err.error || ""));
      return;
    }

    localStorage.removeItem(cartKey);
    alert("Order placed successfully ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    alert("Order failed ❌ Check console for details");
  }
});
