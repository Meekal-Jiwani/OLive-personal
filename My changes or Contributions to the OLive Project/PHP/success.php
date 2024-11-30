<?php
session_start();  // Start session to access session variables

// Check if the session is set
if (!isset($_SESSION['user_name'])) {
    header("Location: ../HTML/signup.html");
    exit();
}

$user_name = $_SESSION['user_name'];  // Get the name
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <link rel="stylesheet" href="../CSS/signupstyles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome, <?php echo htmlspecialchars($user_name); ?>!</h1>
        <p>Your registration was successful. You can now sign in to access your account.</p>
        <a href="../HTML/signin.html" class="btn">Sign In</a>
    </div>
</body>
</html>
