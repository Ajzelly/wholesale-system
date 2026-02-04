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
        <button>Add to Cart</button>
      </div>
    `;
  });
}

loadProducts();
