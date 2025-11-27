export async function httpRequest(url, options = {}) {
    const token = localStorage.getItem("token");
    options.headers = options.headers || {};
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    if (response.status === 401 && token) {
        localStorage.removeItem("token");
        window.location.href = "./login.html";
        return null;
    }

    let result;
    try {
        result = await response.json();
    } catch {
        result = null;
    }
    return { response, result };
}
