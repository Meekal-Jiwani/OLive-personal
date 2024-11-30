<?php
// Assuming you are using session to track the logged-in user
session_start();

include '../PHP/db_connection.php';  // Include your database connection script

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

// Get the input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate the input data
if (isset($data['field']) && isset($data['value'])) {
    $field = $data['field'];
    $value = mysqli_real_escape_string($conn, $data['value']);
    $userId = $_SESSION['user_id'];

    // Prepare SQL query based on the field to update
    switch ($field) {
        case 'firstName':
            $query = "UPDATE users SET first_name = '$value' WHERE user_id = $userId";
            break;
        case 'lastName':
            $query = "UPDATE users SET last_name = '$value' WHERE user_id = $userId";
            break;
        case 'age':
            $query = "UPDATE users SET age = '$value' WHERE user_id = $userId";
            break;
        case 'location':
            $query = "UPDATE users SET location = '$value' WHERE user_id = $userId";
            break;
        case 'contactInfo':
            $query = "UPDATE users SET contact_info = '$value' WHERE user_id = $userId";
            break;
        case 'description':
            $query = "UPDATE users SET description = '$value' WHERE user_id = $userId";
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid field']);
            exit();
    }

    // Execute query
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true]);
    } else {
        // Log the error message for debugging
        $errorMessage = mysqli_error($conn);
        echo json_encode(['success' => false, 'message' => 'Error updating profile', 'error_details' => $errorMessage]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
}

mysqli_close($conn);
?>
