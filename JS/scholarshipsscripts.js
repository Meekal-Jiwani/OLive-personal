// Example scholarships array
const scholarships = [
    {
        id: 1,
        title: "Scholarship A",
        link: "scholarship-students.html?id=1"
    },
    {
        id: 2,
        title: "Scholarship B",
        link: "scholarship-students.html?id=2"
    },
    {
        id: 3,
        title: "Scholarship C",
        link: "scholarship-students.html?id=3"
    },
    {
        id: 4,
        title: "Scholarship D",
        link: "scholarship-students.html?id=4"
    }
];

// Target container
const scholarshipsContainer = document.getElementById("scholarships-container");

// Dynamically create scholarship blocks
scholarships.forEach((scholarship) => {
    const scholarshipBlock = document.createElement("div");
    scholarshipBlock.className = "scholarship-block";

    // Each scholarship block is a clickable link
    scholarshipBlock.innerHTML = `
        <a href="${scholarship.link}">
            <div class="scholarship-title">${scholarship.title}</div>
        </a>
    `;

    scholarshipsContainer.appendChild(scholarshipBlock);
});

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