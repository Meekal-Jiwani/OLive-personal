window.addEventListener("DOMContentLoaded", function() {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
        document.getElementById("sidebar-profile-image").src = storedImage;
    }
});


// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});