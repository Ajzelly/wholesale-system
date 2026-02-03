// PRODUCTS DATA
const products = [

  {
    id: 1,
    name: "Premium Irish Potatoes (50kg)",
    price: 3500,
    category: "vegetables",
    image: "assets/images/product1.jpg"
  },

  {
    id: 2,
    name: "Vegetable Cooking Oil (20L)",
    price: 4200,
    category: "oil",
    image: "assets/images/product2.jpg"
  },

  {
    id: 3,
    name: "Pishori Rice Grade 1 (25kg)",
    price: 5100,
    category: "grains",
    image: "assets/images/product3.jpg"
  },

  {
    id: 4,
    name: "Kabras Sugar (50kg)",
    price: 6800,
    category: "sugar",
    image: "assets/images/product4.jpg"
  }

];


// GET ELEMENTS
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");


// SHOW PRODUCTS
function displayProducts(list) {

  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {

    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `

      <img src="${product.image}"
           onerror="this.src='https://via.placeholder.com/200'">

      <div class="product-info">

        <h3>${product.name}</h3>

        <p class="price">
          KSh ${product.price.toLocaleString()}
        </p>

        <button class="add-btn">
          Add to Cart
        </button>

      </div>
    `;

    // Add event to button: go to cart.html
    const addBtn = div.querySelector('.add-btn');
    addBtn.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
    productGrid.appendChild(div);

  });

}


// FILTER
function filterProducts() {

  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;


  const filtered = products.filter(p => {

    // Search
    const matchSearch =
      p.name.toLowerCase().includes(search);

    // Category
    const matchCategory =
      category === "all" ||
      p.category === category;

    // Price
    let matchPrice = true;

    if (price === "low") {
      matchPrice = p.price < 4000;
    }

    if (price === "mid") {
      matchPrice = p.price >= 4000 &&
                   p.price <= 6000;
    }

    if (price === "high") {
      matchPrice = p.price > 6000;
    }

    return matchSearch &&
           matchCategory &&
           matchPrice;

  });

  displayProducts(filtered);

}


// EVENTS
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);


// LOAD ON START
displayProducts(products);
