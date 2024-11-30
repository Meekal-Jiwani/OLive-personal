<?php
session_start();
include 'db_connection.php';
header('Content-Type: application/json');

// Check database connection
if (!$conn) {
    die(json_encode(['error' => 'Database connection failed: ' . mysqli_connect_error()]));
}

// Check if the institution is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Institution not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Prepare the SQL query
$query = "SELECT institution_name, email, website_url FROM institutions WHERE institution_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    die(json_encode(['error' => 'Query preparation failed: ' . $conn->error]));
}

// Bind and execute the query
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
