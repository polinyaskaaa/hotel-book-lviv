// admin_page/script.js

import { httpRequest } from "../interceptor/auth_interceptor.js";

document.addEventListener("DOMContentLoaded", async () => {
    const cardsContainer = document.querySelector(".cards");
    const addHotelBtn = document.querySelector(".add-hotel-btn");
    let hotels = [];

    async function fetchHotels() {
        try {
            const { response, result } = await httpRequest("http://localhost:3000/api/hotels", {
                method: "GET"
            });
            if (response.ok) {
                hotels = result || [];
            } else {
                hotels = [];
            }
        } catch (err) {
            alert(err + " При отриманні готелів.");
            hotels = [];
        }
    }

    async function renderHotels() {
        await fetchHotels();
        cardsContainer.innerHTML = "";
        hotels.forEach((hotel, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${hotel.ImageUrl}" alt="${hotel.Name}">
                <h3>${hotel.Name}</h3>
                <p>${hotel.Description}</p>
                <p><strong>Локація:</strong> ${hotel.Location || "Не вказано"}</p>
                <p><strong>Зірок:</strong> ${hotel.StarRating || "Не вказано"}</p>
                <div class="card-actions">
                    <button class="btn-primary edit-btn" data-id="${hotel.Id}">Редагувати</button>
                    <button class="btn-danger delete-btn" data-id="${hotel.Id}">Видалити</button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                const hotel = hotels.find(h => h.Id == id);
                console.log(id)
                console.log(hotels)
                console.log(hotel)
                openHotelForm(hotel, id);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (confirm("Видалити готель?")) {
                    await deleteHotel(id);
                    await renderHotels();
                }
            });
        });
    }

    function openHotelForm(hotel = {}, id = null) {
        const overlay = document.createElement("div");
        overlay.classList.add("modal-overlay", "active");

        const formContainer = document.createElement("div");
        formContainer.classList.add("form-container");

        formContainer.innerHTML = `
            <h2>${id ? "Редагувати" : "Додати"} готель</h2>
            <label>Назва:</label>
            <input type="text" id="hotel-name" value="${hotel.Name || ""}">
            <label>Опис:</label>
            <textarea id="hotel-description">${hotel.Description || ""}</textarea>
            <label>Локація:</label>
            <input type="text" id="hotel-location" value="${hotel.Location || ""}">
            <label>Кількість зірок:</label>
            <input type="number" id="hotel-stars" min="1" max="5" value="${hotel.StarRating || ""}">
            <label>Картинка:</label>
            <input type="file" id="hotel-img">
            <div style="margin-top: 10px;">
                <button id="save-hotel" class="btn-primary">${id ? "Зберегти" : "Додати"}</button>
                <button id="cancel-hotel" class="btn-danger">Відміна</button>
            </div>
        `;

        overlay.appendChild(formContainer);
        document.body.appendChild(overlay);

        const hotelImgInput = document.getElementById("hotel-img");
        if (hotel.img) {
            const imgPreview = document.createElement("img");
            imgPreview.src = hotel.img;
            formContainer.insertBefore(imgPreview, hotelImgInput.nextSibling);
        }

        document.getElementById("cancel-hotel").addEventListener("click", () => {
            overlay.remove();
        });

        document.getElementById("save-hotel").addEventListener("click", async () => {
            const name = document.getElementById("hotel-name").value.trim();
            const description = document.getElementById("hotel-description").value.trim();
            const location = document.getElementById("hotel-location").value.trim();
            const stars = parseInt(document.getElementById("hotel-stars").value, 10);
            const file = hotelImgInput.files[0];

            if (!name || !description || !location || !stars) {
                alert("Всі поля обов'язкові!");
                return;
            }
            if (stars < 1 || stars > 5) {
                alert("Кількість зірок має бути від 1 до 5!");
                return;
            }

            if (file) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const imgData = reader.result;
                    await saveHotelData(name, description, location, stars, imgData, id);
                    overlay.remove();
                    await renderHotels();
                };
                reader.readAsDataURL(file);
            } else {
                await saveHotelData(name, description, location, stars, hotel.img || "", id);
                overlay.remove();
                await renderHotels();
            }
        });
    }

    async function saveHotelData(name, description, location, stars, img, id) {
        const hotelData = { Name: name, Description: description, Location: location, StarRating: stars, img };
        if (id) {
            await httpRequest(`http://localhost:3000/api/hotels/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotelData)
            });
        } else {
            await httpRequest("http://localhost:3000/api/hotels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotelData)
            });
        }
    }

    async function deleteHotel(id) {
        await httpRequest(`http://localhost:3000/api/hotels/${id}`, {
            method: "DELETE"
        });
    }

    addHotelBtn.addEventListener("click", () => openHotelForm());

    await renderHotels();
});
