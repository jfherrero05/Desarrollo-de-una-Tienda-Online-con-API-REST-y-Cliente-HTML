document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evitar recarga del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    // Limpiamos mensajes anteriores
    errorMsg.style.display = 'none';
    errorMsg.innerText = '';

    try {
        // 1. Petición al servidor (API REST) 
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            // 2. Guardar en LocalStorage [cite: 65]
            // Guardamos Token
            localStorage.setItem('token', data.token);
            // Guardamos Usuario
            localStorage.setItem('user', data.user);
            // Guardamos TODA la tienda (categorías y productos)
            // Esto evita consultas constantes al servidor [cite: 49]
            localStorage.setItem('tienda_data', JSON.stringify(data.tienda));

            // Inicializamos carrito vacío si no existe
            if (!localStorage.getItem('carrito')) {
                localStorage.setItem('carrito', JSON.stringify([]));
            }

            alert('Bienvenido ' + data.user);

            // 3. Redirigir al Dashboard [cite: 66]
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(data.message || 'Error en el login');
        }

    } catch (error) {
        console.error('Error:', error);
        errorMsg.innerText = error.message;
        errorMsg.style.display = 'block';
    }
});