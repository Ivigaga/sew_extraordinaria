<?php
require_once 'Conexion.php';

class Recurso {
    private $db;
    private $recursos;
    public function __construct() {
        $conexion = new Conexion();
        $this->db = $conexion->connect();
    }

    public function listar() {
        $sql = "
            SELECT r.*, t.nombre AS tipo 
            FROM recursos r
            JOIN tipo_recursos t ON r.Tipo_ID = t.ID
        ";
        $result = $this->db->query($sql);
        $recursos =$result->fetch_all(MYSQLI_ASSOC);
        return $recursos;
    }

    public function obtenerPorId($id) {
        $stmt = $this->db->prepare("SELECT r.*, t.nombre AS tipo FROM recursos r JOIN tipo_recursos t ON r.Tipo_ID = t.ID WHERE r.id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }
}
?>