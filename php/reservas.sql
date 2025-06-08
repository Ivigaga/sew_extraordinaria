-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2025 a las 18:18:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservas2`
--
CREATE DATABASE IF NOT EXISTS `reservas2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `reservas2`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

DROP TABLE IF EXISTS `recursos`;
CREATE TABLE `recursos` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(32) NOT NULL,
  `Plazas` int(11) NOT NULL,
  `Precio` decimal(4,2) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Hora_fin` time NOT NULL,
  `Tipo_ID` int(11) NOT NULL,
  `Descripcion` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_actuales`
--

DROP TABLE IF EXISTS `reservas_actuales`;
CREATE TABLE `reservas_actuales` (
  `ID` int(11) NOT NULL,
  `Usuario_ID` int(11) NOT NULL,
  `Recurso_ID` int(11) NOT NULL,
  `Plazas` int(11) NOT NULL,
  `Fecha_reserva` datetime NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time NOT NULL,
  `Precio` decimal(4,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_historico`
--

DROP TABLE IF EXISTS `reservas_historico`;
CREATE TABLE `reservas_historico` (
  `ID` int(11) NOT NULL,
  `Usuario_ID` int(11) NOT NULL,
  `Recurso_ID` int(11) NOT NULL,
  `Plazas` int(11) NOT NULL,
  `Fecha_reserva` datetime NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time NOT NULL,
  `Precio` decimal(4,0) NOT NULL,
  `Cancelacion` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_recursos`
--

DROP TABLE IF EXISTS `tipo_recursos`;
CREATE TABLE `tipo_recursos` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `email` varchar(32) NOT NULL,
  `Nombre` varchar(32) NOT NULL,
  `Contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `tipo_recursos` (`Tipo_ID`);

--
-- Indices de la tabla `reservas_actuales`
--
ALTER TABLE `reservas_actuales`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `reserva_usuario` (`Usuario_ID`),
  ADD KEY `reserva_recurso` (`Recurso_ID`);

--
-- Indices de la tabla `reservas_historico`
--
ALTER TABLE `reservas_historico`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `historico_usuario` (`Usuario_ID`),
  ADD KEY `historico_recurso` (`Recurso_ID`);

--
-- Indices de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `UNIQUE` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas_actuales`
--
ALTER TABLE `reservas_actuales`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD CONSTRAINT `tipo_recursos` FOREIGN KEY (`Tipo_ID`) REFERENCES `tipo_recursos` (`ID`);

--
-- Filtros para la tabla `reservas_actuales`
--
ALTER TABLE `reservas_actuales`
  ADD CONSTRAINT `reserva_recurso` FOREIGN KEY (`Recurso_ID`) REFERENCES `recursos` (`ID`),
  ADD CONSTRAINT `reserva_usuario` FOREIGN KEY (`Usuario_ID`) REFERENCES `usuarios` (`ID`);

--
-- Filtros para la tabla `reservas_historico`
--
ALTER TABLE `reservas_historico`
  ADD CONSTRAINT `historico_recurso` FOREIGN KEY (`Recurso_ID`) REFERENCES `recursos` (`ID`),
  ADD CONSTRAINT `historico_usuario` FOREIGN KEY (`Usuario_ID`) REFERENCES `usuarios` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
