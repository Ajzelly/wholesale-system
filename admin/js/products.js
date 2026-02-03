// ADMIN PRODUCTS SYSTEM

let products = [];


// ELEMENTS
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");


// LOAD DATA
function loadProducts() {

  const data = localStorage.getItem("admin_products");

  if (data) {
    products = JSON.parse(data);
  }

  renderTable();
}


// SAVE DATA
function saveProducts() {
  localStorage.setItem(
    "admin_products",
    JSON.stringify(products)
  );
}


// DISPLAY TABLE
function renderTable() {

  table.innerHTML = "";

  products.forEach((p, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `

      <td>
        <img src="${p.image}"
             width="50"
             height="50"
             style="object-fit:cover">
      </td>

      <td>${p.name}</td>

      <td>KSh ${p.price}</td>

      <td>${p.category}</td>

      <td>

        <button class="edit-btn"
          onclick="editProduct(${index})">
          Edit
        </button>

        <button class="delete-btn"
          onclick="deleteProduct(${index})">
          Delete
        </button>

      </td>
    `;

    table.appendChild(row);

  });

}


// ADD / UPDATE
form.addEventListener("submit", function(e){

  e.preventDefault();

  const id = idInput.value;

  const name = nameInput.value.trim();
  const price = priceInput.value;
  const category = categoryInput.value;

  let image = "https://via.placeholder.com/150";


  if (imageInput.files[0]) {
    image = URL.createObjectURL(
      imageInput.files[0]
    );
  }


  // NEW PRODUCT
  if (id === "") {

    products.push({
      name,
      price,
      category,
      image
    });

  }

  // UPDATE
  else {

    products[id] = {
      name,
      price,
      category,
      image
    };

  }


  saveProducts();
  renderTable();

  form.reset();
  idInput.value = "";

});


// EDIT
function editProduct(index) {

  const p = products[index];

  idInput.value = index;
  nameInput.value = p.name;
  priceInput.value = p.price;
  categoryInput.value = p.category;

}


// DELETE
function deleteProduct(index) {

  if (confirm("Delete this product?")) {

    products.splice(index, 1);

    saveProducts();
    renderTable();

  }

}


// INIT
loadProducts();
