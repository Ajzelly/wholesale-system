// cart.js — USER-BASED CART (FINAL)

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const cartKey = `cart_${user.id}`;
  const cartItemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  function renderCart() {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cartItemsEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        `<div style="text-align:center;font-size:1.1rem;margin:20px;">
          Your cart is empty 😢
        </div>`;
      totalEl.textContent = "KSh 0";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="/uploads/${item.image || "placeholder.jpg"}"
             class="cart-item-img"
             onerror="this.src='https://via.placeholder.com/70'">

        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-qty">
            Qty:
            <input type="number" min="1" value="${item.qty}" data-index="${index}">
          </div>
        </div>

        <div>KSh ${(item.price * item.qty).toLocaleString()}</div>
        <button class="cart-item-remove" data-index="${index}">
          Remove
        </button>
      `;

      cartItemsEl.appendChild(div);
    });

    totalEl.textContent = "KSh " + total.toLocaleString();

    // Qty change
    document.querySelectorAll(".cart-item-qty input").forEach(input => {
      input.addEventListener("change", e => {
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const idx = e.target.dataset.index;
        cart[idx].qty = Math.max(1, parseInt(e.target.value));
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCart();
      });
    });

    // Remove item
    document.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.addEventListener("click", e => {
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cart.splice(e.target.dataset.index, 1);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
});
