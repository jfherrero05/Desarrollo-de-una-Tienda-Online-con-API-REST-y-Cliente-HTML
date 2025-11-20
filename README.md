# Desarrollo-de-una-Tienda-Online-con-API-REST-y-Cliente-HTML
# Proyecto Tienda Online RA4

Aplicación web SPA (Single Page Application) simulada utilizando PHP para la API REST y JavaScript Vanilla para el cliente con persistencia en LocalStorage.

## Estructura
- `/api`: Endpoints PHP (Backend).
- `/data`: Base de datos en JSON.
- `/assets`: Recursos estáticos (JS/CSS).
- `*.html`: Vistas del cliente.

## Principios SOLID Aplicados (Explicación para la práctica)

1. **S - Responsabilidad Única (SRP):** - Separación clara: `login.js` solo maneja autenticación, `dashboard.js` solo muestra productos.
   - En PHP, `login.php` solo valida usuarios y `compra.php` solo procesa pedidos.

2. **O - Abierto/Cerrado (OCP):**
   - El sistema carga productos desde un JSON. Si queremos añadir nuevos productos o categorías, modificamos el JSON (`tienda.json`) sin necesidad de alterar el código fuente JavaScript que los renderiza.

3. **I - Segregación de Interfaces (ISP):**
   - El cliente (JS) consume solo los datos que necesita. En el login recibe el catálogo completo para cachearlo, pero en la compra solo envía los IDs necesarios, no objetos completos pesados.

## Instalación
1. Desplegar en servidor Apache/XAMPP.
2. Abrir `login.html`.
3. Usuario: `usuario1` / Password: `123`.