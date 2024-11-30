<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['field']) || !isset($data['value'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

$field = $data['field'];
$value = $conn->real_escape_string($data['value']);

// Debug: Log received field and value
error_log("Received field: $field");
error_log("Received value: $value");

// Allowed fields
$allowed_fields = [
    'institution_name',
    'email',
    'website_url',
    'nature',
    'address',
    'phone_number'
];

// Check if the field is allowed
if (!in_array($field, $allowed_fields)) {
    echo json_encode(['success' => false, 'message' => 'Invalid field']);
    exit();
}

// Prepare the SQL query
$query = "UPDATE institutions SET $field = ? WHERE institution_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

// Bind parameters and execute
$stmt->bind_param('si', $value, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Field updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update field']);
}

$stmt->close();
$conn
?>