import { httpRequest } from "../interceptor/auth_interceptor.js";
document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const status = document.getElementById("status");

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        status.textContent = "";
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        status.textContent = "";
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        status.textContent = "";
        status.style.color = "black";

        try {
            console.log("click")
            const { response, result } = await httpRequest("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email: email, Password: password })
            });

            if (response.ok) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("roles", result.roles);
                status.style.color = "green";
                status.textContent = `Вітаємо!`;
                setTimeout(() => { window.location.href = "profile.html"; }, 1000);
            } else {
                status.style.color = "red";
                status.textContent = result.message || "Невірний email або пароль!";
            }
        } catch (err) {
            console.log(err)
            status.style.color = "red";
            status.textContent = "Сервер недоступний!";
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        status.textContent = "";
        status.style.color = "black";

        try {
            const { response, result } = await httpRequest("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Username : name, Email: email, Password: password })
            });

            if (response.ok) {
                status.style.color = "green";
                status.textContent = "Реєстрація успішна! Тепер увійдіть.";
                registerForm.reset();
                loginTab.click();
            } else {
                status.style.color = "red";
                status.textContent = result.message || "Помилка реєстрації!";
            }
        } catch (err) {
            status.style.color = "red";
            status.textContent = "Сервер недоступний!";
        }
    });
});
