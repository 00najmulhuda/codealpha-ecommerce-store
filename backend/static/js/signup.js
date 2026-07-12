// ==========================================
// NovaCart Signup
// ==========================================

const API = "http://127.0.0.1:8000/auth/signup";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })

        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.detail);
            return;
        }

        alert(result.message);

        window.location.href = "/login";

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});