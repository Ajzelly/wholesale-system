const form = document.getElementById("productForm");
const table = document.getElementById("productTable");

let editProductId = null;


// LOAD PRODUCTS
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  table.innerHTML = "";

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>
          <img src="/uploads/${p.image || 'placeholder.jpg'}?v=${Date.now()}" 
               width="50">
        </td>
        <td>${p.name}</td>
        <td>KSh ${Number(p.price).toLocaleString()}</td>
        <td>${p.category_id}</td>
        <td>${p.is_hot == 1 ? '🔥' : ''} ${p.is_sale == 1 ? '💸' : ''}</td>
        <td>
          <button onclick="editProduct(${p.id})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}


// EDIT
async function editProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.querySelector("input[name='category_id']").value = product.category_id;
  document.querySelector("textarea[name='description']").value = product.description;
  document.querySelector("input[name='stock']").value = product.stock;

  document.getElementById("is_hot").checked = product.is_hot == 1;
  document.getElementById("is_sale").checked = product.is_sale == 1;

  editProductId = id;
  document.querySelector("button[type='submit']").textContent = "Update Product";

  window.scrollTo({ top: 0, behavior: "smooth" });
}


// SAVE / UPDATE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  data.append("is_hot", document.getElementById('is_hot').checked ? 1 : 0);
  data.append("is_sale", document.getElementById('is_sale').checked ? 1 : 0);

  const url = editProductId
    ? `/api/products/${editProductId}`
    : "/api/products";

  const method = editProductId ? "PUT" : "POST";

  const response = await fetch(url, {
    method: method,
    body: data
  });

  const result = await response.json();

  if (response.ok) {
    alert(editProductId ? "Product updated!" : "Product added!");

    form.reset();
    editProductId = null;
    document.querySelector("button[type='submit']").textContent = "Save";

    loadProducts();
  } else {
    alert("Error: " + result.error);
  }
});


// DELETE
async function deleteProduct(id) {
  if (!confirm("Delete product?")) return;

  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProducts();
}


loadProducts();
