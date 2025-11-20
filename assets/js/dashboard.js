// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    cargarDatosUsuario();
    cargarTiendaDesdeLocal();
    actualizarContadorCarrito();
});

function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function cargarDatosUsuario() {
    const user = localStorage.getItem('user');
    if (user) {
        document.getElementById('user-display').textContent = `Hola, ${user}`;
    }
    
    // Botón Cerrar Sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        // Requisito: Eliminar todo del localStorage al salir
        localStorage.clear(); // 
        window.location.href = 'login.html';
    });
}

function cargarTiendaDesdeLocal() {
    // 1. Recuperar string del LocalStorage
    const tiendaDataRaw = localStorage.getItem('tienda_data');
    
    if (!tiendaDataRaw) {
        console.error("No hay datos de tienda. Redirigiendo al login...");
        window.location.href = 'login.html';
        return;
    }

    // 2. Convertir a Objeto JSON
    const tiendaData = JSON.parse(tiendaDataRaw);
    const categorias = tiendaData.categorias;
    const productos = tiendaData.productos;

    // 3. Renderizar Categorías
    const catContainer = document.getElementById('categories-container');
    categorias.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${cat.nombre}</h3>
            <button class="btn" onclick="verCategoria(${cat.id})">Ver Productos</button>
        `;
        catContainer.appendChild(card);
    });

    // 4. Renderizar Productos Destacados
    const prodContainer = document.getElementById('products-container');
    // Filtramos solo los destacados según requisito
    const destacados = productos.filter(p => p.destacado === true); // 

    destacados.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        // Nota: Asegúrate de tener imágenes o usa un placeholder si falla
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/150'">
            <h4>${prod.nombre}</h4>
            <p>${prod.precio} €</p>
            <button class="btn" onclick="agregarAlCarrito(${prod.id})">Añadir al Carrito</button>
        `;
        prodContainer.appendChild(card);
    });
}

// Funciones globales para los botones (que definiremos en el siguiente paso)
window.verCategoria = (id) => {
    // Guardamos el ID de categoría en localStorage para saber qué mostrar en categories.html
    localStorage.setItem('current_category_id', id);
    window.location.href = 'categories.html';
};

window.agregarAlCarrito = (idProducto) => {
    // Lógica provisional, la perfeccionaremos en el paso del Carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tiendaData = JSON.parse(localStorage.getItem('tienda_data'));
    const producto = tiendaData.productos.find(p => p.id === idProducto);
    
    if(producto) {
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert('Producto añadido');
    }
};

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    document.getElementById('cart-count').textContent = carrito.length;
}