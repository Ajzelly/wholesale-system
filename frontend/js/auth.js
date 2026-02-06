// --------------------------
// Authentication / User Utils
// --------------------------

// Get logged-in user
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Check if user is logged in (use on ALL protected pages)
function requireAuth() {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (!token || !user) {
        localStorage.clear();
        window.location.replace("/index.html");
    }
}

// Redirect logged-in users away from login/register pages
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

// Show username anywhere
function showUsername() {
    const user = getUser();
    const el = document.getElementById("username");
    if (user && el) {
        el.textContent = user.username;
    }
}

// Logout (works everywhere)
function logout() {
    localStorage.clear();
    window.location.replace("/index.html");
}

// --------------------------
// Role-based page protection
// --------------------------
function requireRole(requiredRole) {
    const user = getUser();

    if (!user) {
        logout();
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.replace(
            user.role === "admin"
                ? "/admin/dashboard.html"
                : "/products.html"
        );
    }
}

// --------------------------
// Prevent cached access (BACK button fix)
// --------------------------
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        requireAuth();
    }
});
