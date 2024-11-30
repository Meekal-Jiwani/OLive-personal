// Example data for scholarship applicants
const applicants = {
    1: ["Student 1", "Student 2", "Student 3", "Student 4"],
    2: ["Student A", "Student B", "Student C"],
    3: ["Student X", "Student Y"],
    4: ["Student M", "Student N", "Student O", "Student P"]
};

// Get scholarship ID from URL
const params = new URLSearchParams(window.location.search);
const scholarshipId = params.get('id');

// Set the scholarship title dynamically
const scholarshipTitleElement = document.getElementById("scholarship-title");
scholarshipTitleElement.textContent = `Scholarship ${String.fromCharCode(64 + parseInt(scholarshipId))}`;

// Get the container for applicants
const applicantsContainer = document.getElementById("applicants-container");

// Populate applicants dynamically
if (applicants[scholarshipId]) {
    applicants[scholarshipId].forEach((applicant, index) => {
        const applicantBlock = document.createElement("div");
        applicantBlock.className = "applicant-block";
        applicantBlock.textContent = applicant;

        // Add click event listener to navigate to student details page
        applicantBlock.addEventListener("click", () => {
            // Redirect to student details page with the applicant's name as a query parameter
            window.location.href = `student-details.html?student=${encodeURIComponent(applicant)}`;
        });

        applicantsContainer.appendChild(applicantBlock);
    });
} else {
    applicantsContainer.textContent = "No applicants available for this scholarship.";
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