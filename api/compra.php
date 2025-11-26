<?php
// api/compra.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Recibir JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 1. Validaciones básicas
if (!isset($data['carrito']) || !is_array($data['carrito'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Carrito vacío o formato incorrecto"]);
    exit;
}

// 2. Cargar Tienda (Simulación de BBDD)
$rutaTienda = __DIR__ . '/../data/tienda.json';

if (!file_exists($rutaTienda)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error interno: No se encuentra tienda.json"]);
    exit;
}

$tiendaData = json_decode(file_get_contents($rutaTienda), true);
$productosDB = $tiendaData['productos'];

// 3. Calcular Total Real (Seguridad)
$totalServidor = 0;
$carritoCliente = $data['carrito'];

foreach ($carritoCliente as $item) {
    // Validar estructura del item
    if(!isset($item['id']) || !isset($item['cantidad'])) continue;
    
    $id = $item['id'];
    $cantidad = $item['cantidad'];
    
    // Buscar precio real
    foreach ($productosDB as $prodDB) {
        if ($prodDB['id'] == $id) {
            $totalServidor += ($prodDB['precio'] * $cantidad);
            break; 
        }
    }
}

// 4. Respuesta Exitosa
echo json_encode([
    "status" => "success",
    "message" => "Pedido procesado",
    "total" => $totalServidor
]);
?>