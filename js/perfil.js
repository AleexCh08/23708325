document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el ID del perfil de la URL o usar un ID por defecto
    const perfilId = urlParams.get('id') || "23708325"; // ID por defecto
    
    // Cargar datos del perfil y la imagen
    fetch(`reto3/${perfilId}/perfil.json`)
        .then(response => {
            if (!response.ok) throw new Error(`No se encontró perfil con ID: ${perfilId}`);
            return response.text();
        })
        .then(text => {
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);
            const perfil = JSON.parse(jsonString);
            
            if (!perfil) throw new Error('El perfil está vacío o es inválido');
            actualizarPerfil(perfil);
            
            // Carga el index.json para obtener la imagen
            return fetch('reto3/datos/index.json');
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar index.json');
            return response.text();
        })
        .then(text => {
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);
            const perfiles = JSON.parse(jsonString);

            if (!perfiles) throw new Error('El listado de perfiles está vacío');
            
            // Buscar el perfil actual en el index
            const perfilEncontrado = perfiles.find(p => p.ci === perfilId);
            
            if (perfilEncontrado) {
                const fotoPerfil = document.getElementById('foto-perfil');
                fotoPerfil.src = `reto3/${perfilEncontrado.imagen}`;
                fotoPerfil.alt = `Foto de ${perfilEncontrado.nombre}`;
                
                // Manejar error de carga de imagen
                fotoPerfil.onerror = function() {
                    this.src = 'img/placeholder.jpg';
                    this.alt = 'Imagen no disponible';
                };
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.content-box p').textContent = `Error: ${error.message}`;
        });
    
    function actualizarPerfil(perfil) {
        // Actualizar el título del sitio
        if (perfil.nombre) {
            document.title = perfil.nombre;
        }

        // Actualizar elementos del DOM según la estructura HTML existente
        const tableRows = document.querySelectorAll('.content-box table tbody tr');
        
        // Nombre (h2)
        document.querySelector('.content-box h2').textContent = perfil.nombre;
        
        // Descripción (p)
        document.querySelector('.content-box p').textContent = perfil.descripcion;
                 
        // Tabla de información
        if (tableRows.length >= 6) {
            // Color favorito
            tableRows[0].querySelector('td:last-child').textContent = perfil.color;
            
            // Libro favorito
            tableRows[1].querySelector('td:last-child').textContent = 
                Array.isArray(perfil.libro) ? perfil.libro.join(', ') : perfil.libro;
            
            // Música preferida
            tableRows[2].querySelector('td:last-child').textContent = 
                Array.isArray(perfil.musica) ? perfil.musica.join(', ') : perfil.musica;
            
            // Videojuegos favoritos
            tableRows[3].querySelector('td:last-child').textContent = 
                Array.isArray(perfil.video_juego) ? perfil.video_juego.join(', ') : perfil.video_juego;

            // Lenguajes aprendidos
            tableRows[4].querySelector('td:last-child').textContent = 
                Array.isArray(perfil.lenguajes) ? perfil.lenguajes.join(', ') : perfil.lenguajes;

            // Email
            const emailLink = tableRows[5].querySelector('td:last-child a');
            if (emailLink && perfil.email) {
                emailLink.textContent = perfil.email;
                emailLink.target = `_blank`;
                emailLink.href = `mailto:${perfil.email}`;
            }
        }
    }
});

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
        .catch(error => console.error('Error:', error));

        function actualizarHTML(config) {
            // Actualizar tabla de información
            const tableRows = document.querySelectorAll('.content-box table tbody tr');
            if (tableRows.length >= 6) {
                // Color favorito
                tableRows[0].querySelector('td:first-child').textContent = config.color;
                
                // Libro favorito
                tableRows[1].querySelector('td:first-child').textContent = config.libro;
                
                // Música preferida
                tableRows[2].querySelector('td:first-child').textContent = config.musica;
                
                // Videojuegos favoritos
                tableRows[3].querySelector('td:first-child').textContent = config.video_juego;

                // Lenguajes aprendidos
                tableRows[4].querySelector('td:first-child').textContent = config.lenguajes;

                // Email
                tableRows[5].querySelector('td:first-child').textContent = config.email;
            }
        }
});