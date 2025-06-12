<?php
require_once 'Conexion.php';

class Reserva {
    private $db;

    public function __construct() {
        $conexion = new Conexion();
        $this->db = $conexion->connect();
    }

    public function crear($id_usuario, $id_recurso, $fecha,$hora, $precio_total,$plazas) {
        $itsAvailable=$this->hasEnoughPlaces($fecha,$id_recurso, $plazas);
        $itsOpen=$this->itsOpen($id_recurso, $fecha, $hora);
        if($fecha < date('Y-m-d')) {
            return "La fecha de reserva no puede ser anterior a la actual.";
        }
        if($fecha==date('Y-m-d') && $hora < date('H:i')) {
            return "La hora de reserva no puede ser anterior a la actual.";
        }
        if($itsAvailable && $itsOpen) {
            $stmt = $this->db->prepare("INSERT INTO reservas_actuales (Usuario_ID, Recurso_ID, Fecha_reserva, Fecha, Hora, Precio,Plazas) VALUES (?, ?, NOW(), ?, ?, ?,?)");
            $stmt->bind_param('iissdi', $id_usuario, $id_recurso, $fecha, $hora, $precio_total,$plazas);
            return $stmt->execute(); // No se puede reservar
        }else {
            if(!$itsAvailable) {
                return "No hay suficientes plazas disponibles.";
            } else if(!$itsOpen) {
                return "El recurso no está disponible en la fecha y hora seleccionadas.";
            }
        }
       
    }

    public function listarPorUsuario($usuario_id) {
        $stmt = $this->db->prepare("
            SELECT ra.ID, r.Nombre AS recurso_nombre, ra.Fecha, ra.Hora, ra.Precio AS precio_total, ra.Plazas
            FROM reservas_actuales ra
            JOIN recursos r ON ra.Recurso_ID = r.ID
            WHERE ra.Usuario_ID = ? AND ra.Fecha >= CURDATE()
            ORDER BY ra.Fecha ASC, ra.Hora ASC
        ");
        $stmt->bind_param('i', $usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function obtenerPresupuesto($usuario_id) {
    $stmt = $this->db->prepare("
        SELECT SUM(ra.Precio) AS total
        FROM reservas_actuales ra
        WHERE ra.Usuario_ID = ? AND ra.Fecha >= CURDATE()
    ");

    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $fila = $resultado->fetch_assoc();

    // Devuelve 0 si no hay reservas
    return $fila['total'] !== null ? (float)$fila['total'] : 0.0;
}

    public function eliminar($reserva_id) {
        $this->db->begin_transaction();

        $insert = $this->db->prepare("
            INSERT INTO reservas_historico 
            (ID, Usuario_ID, Recurso_ID, Fecha_reserva, Fecha, Hora, Precio,Plazas, Cancelacion)
            SELECT ID, Usuario_ID, Recurso_ID, Fecha_reserva, Fecha, Hora, Precio,Plazas, 1
            FROM reservas_actuales WHERE ID = ?
        ");
        $insert->bind_param('i', $reserva_id);
        $insert->execute();

        $delete = $this->db->prepare("DELETE FROM reservas_actuales WHERE ID = ?");
        $delete->bind_param('i', $reserva_id);
        $delete->execute();

        $this->db->commit();
        return true;
    }


    public function canBook($fecha, $hora, $id_recurso, $plazas) {
        
        return $this->hasEnoughPlaces($fecha,$id_recurso, $plazas) && $this->itsOpen($id_recurso, $fecha, $hora);
    }

    public function hasEnoughPlaces($fecha, $id_recurso, $plazas) {
        $stmt = $this->db->prepare("
            SELECT Plazas FROM recursos WHERE ID = ?
        ");
        $stmt->bind_param('i', $id_recurso);
        $stmt->execute();
        $result = $stmt->get_result();
        $recurso = $result->fetch_assoc();

        $stmt = $this->db->prepare("
            SELECT count(ID) FROM reservas_actuales WHERE Fecha = ? AND Recurso_ID = ?
        ");
        $stmt->bind_param('si',$fecha, $id_recurso);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();
        $nReservas = $row[0];

        return ($nReservas + $plazas <= $recurso['Plazas']);
    }

    public function itsOpen($id_recurso, $fecha, $hora) {
        $stmt = $this->db->prepare("
            SELECT r.Fecha_Inicio, r.Fecha_Fin, r.Hora_inicio, r.Hora_fin 
            FROM recursos r 
            WHERE r.ID = ? 
        ");
        $stmt->bind_param('i', $id_recurso);
        $stmt->execute();
        $result = $stmt->get_result();
        $recurso = $result->fetch_assoc();
        return ($fecha>= $recurso['Fecha_Inicio'] && $fecha<= $recurso['Fecha_Fin'] && $hora >= $recurso['Hora_inicio'] && $hora <= $recurso['Hora_fin']);

    }
}
?>