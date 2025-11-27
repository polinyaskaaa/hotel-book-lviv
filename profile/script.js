import {httpRequest} from "../interceptor/auth_interceptor.js";

const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profilePhone = document.getElementById('profile-phone');

const editBtn = document.getElementById('edit-profile-btn');
const modal = document.getElementById('edit-profile-modal');
const closeModal = document.getElementById('close-modal');
const editForm = document.getElementById('edit-profile-form');
const editName = document.getElementById('edit-name');
const editPhone = document.getElementById('edit-phone');
const deleteAccountBtn = document.getElementById('delete-account-btn');

let profile = null;

async function loadProfile() {
    try {
        const { response, result } = await httpRequest("http://localhost:3000/api/users/profile", {
            method: "GET"
        });
        if (response.ok) {
            profile = result;
            profileName.textContent = profile.Username;
            profileEmail.textContent = profile.Email;
            profilePhone.textContent = profile.PhoneNumber || "Не вказано";
        }
    } catch (err) {
        alert(err + " При отриманні профілю");
    }
}
loadProfile();

editBtn.addEventListener("click", () => {
    if (!profile) return;
    editName.value = profile.Username || "";
    editPhone.value = profile.PhoneNumber || "";
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = editName.value.trim();
    const newPhone = editPhone.value.trim();
    if (!/^\+380\d{9}$/.test(newPhone)) {
        alert("Введіть коректний номер телефону у форматі +380XXXXXXXXX");
        return;
    }
    try {
        const { response, result } = await httpRequest("http://localhost:3000/api/users/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Username: newName, PhoneNumber: newPhone })
        });
        if (response.ok) {
            profile = result;
            profileName.textContent = profile.Username;
            modal.style.display = "none";
            location.reload()
            alert("Профіль оновлено!");
        } else {
            alert("Помилка оновлення профілю");
        }
    } catch (err) {
        alert(err + " При оновленні профілю");
    }
});

deleteAccountBtn.addEventListener("click", async () => {
    if (!confirm("Ви впевнені, що хочете видалити акаунт? Це незворотньо!")) return;
    try {
        const { response } = await httpRequest("http://localhost:3000/api/users/profile", {
            method: "DELETE"
        });
        if (response.ok) {
            alert("Акаунт видалено. Ви будете перенаправлені на головну сторінку.");
            window.location.href = "./login.html";
        } else {
            alert("Помилка видалення акаунта");
        }
    } catch (err) {
        alert(err + " При видаленні акаунта");
    }
});
