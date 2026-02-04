const form = document.getElementById("productForm");
const table = document.getElementById("productTable");

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  table.innerHTML = "";

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td><img src="/uploads/${p.image || 'placeholder.jpg'}" alt="${p.name}" width="50"></td>
        <td>${p.name}</td>
        <td>KSh ${Number(p.price).toLocaleString()}</td>
        <td>${p.category_id}</td>
        <td>${p.is_hot == 1 ? '🔥' : ''} ${p.is_sale == 1 ? '💸' : ''}</td>
        <td><button onclick="deleteProduct(${p.id})">Delete</button></td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  data.append("is_hot", document.getElementById('is_hot').checked ? 1 : 0);
  data.append("is_sale", document.getElementById('is_sale').checked ? 1 : 0);

  await fetch("/api/products", {
    method: "POST",
    body: data
  });

  alert("Saved");
  form.reset();
  loadProducts();
});

async function deleteProduct(id) {
  if (!confirm("Delete product?")) return;

  await fetch(`/api/products/${id}`, {
    method: "DELETE"
  });

  loadProducts();
}

loadProducts();
