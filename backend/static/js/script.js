// ==========================================
// Home Page Featured Products
// ==========================================

const productGrid = document.getElementById("productGrid");

if (productGrid) {

    let html = "";

    // Show only first 4 products
    products.slice(0, 4).forEach(product => {

        html += `

        <div class="product-card" data-id="${product.id}">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <div class="rating">

                ${"★".repeat(product.rating)}

                <span>(${product.reviews})</span>

            </div>

            <div class="price">

                <span class="new-price">$${product.price}</span>

                <span class="old-price">$${product.oldPrice}</span>

            </div>

            <button class="add-cart-btn" data-id="${product.id}">

                <i class="fa-solid fa-cart-shopping"></i>

                Add to Cart

            </button>

        </div>

        `;

    });

    productGrid.innerHTML = html;

    attachHomeEvents();

}

// ==========================================
// Events
// ==========================================

function attachHomeEvents() {

    // Open Product Details

    document.querySelectorAll(".product-card").forEach(card => {

        card.addEventListener("click", () => {

            window.location.href = `/product-details?id=${card.dataset.id}`;

        });

    });

    // Add To Cart

    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            const id = Number(button.dataset.id);

            const product = products.find(p => p.id === id);

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(item => item.id === id);

            if (existing) {

                existing.quantity++;

            } else {

                cart.push({
                    ...product,
                    quantity: 1
                });

            }

            localStorage.setItem("cart", JSON.stringify(cart));

            updateBadge();

            alert(product.name + " added to cart!");

        });

    });

    updateBadge();

}

// ==========================================
// Cart Badge
// ==========================================

function updateBadge() {

    const badge = document.querySelector(".cart span");

    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    badge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

}