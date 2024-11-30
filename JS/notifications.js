// Example notifications array
const notifications = [
    {
        institution_name: "Institution Name",
        date_notified: "2023-11-19",
        content: "The content of the notification",
        logo_path: "../images/sfu-logo.png"
    },
    {
        institution_name: "Institution Name",
        date_notified: "2023-11-20",
        content: "The content of the notification",
        logo_path: "../images/ubc-logo.png"
    },
    {
        institution_name: "Institution Name",
        date_notified: "2023-11-21",
        content: "The content of the notification",
        logo_path: "../images/mit-logo.png"
    },
    // Add more notifications as needed
];

// Target container
const notificationsContainer = document.getElementById("notifications-container");

// Dynamically create notification boxes
notifications.forEach((notification) => {
    const notificationBox = document.createElement("div");
    notificationBox.className = "notification-box";

    notificationBox.innerHTML = `
        <a href="Unipage.html" id="notification-logo">
            <img src="${notification.logo_path}" alt="Institution Logo">
        </a>
        <div class="notification-content">
            <a href="Unipage.html" class="notification-title">${notification.institution_name}</a>
            <div class="notification-date">Date notified: ${notification.date_notified}</div>
            <div class="notification-text">${notification.content}</div>
        </div>
    `;

    notificationsContainer.appendChild(notificationBox);
});

// Check for stored dark mode preference on page load
document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});
