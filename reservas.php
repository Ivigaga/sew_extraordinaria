<?php
session_start();
require_once 'php/Usuario.php';
require_once 'php/Reserva.php';
require_once 'php/Recurso.php';

$usuarioObj = new Usuario();
$reservaObj = new Reserva();
$recursoObj = new Recurso();

$mensaje = '';
$error = '';
// Obtener recursos
$recursos = $recursoObj->listar();

// Procesar registro
if (isset($_POST['registro'])) {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $contrasena = $_POST['contrasena'];
    $registro = $usuarioObj->registrar($nombre, $email, $contrasena);

    if ($registro) {
        if ($registro === "email duplicado") {
            $error = 'Email ya registrado.';
        } else {
            //$mensaje = 'Registro exitoso. Por favor, inicia sesión.';
            $usuario = $usuarioObj->login($email, $contrasena);
            if ($usuario) {
                $_SESSION['usuario'] = $usuario;
            } else {
                $error = 'Erro al inicar sesión. Por favor, inicie sesión.';
            }
        }
    } else {
        $error = 'Error en el registro.';
    }
}

// Procesar login
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $contrasena = $_POST['contrasena'];
    $usuario = $usuarioObj->login($email, $contrasena);

    if ($usuario) {
        $_SESSION['usuario'] = $usuario;
    } else {
        $error = 'Email o contraseña incorrectos';
    }
}

// Cerrar sesión
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: reservas.php');
    exit;
}

// Procesar reserva
if (isset($_POST['reservar'])) {
    if (isset($_SESSION['usuario'])) {
        $id_usuario = $_SESSION['usuario']['ID'];
        $id_recurso = $recursos[$_POST['reservar']]['ID'];
        $cantidad = $_POST['cantidad'];
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];
        
        $recurso = $recursoObj->obtenerPorId($id_recurso);
        if ($recurso && $cantidad > 0) {
            $precio_total = $recurso['Precio'] * $cantidad;
            $reserva=$reservaObj->crear($id_usuario, $id_recurso, $fecha,$hora, $precio_total,$cantidad);
            if ($reserva === true) {
                $mensaje = 'Reserva realizada correctamente.';
            } elseif (is_string($reserva)) {
                $error = $reserva; // Mensaje de error específico
                
            } else {
                $error = 'Error al realizar la reserva.';
            }
        } else {
            $error = 'Recurso no encontrado o cantidad inválida.';
        }
    } else {
        $error = 'Debes iniciar sesión para reservar.';
    }
}

/*
// Procesar anulación
if (isset($_GET['anular'])) {
    if (isset($_SESSION['usuario'])) {
        $id_reserva = $_GET['anular'];
        if ($reservaObj->eliminar($id_reserva)) {
            
        } else {
            $error = 'Error al anular la reserva.';
        }
    }
}
*/
$reservas = [];
$presupuesto= 0;
if (isset($_SESSION['usuario'])) {
    $reservas = $reservaObj->listarPorUsuario($_SESSION['usuario']['ID']);
    $presupuesto = $reservaObj->obtenerPresupuesto($_SESSION['usuario']['ID']);
}
// Procesar anulación
if (isset($_GET['anular'])) {
    $index = $_GET['anular'];
    if($index>=0  && $index < sizeof($reservas)) {
        if (isset($_SESSION['usuario'])) {
            $id_reserva =$reservas[$index]['ID'];
            if ($reservaObj->eliminar($id_reserva)) {
            
            } else {
                $error = 'Error al anular la reserva.';
            }
        }
    }
}

// Obtener reservas del usuario
if (isset($_SESSION['usuario'])) {
    $reservas = $reservaObj->listarPorUsuario($_SESSION['usuario']['ID']);
    $presupuesto = $reservaObj->obtenerPresupuesto($_SESSION['usuario']['ID']);
}
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta name="author" content="Iván García García" />
    <meta name="description" content="Sistema de reservas turísticas" />
    <meta name="keywords" content="reservas, turismo, Asturias" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="multimedia/imagenes/escudo.ico" sizes="48x48" 
        type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <meta charset="UTF-8" />
    <title>Guía Sariego: Reservas</title>
</head>

<body>
    <header>
        <h1><a title="Inicio" href="index.html">Guía Sariego</a></h1>
        <nav>
            <a title="Inicio" href="index.html">Inicio</a>
            <a title="Gastronomía" href="gastronomia.html">Gastronomía</a>
            <a title="Rutas" href="rutas.html">Rutas</a>
            <a title="Meteorología" href="meteorología.html">Meteorología</a>
            <a title="Juego"  href="juego.html">Juego</a>
            <a title="Reservas" class="active" href="reservas.php">Reservas</a>
            <a title="Ayuda" href="ayuda.html">Ayuda</a>
        </nav>
    </header>
    
    <main>
        <h2>Sistema de Reservas</h2>
        <?php if (!isset($_SESSION['usuario'])): ?>
            <?php if ($mensaje): ?>
                <p ><?= $mensaje ?></p>
            <?php else: ?>
                <p></p>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <p><?= $error ?></p>
            <?php else: ?>
                <p></p>
            <?php endif; ?>
            <!-- Formulario de Registro -->
            <section>
                <h3>Registro de Usuario</h3>
                <form method="POST">
                    <label>Nombre: <input type="text" name="nombre" required></label>
                    <label>Email: <input type="email"  name="email" required> </label>
                    <label>Contraseña: <input type="password" name="contrasena" required></label>
                    <button type="submit" name="registro">Registrarse</button>
                </form>
            </section>
            
            <!-- Formulario de Login -->
            <section>
                <h3>Iniciar Sesión</h3>
                <form method="POST">
                    <label>Email: <input type="email" name="email" required></label>
                    <label>Contraseña: <input type="password" name="contrasena" required></label>               
                    <button type="submit" name="login">Iniciar Sesión</button>
                </form>
            </section>
        <?php else: ?>

                <p>Bienvenido, <?= $_SESSION['usuario']['Nombre'] ?> 
                   (<a href="reservas.php?logout=1">Cerrar sesión</a>)</p>

            
            <?php if ($mensaje): ?>
                <p ><?= $mensaje ?></p>
                <?php else: ?>
                <p></p>
            <?php endif; ?>
        
            <?php if ($error): ?>
                <p><?= $error ?></p>
                <?php else: ?>
                <p></p>
            <?php endif; ?>

            <!-- Reservas del Usuario -->
            <section>
                <h3>Mis Reservas</h3>
                <?php if (empty($reservas)): ?>
                    <p>No tienes reservas realizadas.</p>
                <?php else: ?>
                    <p>Total: <?= $presupuesto ?>€</p>
                    <ul>
                        <?php $i =0; ?>
                        <?php foreach ($reservas as $reserva): ?>
                            <li>
                                <?= $reserva['recurso_nombre'] ?> - 
                                <?= $reserva['Plazas'] ?> Personas -
                                Total: <?= $reserva['precio_total'] ?>€ - 
                                Fecha: <?= date('d/m/Y', strtotime($reserva['Fecha'])) ?> <?= date('H:i', strtotime($reserva['Hora'])) ?>
                                <a href="reservas.php?anular=<?= $i?>">Anular</a>
                            </li>
                            <?php $i++; ?>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </section>
            <!-- Lista de Recursos -->
            <section>
                <h3>Recursos Disponibles</h3>
                <?php $i =0; ?>
                <?php foreach ($recursos as $recurso): ?>
                    <article >
                        <h4><?= $recurso['Nombre'] ?></h4>
                        <p><?= $recurso['Descripcion'] ?></p>
                        <?php if (time() < strtotime($recurso['Fecha_Inicio'])): ?>
                             <p>Desde el <?= date('d/m/Y', strtotime($recurso['Fecha_Inicio'])) ?> hasta el <?= date('d/m/Y', strtotime($recurso['Fecha_Fin'])) ?></p>
                        <?php else: ?>
                        <p>Hasta el <?= date('d/m/Y', strtotime($recurso['Fecha_Fin'])) ?></p>
                        <?php endif; ?>
                        <p>Horario: <?= date('H:i', strtotime($recurso['Hora_inicio'])) ?> - <?= date('H:i', strtotime($recurso['Hora_fin'])) ?></p>
                        <p>Precio: <?= $recurso['Precio'] ?>€ </p>
                        <form method="POST">
                            <!--<input type="hidden" name="id_recurso" value="<?= $recurso['ID'] ?>"> -->
                            <label>Plazas: <input type="number" name="cantidad" min="1" max="<?= $recurso['Plazas'] ?>" required></label>
                            <label>Fecha: <input type="date" name="fecha" required></label>
                            <label>Hora: <input type="time" name="hora" required></label>
                            <button type="submit" name="reservar" value="<?= $i ?>">Reservar</button>
                        </form>
                        <?php $i++; ?>
                </article>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>