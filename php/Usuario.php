<?php
require_once 'Conexion.php';

class Usuario {
    private $db;
    private $table = 'usuarios';

    public function __construct() {
        $conexion = new Conexion();
        $this->db = $conexion->connect();
    }

    public function registrar($nombre, $email, $contrasena) {
    if ($this->loginSoloEmail($email)) {
        return "email duplicado";
    }
    $hash = password_hash($contrasena, PASSWORD_DEFAULT);
    $stmt = $this->db->prepare("INSERT INTO $this->table (nombre, email, contraseña) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $nombre, $email, $hash);
    return $stmt->execute();
}

    public function login($email, $contrasena) {
    $stmt = $this->db->prepare("SELECT * FROM $this->table WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    if ($usuario && password_verify($contrasena, $usuario['Contraseña'])) {
       
        return $usuario;
    }else {

        return false;
    }

    
}

public function loginSoloEmail($email) {
    $stmt = $this->db->prepare("SELECT * FROM $this->table WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}
}
?>