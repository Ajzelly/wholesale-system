// --------------------------
// Authentication / User Utils
// --------------------------

// Check if user is logged in
function requireAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// Redirect logged-in users away from login/register
function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (token && user) {
        if (user.role === 'admin') {
            window.location.href = "admin/dashboard.html";
        } else {
            window.location.href = "dashboard.html";
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

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// --------------------------
// Role-based page protection
// --------------------------
function requireRole(requiredRole) {
    const user = getUser();
    if (!user) {
        // Not logged in
        window.location.href = "login.html";
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to their correct dashboard
        window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
    }
}
