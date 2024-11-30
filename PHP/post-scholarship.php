<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db_connection.php";

if (!isset($_SESSION['user_id'])) {
    die("Error: User not logged in.");
}

$institution_id = $_SESSION['user_id']; // Use logged-in user's ID

// Check if institution exists in the institutions table
$check_institution = $conn->prepare("SELECT institution_id FROM institutions WHERE institution_id = ?");
$check_institution->bind_param("i", $institution_id);
$check_institution->execute();
$check_institution->store_result();

if ($check_institution->num_rows === 0) {
    die("Error: Institution ID not found in the institutions table.");
}

$check_institution->close();

// Continue with inserting the scholarship
$input = json_decode(file_get_contents("php://input"), true);

if ($input) {
    $title = trim($input['scholarship_name']);
    $description = trim($input['description']);
    $amount = floatval($input['amount']);
    $deadline = trim($input['deadline']);
    $category_id = 1; // Replace with your logic for categories

    // Insert the scholarship
    $stmt = $conn->prepare("INSERT INTO scholarships (title, scholarship_description, amount, application_deadline, category_id, institution_id) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssdssi", $title, $description, $amount, $deadline, $category_id, $institution_id);

    if ($stmt->execute()) {
        echo "Scholarship posted successfully!";
    } else {
        die("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} else {
    die("Invalid input!");
}
?>
