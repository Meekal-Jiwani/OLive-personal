<?php
class SecurityTests {
    private $db;

    public function __construct($host, $username, $password, $database) {
        $this->db = new mysqli($host, $username, $password, $database);
        if ($this->db->connect_error) {
            die('Connect Error (' . $this->db->connect_errno . ') ' . $this->db->connect_error);
        }
    }

    public function testSQLInjection() {
        $injected_username = "admin' -- ";
        $injected_password = "any' or 'x'='x";

        $sql = "SELECT * FROM users WHERE username = '{$injected_username}' AND password = '{$injected_password}'";
        $result = $this->db->query($sql);

        if ($result && $result->num_rows > 0) {
            echo "SQL Injection vulnerability detected: Able to log in with injected credentials.\n";
        } else {
            echo "No SQL Injection vulnerability detected with basic tests.\n";
        }
    }

    public function __destruct() {
        $this->db->close();
    }
}

// Create a new instance of the test class
$securityTest = new SecurityTests('localhost', 'your_username', 'your_password', 'your_database');
$securityTest->testSQLInjection();
?>
