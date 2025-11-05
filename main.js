document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.querySelector(".cards");

    const hotels = JSON.parse(localStorage.getItem("hotels")) || [];

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
                <img src="${hotel.img || './assets/default-hotel.png'}" alt="${hotel.name}">
                <h2>${hotel.name}</h2>
                <p>${hotel.description}</p>
                <a href="./mock-pagee/index.html" class="btn-primary">Детальніше</a>
            `;
            cardsContainer.appendChild(card);
        });
    }

    renderHotels();
});
