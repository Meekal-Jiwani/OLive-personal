<?php
require 'C:\Users\meeka\Desktop\OLive\Clone\OLive\PHP\signup.php'; // Assume this file contains the database connection code

// Function to reset the database for testing
function resetDatabase() {
    // Add code to truncate relevant tables or reset them to a known state
    global $conn;
    $conn->query("TRUNCATE TABLE users");
    $conn->query("TRUNCATE TABLE students");
    $conn->query("TRUNCATE TABLE institutions");
}

// Test Function
function testDatabaseIntegration() {
    global $conn;

    resetDatabase(); // Ensure the database is clean before testing

    // Test data for a student
    $studentData = [
        'role' => 'student',
        'email' => 'teststudent@olive.com',
        'password' => 'TestPassword123',
        'first-name' => 'Test',
        'last-name' => 'Student',
        'dob' => '2000-01-01'
    ];

    // Insert the student into the database
    $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $studentData['email'], $studentData['password'], $studentData['role']);
    $stmt->execute();
    $userId = $stmt->insert_id;

    $stmt = $conn->prepare("INSERT INTO students (student_id, first_name, last_name, date_of_birth) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $userId, $studentData['first-name'], $studentData['last-name'], $studentData['dob']);
    $stmt->execute();

    // Verify data insertion
    $result = $conn->query("SELECT * FROM users WHERE email = 'teststudent@olive.com'");
    $user = $result->fetch_assoc();

    // Assert the user data is correctly saved
    assert($user['email'] === 'teststudent@olive.com', 'Email does not match!');
    assert($user['role'] === 'student', 'Role does not match!');

    // Verify student data
    $result = $conn->query("SELECT * FROM students WHERE student_id = $userId");
    $student = $result->fetch_assoc();

    assert($student['first_name'] === 'Test', 'First name does not match!');
    assert($student['last_name'] === 'Student', 'Last name does not match!');

    echo "Database integration test passed.\n";
}

testDatabaseIntegration();

$conn->close(); // Close the database connection
?>
