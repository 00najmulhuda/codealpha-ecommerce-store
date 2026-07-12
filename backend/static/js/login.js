// ==========================================
// NovaCart Login
// ==========================================

const API = "http://127.0.0.1:8000/auth/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email,
                password: password

            })

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.detail);

            return;

        }

        // Save JWT Token
        localStorage.setItem(
            "access_token",
            result.access_token
        );

        localStorage.setItem(
            "token_type",
            result.token_type
        );

        alert("Login Successful!");

        window.location.href = "/";

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});