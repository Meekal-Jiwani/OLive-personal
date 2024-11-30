<?php
use PHPUnit\Framework\TestCase;

class CrudOperationsTest extends TestCase
{
    protected $conn;

    protected function setUp(): void
    {
        $this->conn = new mysqli("localhost", "username", "password", "test_database");
    }

    public function testCreateReadUpdateDelete()
    {
        // Create
        $this->conn->query("INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')");
        $insertId = $this->conn->insert_id;
        $this->assertTrue($insertId > 0);

        // Read
        $result = $this->conn->query("SELECT * FROM users WHERE id = $insertId");
        $this->assertTrue($result->num_rows > 0);

        // Update
        $updated = $this->conn->query("UPDATE users SET name = 'Jane Doe' WHERE id = $insertId");
        $this->assertTrue($updated);

        // Delete
        $deleted = $this->conn->query("DELETE FROM users WHERE id = $insertId");
        $this->assertTrue($deleted);
    }

    protected function tearDown(): void
    {
        $this->conn->close();
    }
}
