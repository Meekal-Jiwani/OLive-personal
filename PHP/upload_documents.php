<?php
ob_start();
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Debugging session state
error_log("Session data: " . print_r($_SESSION, true));

// Check for user session
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

include 'db_connection.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

try {
    // Initialize PDO
    $pdo = new PDO("mysql:host=localhost;dbname=OLive_database", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure the request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $response['message'] = 'Invalid request method: Only POST allowed';
        error_log('Invalid request method.');
        echo json_encode($response);
        exit;
    }

    // Fetch input data
    $title = $_POST['title'] ?? null;
    $type = $_POST['type'] ?? null;

    if (!$title || !$type) {
        $response['message'] = 'Missing title or type';
        error_log('Missing title or type: ' . print_r($_POST, true));
        echo json_encode($response);
        exit;
    }

    // Handle Document Upload
    if ($type === 'document' && isset($_FILES['file'])) {
        $file_name = $_FILES['file']['name'];
        $file_path = '../uploads/' . basename($file_name);

        error_log("File details: " . print_r($_FILES, true));

        // Validate and move uploaded file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $file_path)) {
            // Insert document details into database
            $stmt = $pdo->prepare("INSERT INTO user_documents (user_id, title, file_name, file_path, type) VALUES (?, ?, ?, ?, 'document')");
            $stmt->execute([$user_id, $title, $file_name, $file_path]);

            $lastInsertId = $pdo->lastInsertId();

            $response['success'] = true;
            $response['message'] = 'File uploaded successfully';
            $response['id'] = $lastInsertId;
            $response['file_path'] = $file_path;
        } else {
            $response['message'] = 'Failed to move uploaded file';
            error_log('Failed to move uploaded file.');
        }
    }
    // Handle Link Addition
    elseif ($type === 'link' && isset($_POST['link'])) {
        $link = $_POST['link'];

        // Validate URL
        if (!filter_var($link, FILTER_VALIDATE_URL)) {
            $response['message'] = 'Invalid URL format';
            error_log("Invalid URL: $link");
            echo json_encode($response);
            exit;
        }

        error_log("Adding link: $link");

        // Insert link details into database
        try {
            $stmt = $pdo->prepare("INSERT INTO user_documents (user_id, title, relevant_links, type) VALUES (?, ?, ?, 'link')");
            $stmt->execute([$user_id, $title, $link]);

            $lastInsertId = $pdo->lastInsertId();
            error_log("Link added with ID: $lastInsertId");

            $response['success'] = true;
            $response['message'] = 'Link added successfully';
            $response['id'] = $lastInsertId;
        } catch (PDOException $e) {
            $response['message'] = 'Database error: ' . $e->getMessage();
            error_log('Database error: ' . $e->getMessage());
        }
    }
    // Invalid Input
    else {
        $response['message'] = 'Invalid input: Missing or incorrect type';
        error_log('Invalid input data: ' . print_r($_POST, true));
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
    error_log('Database error: ' . $e->getMessage());
} catch (Exception $e) {
    $response['message'] = 'Unexpected error: ' . $e->getMessage();
    error_log('Unexpected error: ' . $e->getMessage());
}

// End buffering and return JSON response
ob_end_clean();
echo json_encode($response);
?>
