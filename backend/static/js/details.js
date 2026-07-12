// ==========================================
// Product Details Page (Backend Version)
// ==========================================

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const PRODUCT_API = `http://127.0.0.1:8000/products/${productId}`;
const CART_API = "http://127.0.0.1:8000/cart/";

async function loadProduct() {

    try {

        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

        document.getElementById("productName").innerText = product.name;

        document.getElementById("productImage").src =
            `/static/images/${product.image}`;

        document.getElementById("productImage").alt =
            product.name;

        document.getElementById("productPrice").innerText =
            "$" + product.price;

        document.getElementById("productOldPrice").innerText =
            "$" + Math.round(product.price * 1.2);

        document.getElementById("productDescription").innerText =
            product.description;

        const addBtn = document.getElementById("addToCartBtn");

        if (addBtn) {

            addBtn.onclick = async () => {

                try {

                    const response = await fetch(CART_API, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            user_id: 1,
                            product_id: product.id,
                            quantity: 1
                        })

                    });

                    const result = await response.json();

                    alert(result.message);

                } catch (error) {

                    console.error(error);

                    alert("Unable to add product to cart.");

                }

            };

        }

    } catch (error) {

        console.error(error);

    }

}

loadProduct();