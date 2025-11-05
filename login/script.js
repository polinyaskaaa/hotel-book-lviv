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

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("userRole", user.role); // admin | user
            localStorage.setItem("currentUserName", user.name);
            status.style.color = "green";
            status.textContent = `Вітаємо, ${user.name}!`;
            setTimeout(() => { window.location.href = "index.html"; }, 1000);
        } else {
            status.style.color = "red";
            status.textContent = "Невірний email або пароль!";
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        if (users.some(u => u.email === email)) {
            status.style.color = "red";
            status.textContent = "Користувач з таким email вже існує!";
            return;
        }

        const newUser = { name, email, password, role: "user" }; // завжди user
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        status.style.color = "green";
        status.textContent = "Реєстрація успішна! Тепер увійдіть.";
        registerForm.reset();

        loginTab.click();
    });
});
