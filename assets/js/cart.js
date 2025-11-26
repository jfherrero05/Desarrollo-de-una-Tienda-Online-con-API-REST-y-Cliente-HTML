document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar Carrito al iniciar
    renderizarCarrito();

    // 2. Event Listeners para botones
    const btnProcesar = document.getElementById('btn-procesar');
    const btnVaciar = document.getElementById('btn-vaciar');

    if(btnProcesar) btnProcesar.addEventListener('click', procesarCompra);
    if(btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);
});

function renderizarCarrito() {
    // Lectura segura de LocalStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tiendaData = JSON.parse(localStorage.getItem('tienda_data')); // Asegúrate que en login.js se guarda como 'tienda_data'
    
    const wrapper = document.getElementById('cart-items-wrapper');
    const totalDisplay = document.getElementById('total-display');

    // Validación: Si no hay datos de tienda (usuario no logueado o caché borrada)
    if (!tiendaData || !tiendaData.productos) {
        wrapper.innerHTML = '<p style="text-align:center; color:red;">Error: No hay datos de productos. Por favor, <a href="login.html" style="color:#38bdf8;">inicia sesión de nuevo</a>.</p>';
        return;
    }

    wrapper.innerHTML = ''; // Limpiar
    let total = 0;

    if (carrito.length === 0) {
        wrapper.innerHTML = '<p style="text-align:center; padding: 40px; font-size: 1.2rem;">Tu carrito está vacío 🛒</p>';
        totalDisplay.textContent = '0.00 €';
        return;
    }

    // Recorremos el carrito
    carrito.forEach((item, index) => {
        // Buscamos el producto real en los datos de la tienda
        const producto = tiendaData.productos.find(p => p.id == item.id);

        if (producto) {
            const subtotal = producto.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-left">
                    <img src="${producto.imagen}" onerror="this.src='https://via.placeholder.com/80?text=Sin+Foto'">
                    <div class="item-info">
                        <h4>${producto.nombre}</h4>
                        <p>Precio: ${producto.precio} € | Cantidad: ${item.cantidad}</p>
                    </div>
                </div>
                <div class="item-right">
                    <span class="item-price">${subtotal.toFixed(2)} €</span>
                    <button class="btn btn-danger" onclick="eliminarItem(${index})" style="padding: 5px 12px;">X</button>
                </div>
            `;
            wrapper.appendChild(div);
        }
    });

    totalDisplay.textContent = total.toFixed(2) + ' €';
}

// Función global para eliminar (necesaria para el onclick del HTML)
window.eliminarItem = function(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito(); // Repintar
};

function vaciarCarrito() {
    if(confirm('¿Seguro que quieres borrar todo?')) {
        localStorage.removeItem('carrito');
        renderizarCarrito();
    }
}

async function procesarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const msg = document.getElementById('status-msg');
    msg.textContent = "Procesando pedido...";
    msg.style.color = "#38bdf8"; // Azul

    // Preparar datos para PHP
    const payload = {
        token: localStorage.getItem('token') || 'TOKEN-TEST',
        carrito: carrito // Enviamos [{id:1, cantidad:1}, ...]
    };

    try {
        const response = await fetch('api/compra.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status === 'success') {
            msg.textContent = `✅ Compra OK! Total validado: ${data.total} €`;
            msg.style.color = "#22c55e"; // Verde
            
            // Vaciar carrito tras éxito
            localStorage.removeItem('carrito');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2500);
        } else {
            throw new Error(data.message || "Error desconocido");
        }

    } catch (error) {
        console.error(error);
        msg.textContent = "❌ Error: " + error.message;
        msg.style.color = "#ef4444";
    }
}