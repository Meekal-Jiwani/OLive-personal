// Example scholarship details
const scholarship = {
    university_name: "Simon Fraser University",
    date_posted: "2023-11-19",
    scholarship_name: "McTaggart Cowan Scholarship",
    category: "Zoology",
    amount: "CAD $10,000",
    deadline: "12-32-2070",
    description: "This scholarship supports outstanding students in Zoology programs.",
    image_path: "../images/sfu-logo.png",
    university_bio_link: "Unipage.html", // Link to university's bio page
    apply_link: "https://sfu.ca/scholarships/mctaggart-cowan" // Scholarship application link
};

// Populate the scholarship details dynamically
document.addEventListener("DOMContentLoaded", () => {
    const logoContainer = document.getElementById("institution-logo-container");
    const institutionNameContainer = document.getElementById("institution-name-container");
    const detailsList = document.getElementById("scholarship-details-list");
    const applyButton = document.getElementById("apply-button");

    // Set logo and link to university bio page
    logoContainer.innerHTML = `
        <a href="${scholarship.university_bio_link}">
            <img src="${scholarship.image_path}" alt="Institution Logo" id="institution-logo">
        </a>
    `;

    // Set university name and link to university bio page
    institutionNameContainer.innerHTML = `
        <a href="${scholarship.university_bio_link}" alt="Institution name" id= "#institution-name-container">
            ${scholarship.university_name}
        </a>
    `;

    // Populate other details
    document.getElementById("date-posted").textContent = scholarship.date_posted;
    detailsList.innerHTML = `
        <li><strong>Scholarship Name:</strong> ${scholarship.scholarship_name}</li>
        <li><strong>Category:</strong> ${scholarship.category}</li>
        <li><strong>Amount:</strong> ${scholarship.amount}</li>
        <li><strong>Deadline:</strong> ${scholarship.deadline}</li>
        <li><strong>Description:</strong> ${scholarship.description}</li>
    `;

    // Set the Apply button's behavior
    applyButton.addEventListener("click", () => {
        window.location.href = scholarship.apply_link;
    });
});
