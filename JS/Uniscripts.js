// Example JSON response from your API
const scholarships = [
    {
        university_name: "Simon Fraser University",
        date_posted: "2023-11-19",
        scholarship_name: "McTaggart Cowan Scholarship",
        category: "Zoology",
        amount: "CAD $10,000",
        deadline: "12-32-2070",
        image_path: "../images/sfu-logo.png"
    },
    {
        university_name: "Simon Fraser University",
        date_posted: "2023-11-19",
        scholarship_name: "McTaggart Cowan Scholarship",
        category: "Zoology",
        amount: "CAD $10,000",
        deadline: "12-32-2070",
        image_path: "../images/sfu-logo.png"
    },
    {
        university_name: "Simon Fraser University",
        date_posted: "2023-11-19",
        scholarship_name: "McTaggart Cowan Scholarship",
        category: "Zoology",
        amount: "CAD $10,000",
        deadline: "12-32-2070",
        image_path: "../images/sfu-logo.png"
    },
    {
        university_name: "Simon Fraser University",
        date_posted: "2023-11-19",
        scholarship_name: "McTaggart Cowan Scholarship",
        category: "Zoology",
        amount: "CAD $10,000",
        deadline: "12-32-2070",
        image_path: "../images/sfu-logo.png"
    },
    {
        university_name: "Simon Fraser University",
        date_posted: "2023-11-19",
        scholarship_name: "McTaggart Cowan Scholarship",
        category: "Zoology",
        amount: "CAD $10,000",
        deadline: "12-32-2070",
        image_path: "../images/sfu-logo.png"
    },

];

// Target container
const mainContainer = document.getElementById("main-container");

// Dynamically create feed boxes
scholarships.forEach((scholarship) => {
    const feedBox = document.createElement("div");
    feedBox.className = "feed-box";

    feedBox.innerHTML = `
        <div id="feed-profile-image-container">
            <img src="${scholarship.image_path}" alt="Profile Image" id="feed-profile-image">
        </div>
        <div class="feed-content">
            <div class="feed-header">${scholarship.university_name}</div>
            <div class="feed-subheader">Date posted: ${scholarship.date_posted}</div>
            <div class="feed-details">
                <ul>
                    <li><strong>Scholarship Name:</strong> ${scholarship.scholarship_name}</li>
                    <li><strong>Category:</strong> ${scholarship.category}</li>
                    <li><strong>Amount:</strong> ${scholarship.amount}</li>
                    <li><strong>Deadline:</strong> ${scholarship.deadline}</li>
                </ul>
            </div>
        </div>
    `;

    mainContainer.appendChild(feedBox);
});

document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});