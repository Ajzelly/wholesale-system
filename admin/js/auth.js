// --------------------------
// Authentication / User Utils
// --------------------------

// Check if user is logged in (must be on every protected page)
function requireAuth() {
    const token = localStorage.getItem("token");
    const user = getUser();

    // Prevent cached page from showing
    if (!token || !user) {
        // Clear any leftover storage just in case
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login page (absolute path)
        window.location.href = "/frontend/login.html";
    }
}

// Redirect logged-in users away from login/register pages
function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (token && user) {
        if (user.role === "admin") {
            window.location.href = "/admin/dashboard.html";
        } else {
            window.location.href = "/dashboard.html";
        }
    }
}

// Get logged-in user
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Show username anywhere
function showUsername() {
    const user = getUser();
    const el = document.getElementById("username");
    if (user && el) {
        el.textContent = user.username;
    }
}

// Logout (works anywhere)
function logout() {
    localStorage.clear(); // clear everything
    // Force reload and go to login
    window.location.replace("login.html");
}

// --------------------------
// Role-based page protection
// --------------------------
function requireRole(requiredRole) {
    const user = getUser();

    if (!user) {
        logout(); // redirect to login
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.href =
            user.role === "admin"
                ? "/admin/dashboard.html"
                : "/dashboard.html";
    }
}

// --------------------------
// Prevent caching for protected pages
// --------------------------
window.onload = function () {
    // For all protected pages
    if (document.body.dataset.auth === "true") {
        requireAuth();
        // Extra safety: force reload if coming from back button
        window.addEventListener("pageshow", function (event) {
            if (event.persisted) {
                requireAuth();
            }
        });
    }
};
