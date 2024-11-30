/**
 * Toggles the visibility of the password input field.
 * 
 * @param {string} fieldId - The ID of the password input field to toggle.
 */
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "○";  // Open eye icon
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "⬤";  // Closed eye icon
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Handle loading and setting cookies
document.addEventListener('DOMContentLoaded', function() {
    const savedEmail = getCookie('email');
    const savedPassword = getCookie('password');
    if (savedEmail && savedPassword) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }

    document.getElementById('signin-form').onsubmit = function() {
        if (document.getElementById('rememberMe').checked) {
            setCookie('email', document.getElementById('email').value, 7);  // Expires in 7 days
            setCookie('password', document.getElementById('password').value, 7);  // Expires in 7 days
        } else {
            setCookie('email', '', -1);  // Clear cookie
            setCookie('password', '', -1);  // Clear cookie
        }
    };
});
