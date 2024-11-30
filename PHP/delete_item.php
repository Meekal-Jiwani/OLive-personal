<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['id']) || empty($input['type'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID or type']);
    exit;
}

$id = $input['id'];
$type = $input['type'];

error_log("Delete request received: ID=$id, Type=$type, User ID=$user_id");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=OLive_database", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($type === 'link') {
        $stmt = $pdo->prepare("DELETE FROM user_documents WHERE document_id = ? AND user_id = ? AND type = 'link'");
    } elseif ($type === 'document') {
        $stmt = $pdo->prepare("DELETE FROM user_documents WHERE document_id = ? AND user_id = ? AND type = 'document'");
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid type specified']);
        exit;
    }

    $stmt->execute([$id, $user_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Item deleted successfully']);
    } else {
        error_log("Delete failed: ID=$id, Type=$type, User ID=$user_id");
        echo json_encode(['success' => false, 'message' => 'Item not found or already deleted']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
