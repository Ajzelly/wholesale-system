// Render order summary from cart
function renderOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderSummary = document.getElementById('order-summary');
  let total = 0;
  orderSummary.innerHTML = '';

  if (cart.length === 0) {
    orderSummary.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.style.marginBottom = '10px';
    li.innerHTML = `<strong>${item.name}</strong> x ${item.qty} <span style="float:right">KSh ${(item.price * item.qty).toLocaleString()}</span>`;
    ul.appendChild(li);
  });
  orderSummary.appendChild(ul);
  const totalDiv = document.createElement('div');
  totalDiv.style.marginTop = '15px';
  totalDiv.innerHTML = `<strong>Total: KSh ${total.toLocaleString()}</strong>`;
  orderSummary.appendChild(totalDiv);
}

// Handle checkout form submit
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // In real app, send order to backend here
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
  });
}

document.addEventListener('DOMContentLoaded', renderOrderSummary);
