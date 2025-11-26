// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    cargarDatosUsuario();
    cargarTiendaDesdeLocal();
    actualizarContadorCarrito();
    mostrarVistosRecientemente(); // NUEVO: Requisito del PDF
});

function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function cargarDatosUsuario() {
    const user = localStorage.getItem('user');
    // Ajustado a tu ID: user-display
    if (user && document.getElementById('user-display')) {
        document.getElementById('user-display').textContent = `Hola, ${user}`;
    }
    
    // Botón Cerrar Sesión (Logout)
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Requisito: Eliminar TODOS los datos sensibles al salir [cite: 134]
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tienda_data');
            localStorage.removeItem('carrito');
            localStorage.removeItem('productos_vistos'); // Limpiar historial también
            window.location.href = 'login.html';
        });
    }
}

function cargarTiendaDesdeLocal() {
    // 1. Recuperar string del LocalStorage (Usamos TU clave 'tienda_data')
    const tiendaDataRaw = localStorage.getItem('tienda_data');
    
    if (!tiendaDataRaw) {
        // Si alguien intenta entrar sin pasar por login, lo echamos
        window.location.href = 'login.html';
        return;
    }

    // 2. Convertir a Objeto JSON
    const tiendaData = JSON.parse(tiendaDataRaw);
    const categorias = tiendaData.categorias;
    const productos = tiendaData.productos;

    // 3. Renderizar Categorías (Usamos TU ID 'categories-container')
    const catContainer = document.getElementById('categories-container');
    if (catContainer) {
        catContainer.innerHTML = ''; // Limpiar antes de pintar
        categorias.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card';
            // Ajusta este HTML según tu CSS
            card.innerHTML = `
                <h3>${cat.nombre}</h3>
                <button class="btn" onclick="verCategoria(${cat.id})">Ver Productos</button>
            `;
            catContainer.appendChild(card);
        });
    }

    // 4. Renderizar Productos Destacados (Usamos TU ID 'products-container')
    const prodContainer = document.getElementById('products-container');
    if (prodContainer) {
        prodContainer.innerHTML = ''; // Limpiar
        // Filtramos solo los destacados según requisito
        const destacados = productos.filter(p => p.destacado === true);

        destacados.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}" style="max-width: 100%; height: auto;">
                <h4>${prod.nombre}</h4>
                <p>${prod.precio} €</p>
                <button class="btn" onclick="verProducto(${prod.id})">Ver Detalles</button>
                <button class="btn" onclick="agregarAlCarrito(${prod.id})">Añadir</button>
            `;
            prodContainer.appendChild(card);
        });
    }
}

// --- NUEVA FUNCIÓN: Productos Vistos Recientemente [cite: 164] ---
function mostrarVistosRecientemente() {
    // Busca un contenedor en tu HTML. Si no existe, no hace nada.
    // Te sugiero añadir <div id="recientes-container"></div> en tu dashboard.html abajo del todo.
    const recientesContainer = document.getElementById('recientes-container');
    const vistosIds = JSON.parse(localStorage.getItem('productos_vistos')) || [];
    const tiendaData = JSON.parse(localStorage.getItem('tienda_data'));

    if (recientesContainer && vistosIds.length > 0 && tiendaData) {
        recientesContainer.innerHTML = '<h3>Vistos Recientemente</h3>';
        const listaDiv = document.createElement('div');
        listaDiv.className = 'grid-recientes'; // Usa tus clases CSS de grid

        vistosIds.forEach(id => {
            const prod = tiendaData.productos.find(p => p.id === id);
            if(prod) {
                const card = document.createElement('div');
                card.className = 'card-mini'; // Una clase más pequeña
                card.innerHTML = `<p>${prod.nombre}</p>`;
                listaDiv.appendChild(card);
            }
        });
        recientesContainer.appendChild(listaDiv);
    }
}

// Funciones globales
window.verCategoria = (id) => {
    localStorage.setItem('current_category_id', id);
    window.location.href = 'categories.html';
};

window.verProducto = (id) => {
    // Guardamos en historial de vistos [cite: 182]
    let vistos = JSON.parse(localStorage.getItem('productos_vistos')) || [];
    if(!vistos.includes(id)) {
        vistos.push(id);
        localStorage.setItem('productos_vistos', JSON.stringify(vistos));
    }
    
    localStorage.setItem('current_product_id', id);
    window.location.href = 'product.html';
};

window.agregarAlCarrito = (idProducto) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // IMPORTANTE: Tu compra.php espera IDs o cantidad. 
    // Vamos a guardar un objeto simple: {id, cantidad}
    
    const existente = carrito.find(item => item.id === idProducto);
    if(existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id: idProducto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert('Producto añadido');
};

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const countSpan = document.getElementById('cart-count');
    if(countSpan) countSpan.textContent = carrito.length;
}