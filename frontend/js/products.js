function addToCart(id, name, price, image) {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const cartKey = `cart_${user.id}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      qty: 1
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(`Added ${name} to cart`);
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        ${p.is_hot == 1 ? '<span class="badge hot">HOT</span>' : ''}
        ${p.is_sale == 1 ? '<span class="badge sale">SALE</span>' : ''}
        <img src="/uploads/${p.image || 'placeholder.jpg'}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>KSh ${Number(p.price).toLocaleString()}</p>
        <button class="add-btn"
          onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
