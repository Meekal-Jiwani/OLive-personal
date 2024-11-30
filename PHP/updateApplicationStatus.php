<?php
include "db_connection.php";

$conn = new mysqli($host, $user, $password, $database);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $application_id = $_POST['application_id'];
    $new_status = $_POST['application_status'];

    // Validate input
    if (!in_array($new_status, ['pending', 'accepted', 'rejected'])) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid status value"]);
        exit();
    }

    // Update the application status
    $stmt = $conn->prepare("UPDATE applications SET application_status = ? WHERE application_id = ?");
    $stmt->bind_param("si", $new_status, $application_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Application status updated successfully"]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Failed to update application status"]);
    }

    $stmt->close();
    $conn->close();
}
?>
