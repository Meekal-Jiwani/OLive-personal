// Example student data (mocked for demonstration)
const studentDetails = {
    1: {
        name: "Student 1",
        application: "Link to the student application.",
        relevantLinks: "The links that the student added to his account.",
        relevantDocuments: "The documents that the student added to his account."
    }
};

// Get student ID from URL
const params = new URLSearchParams(window.location.search);
const studentId = params.get('id');

// Populate the page with student details
if (studentDetails[studentId]) {
    document.getElementById("student-name").textContent = studentDetails[studentId].name;
    document.querySelectorAll(".info-box")[0].textContent = studentDetails[studentId].application;
    document.querySelectorAll(".info-box")[1].textContent = studentDetails[studentId].relevantLinks;
    document.querySelectorAll(".info-box")[2].textContent = studentDetails[studentId].relevantDocuments;
}

// Variables to store decision state
let decision = null;
let isDarkMode = localStorage.getItem("darkMode") === "enabled";

// Event listeners for decision buttons
document.getElementById("accepted-button").addEventListener("click", () => {
    decision = "Accepted";
    highlightDecision("accepted");
});

document.getElementById("denied-button").addEventListener("click", () => {
    decision = "Denied";
    highlightDecision("denied");
});

// Submit decision logic
document.getElementById("submit-decision").addEventListener("click", () => {
    if (decision === "Accepted") {
        alert("You have accepted the student.");
    } else if (decision === "Denied") {
        alert("You have denied the student.");
    } else {
        alert("Please make a decision before submitting.");
    }
});

// Helper function to highlight selected decision button
function highlightDecision(selected) {
    const acceptedButton = document.getElementById("accepted-button");
    const deniedButton = document.getElementById("denied-button");

    if (selected === "accepted") {
        acceptedButton.style.backgroundColor = isDarkMode ? "#494C3A" : "#494C3A"; // Highlight accepted
        deniedButton.style.backgroundColor = isDarkMode ? "#333333" : "#dcdcdc"; // Reset denied
    } else if (selected === "denied") {
        deniedButton.style.backgroundColor = isDarkMode ? "#494C3A" : "#494C3A"; // Highlight denied
        acceptedButton.style.backgroundColor = isDarkMode ? "#333333" : "#dcdcdc"; // Reset accepted
    }
}

// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});
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