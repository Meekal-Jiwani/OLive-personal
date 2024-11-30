## OLive Signup Page Testing

Dedicated to testing the signup page functionality of the OLive application, ensuring both user interface performance and backend integration. Each test script evaluates specific aspects of the signup process to guarantee a seamless user experience and secure data handling.

Test Scripts Overview

## 1. test-ui.js

Description: Automated UI tests for the OLive signup page.

Tests:

Element Visibility: Checks that all critical UI components (e.g., input fields for name, email, password, and buttons) are visible and correctly rendered.

User Interaction: Simulates user actions by:
Entering valid data into all fields and submitting the form.
Verifying that a success message appears after a successful signup.

Testing various edge cases such as:
Leaving mandatory fields blank and checking for corresponding error messages.
Entering invalid email formats and ensuring the system displays appropriate validation alerts.

Form Reset: Tests the functionality of resetting the form to its initial state, ensuring all fields clear properly when the reset button is clicked.

## 2. test-validation-and-security.js

Description: Validates client-side form validation and security measures for the signup process.

Tests:

Required Field Validation: Confirms that all mandatory fields prompt the correct validation messages when left empty.

Email Format Check: Verifies that email input adheres to a standard format (e.g., user@example.com) and alerts the user when the format is incorrect.

Password Strength Requirements: Tests that the password field enforces strength rules (e.g., minimum length, inclusion of special characters) and provides feedback if the criteria are not met.

Input Sanitization: Simulates attempts to input potentially harmful scripts or characters (XSS) into the fields to ensure that the application properly sanitizes user input before processing it.

## 3. test-database-integration.php

Description: Tests the integration of the signup form submissions with the backend database.

Tests:

Data Insertion: After a successful signup, confirms that user data is accurately inserted into the relevant tables (e.g., users, students).

Unique Constraints Validation: Attempts to insert duplicate email entries to ensure the system enforces unique constraints effectively, resulting in appropriate error handling.

Data Integrity Checks: Verifies that linked data (e.g., user roles, associated student records) is correctly maintained and adheres to database relationships.

## 4. test-security.php

Description: Assesses backend security measures concerning the signup process.

Tests:

SQL Injection Prevention: Tests the application's resilience against SQL injection attacks by attempting to inject malicious 
SQL commands through the signup form inputs.

Cross-Site Scripting (XSS) Protection: Validates that the application can handle XSS attacks by inputting scripts into the signup fields, ensuring these scripts are not executed.

Session Management: Evaluates session handling after signup, ensuring that user sessions are established securely and that users cannot access protected resources without proper authentication.