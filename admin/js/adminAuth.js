function requireAdmin() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "admin") {
        window.location.href = "login.html";
    }
}

function adminLogout() {
    localStorage.clear();
    window.location.href = "login.html";
}
