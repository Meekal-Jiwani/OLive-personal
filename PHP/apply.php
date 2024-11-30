<?php
// Database connection
include "db_connection.php";

$conn = new mysqli($host, $user, $password, $database);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data
    $student_id = $_POST['student_id'];
    $scholarship_id = $_POST['scholarship_id'];

    // Insert the application
    $stmt = $conn->prepare("INSERT INTO applications (student_id, scholarship_id, application_status, submission_date) VALUES (?, ?, 'In progress', NOW())");
    $stmt->bind_param("ii", $student_id, $scholarship_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Application submitted successfully!"]);
    } else {
        echo json_encode(["error" => "Failed to apply."]);
    }

    $stmt->close();
}
$conn->close();
?>
