    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');

    const userData = JSON.parse(localStorage.getItem('currentUser')) || {};

    if (userData) {
    profileName.textContent = userData.name;
    profileEmail.textContent = userData.email;
}
