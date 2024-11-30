<?php
require 'C:\Users\meeka\Desktop\OLive\Clone\OLive\PHP\signup.php'; // Include database connection file

// Function to reset the database for testing
function resetDatabase() {
    global $conn;
    $conn->query("TRUNCATE TABLE users");
}

// Test Function
function testSecurity() {
    global $conn;
    resetDatabase();

    // SQL Injection Test
    $injectionData = [
        'email' => 'test@olive.com"; DROP TABLE users; --',
        'password' => 'password',
    ];

    $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'student')");
    $stmt->bind_param("ss", $injectionData['email'], $injectionData['password']);
    
    // Attempt to execute the injection
    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo "SQL Injection test passed. Error caught: " . $e->getMessage() . "\n";
    }

    // XSS Test
    $xssData = [
        'first-name' => '<script>alert("XSS")</script>',
        'last-name' => 'Student'
    ];

    // Simulate inserting XSS data into database
    $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES ('xss@olive.com', 'password', 'student')");
    $stmt->execute();

    $stmt = $conn->prepare("INSERT INTO students (student_id, first_name, last_name, date_of_birth) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $userId, $xssData['first-name'], $xssData['last-name'], '2000-01-01');
    $stmt->execute();

    // Check if the data is sanitized
    $result = $conn->query("SELECT first_name FROM students WHERE email = 'xss@olive.com'");
    $student = $result->fetch_assoc();

    assert($student['first_name'] !== '<script>alert("XSS")</script>', 'XSS vulnerability found!');

    echo "Security tests passed.\n";
}

testSecurity();

$conn->close(); // Close the database connection
?>
