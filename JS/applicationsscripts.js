// Function to fetch applications from the backend and populate the application cards dynamically
function fetchApplications(studentId) {
    // Replace this URL with your backend API endpoint
    const apiUrl = `get-applications.php?student_id=${studentId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch applications.');
            }
            return response.json();
        })
        .then(applicationsData => {
            populateApplications(applicationsData);
        })
        .catch(error => {
            console.error('Error fetching applications:', error);
        });
}

// Function to fetch applications from the backend and populate the application cards
function populateApplications() {
    const studentId = 12; // Replace with the actual logged-in student's ID
    const url = `../PHP/fetchApplications.php?student_id=${studentId}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch applications.");
            }
            return response.json();
        })
        .then(applications => {
            const container = document.getElementById('application-cards-container');
            container.innerHTML = ""; // Clear any existing content

            applications.forEach(app => {
                const card = document.createElement('div');
                card.classList.add('application-card');

                card.innerHTML = `
                    <div class="app-details">
                        <img src="../images/default-scholarship.jpg" alt="${app.scholarship_title} Logo">
                        <div>
                            <p><strong>${app.scholarship_title}</strong></p>
                            <p>${app.institution_name}</p>
                            <p><em>${app.scholarship_description}</em></p>
                            <p>Amount: $${app.amount}</p>
                            <p>Deadline: ${app.application_deadline}</p>
                        </div>
                    </div>
                    <p class="status ${app.application_status.toLowerCase()}">
                        Status: <span class="status-highlight">${app.application_status}</span>
                    </p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            const container = document.getElementById('application-cards-container');
            container.innerHTML = `<p>Error loading applications. Please try again later.</p>`;
        });
}

// Call the function on page load
window.addEventListener('DOMContentLoaded', populateApplications);

// Load the profile image from local storage on page load
window.addEventListener("DOMContentLoaded", function () {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
        document.getElementById("sidebar-profile-image").src = storedImage;
    }

    // Fetch and display applications for the logged-in student
    const studentId = localStorage.getItem("studentId"); // Assume studentId is stored in localStorage after login
    if (studentId) {
        fetchApplications(studentId);
    } else {
        console.error('No student ID found in localStorage.');
    }

    // Check for stored dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});

// Function to toggle dark mode and save preference
function toggleDarkMode() {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("darkMode", isDarkTheme ? "enabled" : "disabled");
}

// Event listener for the dark mode toggle button (optional)
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
}
