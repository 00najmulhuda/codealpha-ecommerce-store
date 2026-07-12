// ==========================================
// NovaCart Products Page (Backend Version)
// ==========================================

const API_URL = "http://127.0.0.1:8000/products/";

let products = [];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryList = document.querySelectorAll("#categoryList li");

// ==========================================
// Load Products From Backend
// ==========================================

async function loadProducts() {
    try {

        const response = await fetch(API_URL);
        products = await response.json();

        // Add default values because backend doesn't send these
        products = products.map(product => ({
            ...product,
            brand: product.category,
            rating: 5,
            reviews: 120,
            oldPrice: Math.round(product.price * 1.2)
        }));

        renderProducts(products);

    } catch (error) {
        console.error("Error loading products:", error);

        if (productsGrid) {
            productsGrid.innerHTML = `
                <h2 style="text-align:center;padding:40px;">
                    Failed to load products.
                </h2>
            `;
        }
    }
}

loadProducts();

// ==========================================
// Category Filter
// ==========================================

categoryList.forEach(item => {

    item.addEventListener("click", () => {

        const category = item.dataset.category;

        if (category === "All Products") {

            renderProducts(products);
            return;

        }

        const filtered = products.filter(product =>
            product.category === category
        );

        renderProducts(filtered);

    });

});

// ==========================================
// Search
// ==========================================

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

// ==========================================
// Sort
// ==========================================

if (sortSelect) {
    sortSelect.addEventListener("change", applyFilters);
}

// ==========================================
// Search + Sort
// ==========================================

function applyFilters() {

    let filteredProducts = [...products];

    const keyword = searchInput.value.toLowerCase().trim();

    if (keyword) {

        filteredProducts = filteredProducts.filter(product =>

            product.name.toLowerCase().includes(keyword) ||

            product.category.toLowerCase().includes(keyword)

        );

    }

    const sortValue = sortSelect.value;

    if (sortValue === "low-high") {

        filteredProducts.sort((a, b) => a.price - b.price);

    }

    if (sortValue === "high-low") {

        filteredProducts.sort((a, b) => b.price - a.price);

    }

    renderProducts(filteredProducts);

}

// ==========================================
// Render Products
// ==========================================

function renderProducts(productList) {

    if (!productsGrid) return;

    let html = "";

    productList.forEach(product => {

        html += `

        <div class="product-card" data-id="${product.id}">

            <i class="fa-regular fa-heart wishlist"></i>

            <img src="/static/images/${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <div class="rating">

                ${"★".repeat(product.rating)}

                <span style="color:#777;font-size:14px;">
                    (${product.reviews})
                </span>

            </div>

            <div class="price">

                <span class="new-price">
                    $${product.price}
                </span>

                <span class="old-price">
                    $${product.oldPrice}
                </span>

            </div>

            <button
                class="add-cart-btn"
                data-id="${product.id}">

                <i class="fa-solid fa-cart-shopping"></i>

                Add to Cart

            </button>

        </div>

        `;

    });

    productsGrid.innerHTML = html;

    attachEvents();

}

// ==========================================
// Events
// ==========================================

function attachEvents() {

    document.querySelectorAll(".product-card").forEach(card => {

        card.addEventListener("click", () => {

            window.location.href = `/product-details?id=${card.dataset.id}`;

        });

    });

    document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", async (event) => {

        event.stopPropagation();

        const id = Number(button.dataset.id);

        try {

            const response = await fetch("http://127.0.0.1:8000/cart/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: 1,
                    product_id: id,
                    quantity: 1
                })

            });

            const result = await response.json();

            alert(result.message);

        } catch (error) {

            console.error(error);

            alert("Unable to add product to cart.");

        }

    });

});
    updateCartBadge();

}

// ==========================================
// Cart Badge
// ==========================================

function updateCartBadge() {

    const badge = document.querySelector(".cart-btn span");

    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce((sum, item) => {

        return sum + item.quantity;

    }, 0);

    badge.innerText = totalItems;

}