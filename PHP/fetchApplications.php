<?php
// Include the database connection file
include "db_connection.php"; // Ensure this file is in the same directory as fetchApplications.php

// Establish the database connection
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Check if the HTTP request is a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if student_id is provided
    if (!isset($_GET['student_id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Missing required parameter: student_id"]);
        exit();
    }

    $student_id = $_GET['student_id'];

    // Fetch the applications
    $stmt = $conn->prepare("
        SELECT 
            a.application_id,
            s.title AS scholarship_title,
            s.scholarship_description,
            s.amount,
            s.application_deadline,
            i.institution_name,
            a.application_status
        FROM 
            applications a
        JOIN 
            scholarships s ON a.scholarship_id = s.scholarship_id
        JOIN 
            institutions i ON s.institution_id = i.institution_id
        WHERE 
            a.student_id = ?
        ORDER BY 
            a.submission_date DESC
    ");

    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Failed to prepare the SQL statement: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $applications = [];
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }

    $stmt->close();
    $conn->close();

    header("Content-Type: application/json");
    echo json_encode($applications);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only GET requests are allowed"]);
}
?>
