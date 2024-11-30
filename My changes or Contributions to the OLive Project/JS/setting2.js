// Load the profile image from local storage on page load
window.addEventListener("DOMContentLoaded", function() {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
        document.getElementById("sidebar-profile-image").src = storedImage;
    }
});

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

function saveNewEmail() {
    const newEmail = document.getElementById('new-email').value;
    if (newEmail && validateEmail(newEmail)) {
        fetch("../PHP/settings.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newEmail }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update email");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.querySelector('#email-display').textContent = newEmail;
                    closeModal('change-email-modal');
                    alert(data.message);
                } else {
                    alert(data.message || "An error occurred. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error updating email:", error);
                alert("An error occurred. Please try again.");
            });
    } else {
        alert("Please enter a valid email address.");
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

// Open the change password modal
function changePassword() {
    openModal('change-password-modal');
}

function saveNewPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword && newPassword === confirmPassword) {
        fetch("../PHP/settings.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update password");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    closeModal('change-password-modal');
                } else {
                    alert(data.message || "An error occurred. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error updating password:", error);
                alert("An error occurred. Please try again.");
            });
    } else {
        alert("Passwords do not match. Please try again.");
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
        fetch("../PHP/settings.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = "../HTML/front.html"; // Redirect to the front page
                } else {
                    alert(data.message || "Failed to delete the account. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error deleting account:", error);
                alert("An error occurred. Please try again.");
            });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Fetch user data from the server
    fetch("../PHP/settings.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load user settings");
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error); // Handle error response
            } else {
                // Display the user's email
                document.getElementById("email-display").textContent = data.email;

                // Display placeholder password (this doesn't change)
                const passwordPlaceholder = document.querySelector(".account-info p:nth-child(2) span:nth-child(2)");
                passwordPlaceholder.textContent = "Change"; // Static masked password
            }
        })
        .catch(error => {
            console.error("Error fetching user settings:", error);
            alert("Could not load settings. Please try again.");
        });
});
