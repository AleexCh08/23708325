// Importar el archivo configES.json
document.addEventListener('DOMContentLoaded', function() {
    fetch('reto3/conf/configES.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el JSON');
            return response.text(); // Leer como texto en lugar de JSON
        })
        .then(text => {
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);

            const config = JSON.parse(jsonString);
            if (!config) {
                console.error('El JSON está vacío o es inválido');
                return;
            }
            
            actualizarIndexHTML(config); 
        })
        .catch(error => console.error('Error:', error));

    function actualizarIndexHTML(config) {
        // Actualizar el título del sitio
        if (config.sitio) {
            document.title = config.sitio.join(' ');
        }

        // Actualizar el primer elemento del nav
        const firstElement = document.querySelector('header nav ul li:nth-child(1)');
        if (firstElement && config.sitio) {
            firstElement.innerHTML = `${config.sitio[0]}<sub>${config.sitio[1]}</sub> ${config.sitio[2]}`;
        }

        // Actualizar el saludo en el header
        const saludoElement = document.querySelector('header nav ul li:nth-child(2)');
        if (saludoElement && config.saludo) {
            saludoElement.textContent = `${config.saludo}, Alexander Churio`;
        }

        // Actualizar el botón de login
        const loginBoton = document.querySelector('header nav ul li:nth-child(3) form input[type="submit"]');
        if (loginBoton && config.buscar) {
            loginBoton.value = config.buscar;
        }

        // Actualizar el footer
        const footer = document.querySelector('footer p');
        if (footer && config.copyRight) {
            footer.textContent = config.copyRight;
        }
    }
});