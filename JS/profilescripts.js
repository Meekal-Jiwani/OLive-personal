document.addEventListener('DOMContentLoaded', function () {
    // Fetch profile data when the page loads
    console.log("Fetching profile data...");
    
    // Call the function to fetch and display profile data
    fetchProfileData();

    // Initialize dark mode on profile page load
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }

    // Listen for theme switch changes
    const themeSwitch = document.getElementById("theme-switch");
    if (themeSwitch) {
        themeSwitch.addEventListener("change", function () {
            if (this.checked) {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
        });
    }

    // Function to fetch user data from the server
    function fetchProfileData() {
        // Assuming you have a session-based authentication for the logged-in user
        fetch('../PHP/get_profile_data.php', {
            method: 'GET', // You can use POST if necessary to pass authentication details
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())  // Assuming the server returns JSON data
        .then(data => {
            console.log('Fetched data:', data);  // Debug: Check what data is being returned
            // Ensure data is valid before populating
            if (data && data.first_name) {
                populateProfileInfo(data);
            } else {
                console.error('Invalid data received:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }

    // Function to populate HTML elements with the fetched data
    function populateProfileInfo(data) {
        console.log('Populating profile with data:', data);  // Debug: Check if the data is passed here

        // Use fallback data if the actual data is missing
        document.getElementById('firstName').textContent = data.first_name || "N/A";
        document.getElementById('lastName').textContent = data.last_name || "N/A";
        document.getElementById('age').textContent = `${data.age || "N/A"} years old`;
        document.getElementById('location').textContent = data.location || "Location not provided";
        document.getElementById('contactInfo').textContent = data.contact_info || "No contact info provided";
        document.getElementById('description').textContent = data.description || "No description provided";

        // Update sidebar name based on profile data
        updateSidebarName(data);
    }

    // Update the sidebar name dynamically
    function updateSidebarName(data) {
        const firstName = data.first_name || "N/A";
        const lastName = data.last_name || "N/A";
        document.getElementById('student-name').textContent = `${firstName} ${lastName}`;
    }

    // Profile image upload functionality
    document.querySelector(".edit-overlay").addEventListener("click", function () {
        const imageUploadInput = document.createElement("input");
        imageUploadInput.type = "file";
        imageUploadInput.accept = "image/*";
        imageUploadInput.style.display = "none";
        document.body.appendChild(imageUploadInput);

        imageUploadInput.click();

        imageUploadInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("main-profile-image").src = e.target.result;
                    document.getElementById("sidebar-profile-image").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
            document.body.removeChild(imageUploadInput);
        });
    });

    // Function to make fields editable
    document.querySelectorAll(".edit-icon").forEach(icon => {
        icon.addEventListener("click", function () {
            const fieldId = this.previousElementSibling.id;
            editField(fieldId);
        });
    });

    function editField(fieldId) {
        const field = document.getElementById(fieldId);
        const currentText = field.textContent;

        // Create input field dynamically
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.id = `${fieldId}-input`;

        // Add event listener for Enter key to save
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                saveField(fieldId, input.value);
            }
        });

        // Replace field content with the input field
        field.textContent = ""; // Clear the current text
        field.appendChild(input);

        // Focus on the input field for immediate editing
        input.focus();
    }

    // Save field functionality
    function saveField(fieldId) {
        const input = document.getElementById(`${fieldId}-input`);
        const updatedValue = input.value;
    
        fetch('../PHP/update_institution_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field: fieldId, // Field name sent directly as-is
                value: updatedValue,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Update the UI with the new value
                    const field = document.createElement('span');
                    field.id = fieldId;
                    field.textContent = updatedValue;
    
                    const input = document.getElementById(`${fieldId}-input`);
                    const saveButton = input.nextElementSibling;
    
                    input.replaceWith(field);
                    saveButton.remove();
    
                    const editIcon = field.nextElementSibling;
                    editIcon.style.display = 'inline-block';
                } else {
                    alert('Failed to update: ' + data.message);
                }
            })
            .catch((error) => {
                console.error('Error updating field:', error);
                alert('An error occurred while updating.');
            });
    }
    

    // Attach click listeners to all edit icons
    document.querySelectorAll(".edit-icon").forEach(icon => {
        icon.addEventListener("click", function () {
            const fieldId = this.previousElementSibling.id;
            editField(fieldId);
        });
    });
});