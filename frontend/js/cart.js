// Render cart items from localStorage
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItems = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  let total = 0;
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = 'KSh 0.00';
    return;
  }

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/70'">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-qty">
          <label>Qty: </label>
          <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="qty-input">
        </div>
      </div>
      <div>KSh ${(item.price * item.qty).toLocaleString()}</div>
      <button class="cart-item-remove" data-idx="${idx}">Remove</button>
    `;
    cartItems.appendChild(div);
  });
  document.getElementById('cart-total').textContent = 'KSh ' + total.toLocaleString();

  // Quantity change
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', function() {
      let val = parseInt(this.value);
      if (val < 1) val = 1;
      cart[this.dataset.idx].qty = val;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
  // Remove item
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      cart.splice(this.dataset.idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

// Go to checkout
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    window.location.href = 'checkout.html';
  });
}

document.addEventListener('DOMContentLoaded', renderCart);
