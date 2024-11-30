// On page load, retrieve and set the sidebar profile image
document.addEventListener("DOMContentLoaded", function () {
    const profileImage = localStorage.getItem("main-profile-image");

    // Set the profile image in the sidebar if it exists
    if (profileImage) {
        const sidebarImage = document.getElementById("sidebar-profile-image");
        if (sidebarImage) sidebarImage.src = profileImage;
    }

    // Check for stored dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});

// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});