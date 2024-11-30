// Function to make fields editable
function editField(fieldId) {
    const field = document.getElementById(fieldId);
    const editIcon = field.nextElementSibling;
    const currentText = field.textContent;

    // Create input field
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("edit-input");
    input.id = `${fieldId}-input`;

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", () => saveChanges(fieldId));

    // Replace field with input + save button
    editIcon.style.display = "none";
    field.replaceWith(input);
    input.insertAdjacentElement("afterend", saveButton);

    input.focus();
}

// Save changes to fields
function saveChanges(fieldId) {
    const input = document.getElementById(`${fieldId}-input`);
    const saveButton = input.nextElementSibling;
    const editIcon = saveButton.nextElementSibling;
    const updatedValue = input.value;

    // Replace input with the updated value
    const field = document.createElement("span");
    field.id = fieldId;
    field.textContent = updatedValue;

    input.replaceWith(field);
    saveButton.remove();
    editIcon.style.display = "inline-block";
}

// Post Scholarship functionality
document.getElementById("post-button").addEventListener("click", () => {
    // Capture values from the list
    const scholarshipData = {
        scholarship_name: document.getElementById("scholarship-name").innerText.trim(),
        category: document.getElementById("category").innerText.trim(),
        amount: document.getElementById("amount").innerText.replace(/[^0-9.]/g, ""), // Extract numeric value
        deadline: document.getElementById("deadline").innerText.trim(),
        description: document.getElementById("description").innerText.trim(),
    };

    console.log("Sending data:", scholarshipData);

    // Send data to the server using AJAX
    fetch("../PHP/post-scholarship.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scholarshipData),
    })
        .then((response) => response.text())
        .then((data) => {
            console.log("Server response:", data);
            if (data.includes("Scholarship posted successfully!")) {
                alert("Scholarship posted successfully!");
            } else {
                alert("Error: " + data);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to post scholarship. Please try again.");
        });
});

// URL validation
function validateURL(url) {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // Protocol
        "((([a-zA-Z\\d](([a-zA-Z\\d-]*[a-zA-Z\\d])?))\\.)+[a-zA-Z]{2,}|" + // Domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP address
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
        "(\\#[-a-zA-Z\\d_]*)?$", // Fragment locator
        "i"
    );
    return !!pattern.test(url);
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