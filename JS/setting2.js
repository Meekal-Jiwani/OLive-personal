
// Theme switch functionality
// Check for stored dark mode preference on page load
// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme"); // Apply dark theme
        const themeSwitch = document.getElementById("theme-switch");
        if (themeSwitch) themeSwitch.checked = true; // Ensure switch matches
    }
});

// Toggle dark mode and store preference in localStorage
document.getElementById("theme-switch").addEventListener("change", function() {
    if (this.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("darkMode", "enabled"); // Save state
    } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("darkMode", "disabled"); // Save state
    }
});



// Open the change email modal
function changeEmail() {
    openModal('change-email-modal');
}

// Save the new email and update it on the page
function saveNewEmail() {
    const newEmail = document.getElementById('new-email').value;
    if (newEmail && validateEmail(newEmail)) {
        document.querySelector('#email-display').textContent = newEmail;
        closeModal('change-email-modal');
        alert('Email updated successfully!');
    } else {
        alert('Please enter a valid email address.');
    }
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Open a modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}


// Toggle the visibility of the language dropdown
// Toggle the visibility of the language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById("language-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";

    // Add a one-time event listener to detect outside clicks
    document.addEventListener("click", handleClickOutside, true);
}

function handleClickOutside(event) {
    const dropdown = document.getElementById("language-dropdown");

    // Check if the click is outside the dropdown and the globe icon
    if (!dropdown.contains(event.target) && !event.target.classList.contains("globe-icon")) {
        dropdown.style.display = "none"; // Hide the dropdown
        document.removeEventListener("click", handleClickOutside, true); // Remove the event listener
    }
}

// Select a language and update the language display
function selectLanguage(language) {
    document.querySelector(".language-section p").innerHTML = `Language: ${language} <span class="globe-icon" onclick="toggleLanguageDropdown()">🌐</span>`;
    document.getElementById("language-dropdown").style.display = "none"; // Hide dropdown after selection
}



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

// Open the change password modal
function changePassword() {
    openModal('change-password-modal');
}

// Save the new password (mock example, secure handling required in real applications)
function saveNewPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword && newPassword === confirmPassword) {
        alert('Password updated successfully!');
        closeModal('change-password-modal');
    } else {
        alert('Passwords do not match. Please try again.');
    }
}
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('language-dropdown');
    const globeIcon = document.querySelector('.globe-icon');
    if (dropdown.style.display === 'block' && !dropdown.contains(event.target) && event.target !== globeIcon) {
        dropdown.style.display = 'none';
    }
});
document.getElementById('delete-account').addEventListener('click', () => {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmation) {
        alert('Account deleted successfully.');
        // Redirect or additional logic can be added here
    }
});
