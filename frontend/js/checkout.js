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

  const toggleMpesaSection = (show) => {
    mpesaDetails.style.display = show ? "block" : "none";
    if (mpesaOption) mpesaOption.required = show;
    if (transactionCodeInput) transactionCodeInput.required = show;
    if (!show) {
      if (mpesaOption) mpesaOption.value = "";
      if (mpesaInstructions) mpesaInstructions.innerHTML = "";
      if (transactionCodeInput) transactionCodeInput.value = "";
    }
  };

  mpesaRadio.addEventListener("change", () => toggleMpesaSection(true));
  cashRadio.addEventListener("change", () => toggleMpesaSection(false));

  if (mpesaOption) {
    mpesaOption.addEventListener("change", () => {
      const instructions = {
        paybill: `
          <strong>Paybill Instructions</strong>
          <ol>
            <li>Mpesa → Lipa na Mpesa → Paybill</li>
            <li>Paybill Number: <b>123456</b></li>
            <li>Account: <b>Your Phone Number</b></li>
            <li>Confirm payment</li>
          </ol>
        `,
        till: `
          <strong>Till Instructions</strong>
          <ol>
            <li>Mpesa → Buy Goods</li>
            <li>Till Number: <b>654321</b></li>
            <li>Confirm payment</li>
          </ol>
        `
      };
      mpesaInstructions.innerHTML = instructions[mpesaOption.value] || "";
    });
  }
});

// ================== ORDER SUMMARY ==================
function renderOrderSummary() {
  const user = getUser();
  if (!user) return window.location.href = "login.html";

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const orderSummary = document.getElementById("order-summary");

  orderSummary.innerHTML = "";
  if (!cart.length) return orderSummary.innerHTML = "<p>Your cart is empty.</p>";

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
  if (!user) return alert("Login required");

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (!cart.length) return alert("Cart is empty");

  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  if (!selectedPayment) return alert("Please select a payment method");

  const paymentMethod = selectedPayment.value;
  const transactionCode = document.getElementById("transactionCode")?.value.trim() || null;
  if (paymentMethod === "mpesa" && !transactionCode) {
    alert("Please enter your Mpesa transaction code.");
    document.getElementById("transactionCode").focus();
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        total_amount: total,
        transaction_code: paymentMethod === "mpesa" ? transactionCode : null,
        items: cart // <-- send entire cart to backend
      })
    });

    if (!res.ok) {
      const err = await res.json();
      return alert("Order failed ❌ " + (err.error || ""));
    }

    localStorage.removeItem(cartKey);
    alert("Order placed successfully ✅");
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    alert("Order failed ❌ Check console for details");
  }
});

const loadingEl = document.getElementById("order-loading");

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = getUser();
  if (!user) return alert("Login required");

  const cartKey = `cart_${user.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (!cart.length) return alert("Cart is empty");

  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  if (!selectedPayment) return alert("Please select a payment method");

  const paymentMethod = selectedPayment.value;
  const transactionCode = document.getElementById("transactionCode")?.value.trim() || null;
  if (paymentMethod === "mpesa" && !transactionCode) {
    alert("Please enter your Mpesa transaction code.");
    document.getElementById("transactionCode").focus();
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    // ✅ Show loader & disable button
    loadingEl.style.display = "block";
    checkoutForm.querySelector("button[type='submit']").disabled = true;

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        total_amount: total,
        transaction_code: paymentMethod === "mpesa" ? transactionCode : null,
        items: cart
      })
    });

    loadingEl.style.display = "none";
    checkoutForm.querySelector("button[type='submit']").disabled = false;

    if (!res.ok) {
      const err = await res.json();
      return alert("Order failed ❌ " + (err.error || ""));
    }

    localStorage.removeItem(cartKey);
    alert("Order placed successfully ✅");
    window.location.href = "dashboard.html";

  } catch (err) {
    loadingEl.style.display = "none";
    checkoutForm.querySelector("button[type='submit']").disabled = false;

    console.error("PLACE ORDER ERROR:", err);
    alert("Order failed ❌ Check console for details");
  }
});
