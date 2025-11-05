document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.querySelector(".cards");
    const addHotelBtn = document.querySelector(".add-hotel-btn");

    let hotels = JSON.parse(localStorage.getItem("hotels")) || [];

    function saveHotels() {
        localStorage.setItem("hotels", JSON.stringify(hotels));
    }

    function renderHotels() {
        cardsContainer.innerHTML = "";
        hotels.forEach((hotel, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${hotel.img}" alt="${hotel.name}">
                <h3>${hotel.name}</h3>
                <p>${hotel.description}</p>
                <div class="card-actions">
                    <button class="btn-primary edit-btn" data-index="${index}">Редагувати</button>
                    <button class="btn-danger delete-btn" data-index="${index}">Видалити</button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.dataset.index;
                openHotelForm(hotels[idx], idx);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.dataset.index;
                if(confirm("Видалити готель?")) {
                    hotels.splice(idx, 1);
                    saveHotels();
                    renderHotels();
                }
            });
        });
    }

    function openHotelForm(hotel = {}, index = null) {
        const overlay = document.createElement("div");
        overlay.classList.add("modal-overlay", "active");

        const formContainer = document.createElement("div");
        formContainer.classList.add("form-container");

        formContainer.innerHTML = `
        <h2>${index !== null ? "Редагувати" : "Додати"} готель</h2>
        <label>Назва:</label>
        <input type="text" id="hotel-name" value="${hotel.name || ""}">
        <label>Опис:</label>
        <textarea id="hotel-description">${hotel.description || ""}</textarea>
        <label>Картинка:</label>
        <input type="file" id="hotel-img">
        <div style="margin-top: 10px;">
            <button id="save-hotel" class="btn-primary">${index !== null ? "Зберегти" : "Додати"}</button>
            <button id="cancel-hotel" class="btn-danger">Відміна</button>
        </div>
    `;

        overlay.appendChild(formContainer);
        document.body.appendChild(overlay);

        const hotelImgInput = document.getElementById("hotel-img");
        if(hotel.img) {
            const imgPreview = document.createElement("img");
            imgPreview.src = hotel.img;
            formContainer.insertBefore(imgPreview, hotelImgInput.nextSibling);
        }

        document.getElementById("cancel-hotel").addEventListener("click", () => {
            overlay.remove();
        });

        document.getElementById("save-hotel").addEventListener("click", () => {
            const name = document.getElementById("hotel-name").value.trim();
            const description = document.getElementById("hotel-description").value.trim();
            const file = hotelImgInput.files[0];

            if(!name || !description) {
                alert("Всі поля обов'язкові!");
                return;
            }

            if(file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const imgData = reader.result;
                    saveHotelData(name, description, imgData, index);
                    overlay.remove();
                };
                reader.readAsDataURL(file);
            } else {
                saveHotelData(name, description, hotel.img || "", index);
                overlay.remove();
            }
        });
    }

    function saveHotelData(name, description, img, index) {
        const hotelData = { name, description, img };
        if(index !== null) {
            hotels[index] = hotelData;
        } else {
            hotels.push(hotelData);
        }
        saveHotels();
        renderHotels();
    }

    addHotelBtn.addEventListener("click", () => openHotelForm());

    renderHotels();
});
