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
        const editIcon = field.nextElementSibling;
        const currentText = field.textContent;
        const input = document.createElement("input");

        // Set input attributes, class, and initial color for styling
        input.type = "text";
        input.value = currentText;
        input.classList.add("edit-input");
        input.id = `${fieldId}-input`;
        input.style.color = "lightgray"; // Initial light gray color

        // Change text color to black when user starts typing
        input.addEventListener("input", function () {
            input.style.color = "black"; // Change to black on input
        });

        // Detect Enter key to trigger save
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                saveChanges(fieldId);
            }
        });

        /// Create and style the Save button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("save-button");

        // When save button is clicked, send updated data to the server
        saveButton.addEventListener("click", function () {
            saveChanges(fieldId, input.value); // Send updated value to server
        });

        // Hide the edit icon when editing starts
        editIcon.style.display = "none";

        // Replace the field with the input and show the Save button
        field.replaceWith(input);
        input.insertAdjacentElement("afterend", saveButton);

        input.focus();
    }

    // Function to save changes to the server
    function saveChanges(fieldId, newValue) {
        // Make sure the fieldId and newValue are properly passed
        console.log(`Saving ${fieldId} with value: ${newValue}`);
    
        fetch('../PHP/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field: fieldId,
                value: newValue
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the UI if save is successful
                const field = document.getElementById(`${fieldId}-input`);
                const updatedValue = field.value;
    
                // Replace the input field with updated text
                const textNode = document.createElement('span');
                textNode.textContent = updatedValue;
                textNode.id = fieldId; // Keep the original ID for styling
                field.replaceWith(textNode);
    
                // Re-display the edit icon
                const editIcon = textNode.nextElementSibling;
                editIcon.style.display = 'inline';
            } else {
                alert('Error updating profile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating profile');
        });
    }
});
