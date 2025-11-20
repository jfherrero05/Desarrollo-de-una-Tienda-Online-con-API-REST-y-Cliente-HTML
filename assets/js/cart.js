document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) window.location.href = 'login.html';
    cargarCarrito();

    document.getElementById('checkout-btn').addEventListener('click', procesarCompra);
});

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const container = document.getElementById('cart-items');
    const totalElem = document.getElementById('total-price');
    
    container.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        container.innerHTML = '<p>El carrito está vacío.</p>';
        totalElem.textContent = '0.00 €';
        return;
    }

    carrito.forEach((prod, index) => {
        total += parseFloat(prod.precio);
        
        const item = document.createElement('div');
        item.className = 'card';
        item.style.marginBottom = '10px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.textAlign = 'left';

        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${prod.imagen}" style="width:50px; height:50px; object-fit:cover;">
                <div>
                    <strong>${prod.nombre}</strong><br>
                    <span>${prod.precio} €</span>
                </div>
            </div>
            <button class="btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        container.appendChild(item);
    });

    totalElem.textContent = total.toFixed(2) + ' €';
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); // Eliminar el elemento en esa posición
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Recargar la vista
    // Actualizar contador visual si lo tuviéramos en el navbar
}

async function procesarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // PREPARAR DATOS: Solo enviamos los IDs. 
    // Seguridad: No enviamos el precio, el servidor debe buscarlo.
    const listaIDs = carrito.map(p => p.id);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('api/compra.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                token: token, 
                productos: listaIDs 
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert(`¡Compra realizada con éxito!\nTotal validado por servidor: ${data.total} €`);
            // Limpiar carrito
            localStorage.removeItem('carrito');
            window.location.href = 'dashboard.html';
        } else {
            alert("Error en la compra: " + data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    }
}