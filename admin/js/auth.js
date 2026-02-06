// --------------------------
// Authentication / User Utils
// --------------------------

// Get logged-in user
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Check if user is logged in (ADMIN PAGES ONLY)
function requireAuth() {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (!token || !user || user.role !== "admin") {
        localStorage.clear();
        window.location.replace("/index.html");
    }
}

// Redirect logged-in users away from admin login page
function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (token && user) {
        if (user.role === "admin") {
            window.location.replace("/admin/dashboard.html");
        } else {
            window.location.replace("/products.html");
        }
    }
}

// Show username
function showUsername() {
    const user = getUser();
    const el = document.getElementById("username");
    if (user && el) {
        el.textContent = user.username;
    }
}

// Logout (ADMIN)
function logout() {
    localStorage.clear();
    window.location.replace("/index.html");
}

// --------------------------
// Extra protection (BACK button fix)
// --------------------------
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        requireAuth();
    }
});
