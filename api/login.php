<?php
// api/login.php

// Configuración de cabeceras para aceptar JSON y permitir acceso
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// 1. Recibir los datos del cliente (Frontend)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Verificar que llegan los datos
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos de usuario o contraseña"]);
    exit;
}

$usuarioInput = $data['username'];
$passInput = $data['password'];

// 2. Cargar usuarios desde el archivo JSON
// Nota: Usamos __DIR__ para asegurarnos de encontrar la ruta correcta
$rutaUsuarios = __DIR__ . '/../data/usuarios.json';
$rutaTienda = __DIR__ . '/../data/tienda.json';

if (!file_exists($rutaUsuarios) || !file_exists($rutaTienda)) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: Archivos de datos no encontrados"]);
    exit;
}

$listaUsuarios = json_decode(file_get_contents($rutaUsuarios), true);

// 3. Validar credenciales
$usuarioValido = false;
$nombreUsuario = "";

foreach ($listaUsuarios as $user) {
    if ($user['username'] === $usuarioInput && $user['password'] === $passInput) {
        $usuarioValido = true;
        $nombreUsuario = $user['nombre'];
        break;
    }
}

if ($usuarioValido) {
    // 4. Éxito: Leer datos de la tienda y generar token
    // Requisito[cite: 102]: Token simple en variable del servidor
    $tokenSecreto = "TOKEN-TIENDA-RA4-2024"; 
    
    $datosTienda = json_decode(file_get_contents($rutaTienda), true);

    echo json_encode([
        "status" => "success",
        "message" => "Login correcto",
        "token" => $tokenSecreto,
        "user" => $nombreUsuario,
        "tienda" => $datosTienda // Aquí enviamos productos y categorías 
    ]);
} else {
    // 5. Fallo
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Usuario o contraseña incorrectos"
    ]);
}
?>