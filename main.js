import {httpRequest} from "./interceptor/auth_interceptor.js";

document.addEventListener("DOMContentLoaded", async () => {
    const cardsContainer = document.querySelector(".cards");

    try {
        const { response, result } = await httpRequest("http://localhost:3000/api/hotels", {
            method: "GET"
        });

        if (response.ok) {
            var hotels = result || [];
        }
    } catch (err) {
        alert(err+ " При отриманні готелів.")
    }

    function renderHotels() {
        cardsContainer.innerHTML = "";

        if (hotels.length === 0) {
            cardsContainer.innerHTML = "<p>Наразі немає готелів для показу.</p>";
            return;
        }

        hotels.forEach(hotel => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${hotel.ImageUrl || './assets/default-hotel.png'}" alt="${hotel.Name}">
                <h2>${hotel.Name}</h2>
                <p>${hotel.Description}</p>
                <p><strong>Локація:</strong> ${hotel.Location || "Не вказано"}</p>
                <p><strong>Зірок:</strong> ${hotel.StarRating || "Не вказано"}</p>
                <a href="./mock-pagee/index.html" class="btn-primary">Детальніше</a>
            `;
            cardsContainer.appendChild(card);
        });
    }

    renderHotels();
});
