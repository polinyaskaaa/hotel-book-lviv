document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const userRole = localStorage.getItem("userRole");

    let navLinks = "";

    if (!userRole) {
        navLinks = `
      <ul class="nav-links">
        <li><a href="./index.html">Головна</a></li>
        <li><a href="./login.html">Логін</a></li>
      </ul>
    `;
    } else if (userRole === "admin") {
        navLinks = `
      <ul class="nav-links">
        <li><a href="./index.html">Головна</a></li>
        <li><a href="./profile.html">Профіль</a></li>
        <li><a href="./admin_page.html">АдмінПанель</a></li>
        <li><a href="#" id="logout-btn">Вийти</a></li>
      </ul>
    `;
    } else if (userRole === "user") {
        navLinks = `
      <ul class="nav-links">
        <li><a href="./index.html">Головна</a></li>
        <li><a href="./profile.html">Профіль</a></li>
        <li><a href="#" id="logout-btn">Вийти</a></li>
      </ul>
    `;
    }

    navbar.innerHTML = `
    <div class="logo">HotelBookLviv</div>
    <nav>
      ${navLinks}
      <div id="burger">&#9776;</div>
    </nav>
  `;

    const burger = document.getElementById("burger");
    const navMenu = navbar.querySelector(".nav-links");
    burger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("userRole");
            localStorage.removeItem("currentUserName");
            localStorage.removeItem("currentUser");
            window.location.href = "./login.html";
        });
    }
});
