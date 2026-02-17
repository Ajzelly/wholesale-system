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


let allProducts = [];

async function loadProducts() {
  const res = await fetch("/api/products");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  if (products.length === 0) {
    grid.innerHTML = '<div class="no-results">No products found.</div>';
    return;
  }
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


document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  const searchInput = document.getElementById("product-search");
  const autocompleteList = document.getElementById("autocomplete-list");
  const searchIcon = document.getElementById("search-icon");
  function triggerSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (q) {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
      renderProducts(filtered);
      autocompleteList.style.display = "none";
    } else {
      renderProducts(allProducts);
      autocompleteList.style.display = "none";
    }
  }

  function showAutocomplete(q) {
    if (!q) {
      autocompleteList.style.display = "none";
      autocompleteList.innerHTML = "";
      return;
    }
    const suggestions = allProducts.filter(p =>
      p.name.toLowerCase().includes(q)
    );
    if (suggestions.length === 0) {
      autocompleteList.style.display = "none";
      autocompleteList.innerHTML = "";
      return;
    }
    autocompleteList.innerHTML = suggestions.map(p =>
      `<div class="autocomplete-item">
        <img src="/uploads/${p.image || 'placeholder.jpg'}" alt="${p.name}" style="width:32px;height:32px;border-radius:8px;margin-right:10px;vertical-align:middle;object-fit:cover;" />
        <span>${p.name}</span>
      </div>`
    ).join("");
    autocompleteList.style.display = "block";
    // Add click handler
    Array.from(autocompleteList.children).forEach((item, idx) => {
      item.addEventListener("click", () => {
        searchInput.value = suggestions[idx].name;
        autocompleteList.style.display = "none";
        renderProducts([suggestions[idx]]);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.trim().toLowerCase();
      showAutocomplete(q);
      // Show filtered products as you type
      if (q) {
        const filtered = allProducts.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
        renderProducts(filtered);
      } else {
        renderProducts(allProducts);
      }
    });

    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        triggerSearch();
      }
    });
    if (searchIcon) {
      searchIcon.addEventListener("click", triggerSearch);
    }
    // Hide autocomplete when clicking outside
    document.addEventListener("click", e => {
      if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.style.display = "none";
      }
    });
  }
});
