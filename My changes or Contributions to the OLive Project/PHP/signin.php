<?php
session_start(); // Start the session

// Setup error message variable
$error_message = '';

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "OLive_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email']; // Retrieve email from form
    $password = $_POST['password']; // Retrieve password from form

    // Prepare SQL statement to fetch user data
    $stmt = $conn->prepare("SELECT user_id, password, role FROM users WHERE email = ?");
    if (!$stmt) {
        $error_message = 'Database prepare failed: ' . $conn->error;
    } else {
        // Bind parameters and execute
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($user_id, $storedPassword, $role);
                $stmt->fetch();
                if (password_verify($password, $storedPassword)) {
                    // Set session variables on successful login
                    session_start();
                    $_SESSION['user_id'] = $user_id;
                    $_SESSION['role'] = $role;
                    $_SESSION['user_data'] = [
                        'first_name' => $first_name,
                        'last_name' => $last_name
                    ];

                    // Redirect based on user role
                    if ($role === "student") {
                        header("Location: ../HTML/feed.html"); // Redirect students to the feed
                    } elseif ($role === "institution") {
                        header("Location: ../HTML/uniprofile.html"); // Redirect institutions to their profile
                    } else {
                        $error_message = 'Invalid role. Contact administrator.';
                    }
                    exit;
                } else {
                    $error_message = 'Invalid password.';
                }
            } else {
                $error_message = 'No account linked to this email.';
            }
        } else {
            $error_message = 'Execute failed: ' . $stmt->error;
        }
        $stmt->close();
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In</title>
    <link rel="stylesheet" href="../CSS/signinstyles.css">
</head>
<body>
    <div class="container">
        <h2>Sign In</h2>
        <div id="error-message" class="<?php echo empty($error_message) ? 'hidden' : 'error-message'; ?>">
            <?php if (!empty($error_message)) echo $error_message; ?>
        </div>
        <form id="signin-form" action="../PHP/signin.php" method="POST">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="e.g. user@olive.com" required>
            <label for="password">Password</label>
            <div class="password-toggle">
                <input type="password" id="password-signin" name="password" placeholder="e.g. OLive2024*" required>
                <span class="toggle-icon" onclick="togglePassword('password-signin')">⬤</span>
            </div>
            <div class="credentials-management">
                <div class="forgot-password">
                    <a href="../PHP/forgot_password.php">Forgot Password?</a>
                </div>
                <div class="remember-me">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    <label for="rememberMe">Remember Me</label>
                </div>
            </div>
            <button type="submit" class="submit-btn">Sign In</button>
        </form>
        <div class="footer">
            <p>Don't have an account? <a href="../HTML/signup.html">Sign Up</a></p>
        </div>
    </div>
    <div class="center-bottom">
        Last updated October 10, 2024.
        &copy; 2024 OLive. All rights reserved.
    </div>
    <script src="../JS/signinscripts.js"></script>
</body>
</html>
