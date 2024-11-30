<?php
session_start();
require_once('../PHP/db_connection.php'); // Ensure this connects to your database

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch user details
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $conn->prepare("SELECT email FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle email or password updates
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);

    // Update email
    if (isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        try {
            $stmt = $conn->prepare("UPDATE users SET email = ? WHERE user_id = ?");
            $stmt->bind_param("si", $data['email'], $userId);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Email updated successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "No changes made to the email"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error"]);
        }
    }

    // Update password
    if (isset($data['password'])) {
        if (strlen($data['password']) < 6) {
            http_response_code(400);
            echo json_encode(["error" => "Password must be at least 6 characters long"]);
            exit;
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        try {
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
            $stmt->bind_param("si", $hashedPassword, $userId);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "No changes made to the password"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error"]);
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Handle account deletion
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    // Start a transaction
    $conn->begin_transaction();

    try {
        // Disable foreign key checks to allow deletion from users table
        $conn->query("SET FOREIGN_KEY_CHECKS = 0");

        // Delete the user from the users table
        $deleteUserQuery = "DELETE FROM users WHERE user_id = $userId";
        if (!$conn->query($deleteUserQuery)) {
            throw new Exception("Failed to delete user: " . $conn->error);
        }

        // Commit the transaction
        $conn->commit();

        // End user session
        session_destroy();

        // Return success message
        echo json_encode(["success" => true, "message" => "Account deleted successfully"]);

    } catch (Exception $e) {
        // If an error occurs, rollback the transaction
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete the account: " . $e->getMessage()]);
    } finally {
        // Re-enable foreign key checks
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    }
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["error" => "Invalid request method"]);
}
?>
