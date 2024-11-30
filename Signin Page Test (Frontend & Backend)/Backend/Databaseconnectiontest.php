<?php
use PHPUnit\Framework\TestCase;

class DatabaseConnectionTest extends TestCase
{
    protected function getConnection()
    {
        $mysqli = new mysqli("localhost", "username", "password", "test_database");
        $this->assertNotNull($mysqli);
        return $mysqli;
    }

    public function testConnectionIsValid()
    {
        $conn = $this->getConnection();
        $this->assertTrue($conn->connect_error == null);
    }
}
