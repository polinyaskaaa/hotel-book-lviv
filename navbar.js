import {Roles} from "./constants/roles.js";

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const rolesRaw = localStorage.getItem("roles");
    let roles = [];
    if (rolesRaw) {
        try {
            roles = JSON.parse(rolesRaw);
        } catch {
            roles = [rolesRaw];
        }
    }

    console.log(roles)
    let navLinks = "";

    if (!roles || roles.length === 0) {
        navLinks = `
      <ul class="nav-links">
        <li><a href="./index.html">Головна</a></li>
        <li><a href="./login.html">Логін</a></li>
      </ul>
    `;
    } else if (roles.includes(Roles.Admin)) {
        navLinks = `
      <ul class="nav-links">
        <li><a href="./index.html">Головна</a></li>
        <li><a href="./profile.html">Профіль</a></li>
        <li><a href="./admin_page.html">АдмінПанель</a></li>
        <li><a href="#" id="logout-btn">Вийти</a></li>
      </ul>
    `;
    } else if (roles.includes(Roles.Customer)) {
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
            localStorage.removeItem("token");
            localStorage.removeItem("roles");
            window.location.href = "./login.html";
        });
    }
});
