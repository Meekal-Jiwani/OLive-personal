<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "OLive_database";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch categories from the database
$query = "SELECT name FROM categories ORDER BY name ASC";
$result = $conn->query($query);

if ($result) {
    $categories = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($categories); // Return JSON to the frontend
} else {
    // Log any SQL errors
    error_log("SQL Error: " . $conn->error);
    echo json_encode(["error" => "Failed to fetch categories"]);
}

$conn->close();
?>
