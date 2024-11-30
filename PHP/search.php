<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "OLive_database";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check which search type is requested
if (isset($_POST['search_type'])) {
    $searchType = $_POST['search_type'];

    if ($searchType === "institution") {
        // Institution search
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $address = isset($_POST['address']) ? trim($_POST['address']) : '';

        // ============ used to debug such issue with institutions part =======
        if (isset($_POST['name'], $_POST['address'])) {
            error_log("Name: " . $_POST['name']);
            error_log("Address: " . $_POST['address']);
        }
        // ==================================================================

        $query = "SELECT DISTINCT i.institution_name, i.website_url, i.address, u.date_joined
                  FROM institutions i
                  JOIN users u ON u.user_id = i.institution_id AND u.role = 'institution'
                  WHERE ('{$name}' != '' OR '{$address}' != '')
                  AND (i.institution_name LIKE ? OR ? = '')
                  AND (i.address LIKE ? OR ? = '')";



        $stmt = $conn->prepare($query);
        $likeName = '%' . $name . '%';
        $likeAddress = '%' . $address . '%';
        $stmt->bind_param("ssss", $likeName, $name, $likeAddress, $address);
        $stmt->execute();
        
        // ============ used to debug such issue with institutions part =======
        if (!$stmt->execute()) {
            error_log("SQL Error: " . $stmt->error);
        }
        // ==================================================================

        $result = $stmt->get_result();

        $institutions = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($institutions); // Return JSON to the frontend

    } elseif ($searchType === "scholarship") {
        // Scholarship search
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $category = isset($_POST['category']) ? trim($_POST['category']) : '';
        $criteria = isset($_POST['criteria']) ? trim($_POST['criteria']) : '';
        $gradeLevel = isset($_POST['grade_level']) ? trim($_POST['grade_level']) : '';

        $query = "SELECT DISTINCT s.title, c.category_name, s.amount, s.application_deadline, i.institution_name
                  FROM scholarships s
                  LEFT JOIN scholarship_categories c ON s.category_id = c.category_id
                  LEFT JOIN institutions i ON s.institution_id = i.institution_id
                  WHERE ('{$name}' != '' OR '{$category}' != '' OR '{$criteria}' != '' OR '{$gradeLevel}' != '')
                  AND (s.title LIKE ? OR ? = '')
                  AND (c.category_name LIKE ? OR ? = '')
                  AND (s.eligibility_criteria LIKE ? OR ? = '')
                  AND (s.grade_level LIKE ? OR ? = '')";

        $stmt = $conn->prepare($query);
        $likeName = '%' . $name . '%';
        $likeCategory = '%' . $category . '%';
        $likeCriteria = '%' . $criteria . '%';
        $likeGradeLevel = '%' . $gradeLevel . '%';
        $stmt->bind_param("ssssssss", $likeName, $name, $likeCategory, $category, $likeCriteria, $criteria, $likeGradeLevel, $gradeLevel);
        $stmt->execute();
        $result = $stmt->get_result();

        $scholarships = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($scholarships); // Return JSON to the frontend
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}

$conn->close();
?>
