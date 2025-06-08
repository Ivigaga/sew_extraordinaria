<?php
class Conexion {
    private $host = 'localhost';
    private $db_name = 'reservas';
    private $username = 'DBUSER2025';
    private $password = 'DBPWD2025';
    public $conn;

    public function connect() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }
        return $this->conn;
    }
}
?>