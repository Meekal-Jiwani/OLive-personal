<?php
include "db_connection.php"; // Database connection

session_start();
$institution_id = $_SESSION['institution_id']; // Ensure this is set during login

if ($_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['logo']['tmp_name'];
    $fileName = $_FILES['logo']['name'];
    $destination = "../images/" . $fileName;

    // Move uploaded file to the destination folder
    if (move_uploaded_file($fileTmpPath, $destination)) {
        // Update logo_path in the database
        $query = "UPDATE institutions SET logo_path = ? WHERE institution_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $destination, $institution_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Profile image updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update profile image in database."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Failed to move uploaded file."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "File upload error."]);
}

$conn->close();
?>
