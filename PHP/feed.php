<?php
include "db_connection.php";

$query = "
    SELECT 
        scholarships.title AS scholarship_name,
        scholarships.scholarship_description,
        scholarships.amount,
        DATE_FORMAT(scholarships.application_deadline, '%Y-%m-%d') AS deadline,
        DATE_FORMAT(scholarships.created_at, '%Y-%m-%d') AS date_posted,
        institutions.institution_name,
        institutions.logo_path AS institution_logo,
        scholarship_categories.category_name AS category
    FROM scholarships
    JOIN institutions ON scholarships.institution_id = institutions.institution_id
    LEFT JOIN scholarship_categories ON scholarships.category_id = scholarship_categories.category_id
    ORDER BY scholarships.created_at DESC
";

$result = $conn->query($query);

if (!$result) {
    echo json_encode(["error" => "Database query failed: " . $conn->error]);
    exit;
}

if ($result->num_rows > 0) {
    $scholarships = [];
    while ($row = $result->fetch_assoc()) {
        $scholarships[] = $row;
    }
    echo json_encode($scholarships);
} else {
    echo json_encode(["message" => "No scholarships found."]);
}

$conn->close();
?>
