<?php
// Start the session to access the logged-in user's session
session_start();

// Include database connection
include 'db_connection.php';

// Check if the user is logged in (you can adjust the check as needed)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Get user ID from the session (this assumes you store user ID in the session)
$user_id = $_SESSION['user_id'];

// Query to fetch user profile data from the database
$query = "SELECT first_name, last_name, age, location, contact_info, description FROM users WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows > 0) {
    $user_data = $result->fetch_assoc();
    echo json_encode($user_data); // Send the user data as JSON
} else {
    echo json_encode(['error' => 'User not found']);
}

$stmt->close();
$conn->close();
?>
