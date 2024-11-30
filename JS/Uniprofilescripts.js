function updateSidebarName() {
    const institutionName = document.getElementById('firstName').textContent;
    document.getElementById('University').textContent = institutionName;
}

// Profile image upload functionality
function uploadImage(targetId) {
    const imageUploadInput = document.createElement("input");
    imageUploadInput.type = "file";
    imageUploadInput.accept = "image/*";
    imageUploadInput.style.display = "none";
    document.body.appendChild(imageUploadInput);

    imageUploadInput.click();

    imageUploadInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                document.getElementById(targetId).src = imageData;

                // Optionally store the image in localStorage
                localStorage.setItem(targetId, imageData);
            };
            reader.readAsDataURL(file);
        }
        document.body.removeChild(imageUploadInput);
    });
}

function editField(fieldId, fieldType = "text") {
    const field = document.getElementById(fieldId);
    const editIcon = field.nextElementSibling;
    const currentText = field.textContent;

    // Create input field
    const input = document.createElement("input");
    input.type = fieldType;
    input.value = currentText;
    input.classList.add("edit-input");
    input.id = `${fieldId}-input`;

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", () => saveField(fieldId, input.value));

    // Replace field with input and save button
    editIcon.style.display = "none";
    field.replaceWith(input);
    input.insertAdjacentElement("afterend", saveButton);
    input.focus();
}

function saveField(fieldId, updatedValue) {
    console.log(`Saving field: ${fieldId}, New Value: ${updatedValue}`); // Debug log

    fetch("../PHP/update_institution_profile.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            field: fieldId,
            value: updatedValue,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Server Response:", data); // Debug log

            if (data.success) {
                const field = document.createElement("span");
                field.id = fieldId;
                field.textContent = updatedValue;

                const input = document.getElementById(`${fieldId}-input`);
                const saveButton = input.nextElementSibling;

                input.replaceWith(field);
                saveButton.remove();

                const editIcon = field.nextElementSibling;
                editIcon.style.display = "inline-block";
            } else {
                alert("Failed to update: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error updating field:", error);
            alert("An error occurred while updating.");
        });
}


// Email validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// URL validation
function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// Load profile image and banner from localStorage on page load
window.addEventListener("DOMContentLoaded", function () {
    const profileImage = localStorage.getItem("main-profile-image");
    const bannerImage = localStorage.getItem("banner-profile-image");

    if (profileImage) {
        document.getElementById("main-profile-image").src = profileImage;
        document.getElementById("sidebar-profile-image").src = profileImage;
    }

    if (bannerImage) {
        document.getElementById("banner-profile-image").src = bannerImage;
    }

    // Check for stored dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});
// Bind edit icons to editing functionality
document.querySelectorAll(".edit-icon").forEach(icon => {
    icon.addEventListener("click", function () {
        const fieldId = this.previousElementSibling.id;
        editField(fieldId);
    });
});


/////dark mode 
// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});
document.addEventListener('DOMContentLoaded', function () {
    fetch('../PHP/get_institution_profile_data.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                // Update institution name
                if (data.institution_name) {
                    document.getElementById('institutionName').textContent = data.institution_name;
                }
                
                // Update email
                if (data.email) {
                    document.getElementById('email').textContent = data.email;
                }

                // Update website URL
                if (data.website_url) {
                    const websiteElement = document.getElementById('website');
                    websiteElement.textContent = data.website_url;
                    websiteElement.href = data.website_url; // Make it a clickable link
                }
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
});


