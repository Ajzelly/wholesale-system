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
    if (token) {
        window.location.href = "index.html";
    }
}

// Get logged-in user
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Show username everywhere
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
