<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 1. Validar entrada básica
if (!isset($data['token']) || !isset($data['productos']) || !is_array($data['productos'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos inválidos"]);
    exit;
}

// 2. Validación simple de Token (en un caso real sería más complejo)
if ($data['token'] !== "TOKEN-TIENDA-RA4-2024") {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token inválido o expirado"]);
    exit;
}

// 3. Cargar base de datos de productos
$rutaTienda = __DIR__ . '/../data/tienda.json';
if (!file_exists($rutaTienda)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error de servidor interna"]);
    exit;
}

$tiendaData = json_decode(file_get_contents($rutaTienda), true);
$productosDB = $tiendaData['productos'];

// 4. Calcular TOTAL REAL (Seguridad)
$totalReal = 0;
$productosCompradosIds = $data['productos'];

// Recorremos los IDs que envía el cliente
foreach ($productosCompradosIds as $idCliente) {
    $encontrado = false;
    // Buscamos ese ID en nuestra "Base de datos" (JSON)
    foreach ($productosDB as $prodDB) {
        if ($prodDB['id'] == $idCliente) {
            $totalReal += $prodDB['precio'];
            $encontrado = true;
            break;
        }
    }
}

// 5. Responder éxito
echo json_encode([
    "status" => "success",
    "message" => "Pedido procesado correctamente",
    "total" => $totalReal // Devolvemos el total calculado por el servidor para confirmar
]);
?>