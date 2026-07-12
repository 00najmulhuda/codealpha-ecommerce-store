// =======================================
// NovaCart Cart System (Backend)
// =======================================

const API = "http://127.0.0.1:8000/cart/";

let cart = [];

async function loadCart() {

    const response = await fetch(API);
    cart = await response.json();

    renderCart();
}

function updateCartCount() {

    const badge = document.querySelector(".cart-btn span");

    if (badge) {

        badge.innerText = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    }

}

function renderCart() {

    const container = document.querySelector(".cart-items");

    if (!container) return;

    container.innerHTML = "<h2>Your Shopping Cart</h2>";

    if (cart.length === 0) {

        container.innerHTML += `
            <div style="padding:60px;text-align:center">
                <h2>Your Cart is Empty</h2>
            </div>
        `;

        document.querySelectorAll(".summary-row span:last-child")[0].innerText = "$0.00";
        document.querySelectorAll(".summary-row span:last-child")[1].innerText = "Free";
        document.querySelectorAll(".summary-row span:last-child")[2].innerText = "$0.00";
        document.querySelector(".summary-total span:last-child").innerText = "$0.00";

        updateCartCount();

        return;

    }

    let subtotal = 0;

    cart.forEach((item) => {

        subtotal += item.product.price * item.quantity;

        container.innerHTML += `

        <div class="cart-item">

            <img src="/static/images/${item.product.image}" alt="${item.product.name}">

            <div class="cart-info">

                <h3>${item.product.name}</h3>

                <p>${item.product.category}</p>

                <span>$${item.product.price}</span>

            </div>

            <div class="quantity">

                <button onclick="decreaseQuantity(${item.cart_id})">-</button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${item.cart_id}, ${item.quantity})">+</button>

            </div>

            <div class="subtotal">

                $${(item.product.price * item.quantity).toFixed(2)}

            </div>

            <button class="remove" onclick="removeItem(${item.cart_id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.querySelectorAll(".summary-row span:last-child")[0].innerText =
        "$" + subtotal.toFixed(2);

    document.querySelectorAll(".summary-row span:last-child")[1].innerText =
        "Free";

    document.querySelectorAll(".summary-row span:last-child")[2].innerText =
        "$" + tax.toFixed(2);

    document.querySelector(".summary-total span:last-child").innerText =
        "$" + total.toFixed(2);

    updateCartCount();

}

async function increaseQuantity(cartId, quantity) {

    await fetch(API + cartId, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            quantity: quantity + 1
        })

    });

    loadCart();

}

async function decreaseQuantity(cartId, quantity) {

    if (quantity > 1) {

        await fetch(API + cartId, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                quantity: quantity - 1
            })

        });

    } else {

        await fetch(API + cartId, {
            method: "DELETE"
        });

    }

    loadCart();

}

async function removeItem(cartId) {

    await fetch(API + cartId, {
        method: "DELETE"
    });

    loadCart();

}

loadCart();