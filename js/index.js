document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuración e idioma
    const lang = new URLSearchParams(window.location.search).get('lang') || 'ES'; // Idioma por defecto
    fetch(`reto3/conf/config${lang.toUpperCase()}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Idioma no soportado: ${lang}`);
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
                mostrarPerfiles(perfiles,);
                configurarBusqueda(perfiles, config);
                clickPerfiles();
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

        // Actualizar el placeholder
        const holderBoton = document.querySelector('header nav ul li:nth-child(3) form input[type="text"]');
        if (holderBoton && config.nombre) {
            holderBoton.placeholder = config.nombre;
            holderBoton.value = "";
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

    // Función para filtrar estudiantes
    function filtrarEstudiantes(textoBusqueda, perfiles) {
        const texto = textoBusqueda.toLowerCase();
        return perfiles.filter(perfil => 
        perfil.nombre.toLowerCase().includes(texto)
        );
    }
    
    // Función para manejar la búsqueda en tiempo real
    function configurarBusqueda(perfiles, config) {
        const inputBusqueda = document.getElementById('buscar-nombre');
        
        inputBusqueda.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.trim();
            const estudiantesFiltrados = filtrarEstudiantes(textoBusqueda, perfiles);
            mostrarPerfiles(estudiantesFiltrados, textoBusqueda, config);
            clickPerfiles();
        });
    }

    // Funcion para mostar los perfiles
    function mostrarPerfiles(perfiles, query = '', config) {
        const seccionEstudiantes = document.querySelector('section ul');
        if (!seccionEstudiantes) return;

        seccionEstudiantes.innerHTML = '';

        if (perfiles.length === 0) {
            // Mostrar mensaje cuando no hay resultados
            const noResults = document.createElement('section');
            noResults.className = 'no-results';
            noResults.innerHTML = `${config?.noresultados} <strong>${query}</strong>`;
            seccionEstudiantes.appendChild(noResults);
            return;
        }

        perfiles.forEach(perfil => {
            const li = document.createElement('li');
            li.className = 'estudiante';
            li.dataset.id = perfil.ci;
            li.innerHTML = `
                <img src="reto3/${perfil.imagen}" alt="Foto de ${perfil.nombre}">                   
                <h6>${perfil.nombre}</h6>
            `;
            seccionEstudiantes.appendChild(li);
        });
    }

    // Funcion para redirigir desde el index al perfil del estudiante seleccionado
    function clickPerfiles() {
        document.querySelectorAll('.estudiante').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        document.querySelectorAll('.estudiante').forEach(item => {
            item.addEventListener('click', function() {
                const idEstudiante = this.dataset.id;
                const lang = new URLSearchParams(window.location.search).get('lang') || 'ES';
                window.location.href = `perfil.html?id=${idEstudiante}&lang=${lang}`;
            });
        });
    }
});