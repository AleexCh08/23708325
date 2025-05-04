document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuración
    fetch('reto3/conf/configES.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar configES.json');
            return response.text();
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
            
            actualizarHTML(config);
            return config; 
        })
        .then(config => {
            // Cargar perfiles después de la configuración
            return fetch('reto3/datos/index.json')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar index.json');
                return response.text();
            })
            .then(text => {
                const jsonStart = text.indexOf('[');
                const jsonEnd = text.lastIndexOf(']') + 1;
                const jsonString = text.slice(jsonStart, jsonEnd);
                const perfiles = JSON.parse(jsonString);

                if (!perfiles) {
                    console.error('El JSON está vacío o es inválido');
                    return;
                }
                mostrarPerfiles(perfiles);
            });
        })
        .catch(error => console.error('Error:', error));

    function actualizarHTML(config) {
        // Actualizar el título del sitio
        if (config.sitio) {
            document.title = `${config.sitio[0]} ${config.sitio[1]} ${config.sitio[2]}`;
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

    function mostrarPerfiles(perfiles) {
        const seccionEstudiantes = document.querySelector('section ul');
        if (!seccionEstudiantes) return;

        seccionEstudiantes.innerHTML = '';

        perfiles.forEach(perfil => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="reto3/${perfil.imagen}" alt="Foto de ${perfil.nombre}">                   
                <h6>${perfil.nombre}</h6>
            `;
            seccionEstudiantes.appendChild(li);
        });
    }
});