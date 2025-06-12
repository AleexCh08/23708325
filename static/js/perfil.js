document.addEventListener('DOMContentLoaded', function() {
   
    const fotoPerfil = document.getElementById('foto-perfil');
    if (fotoPerfil) {
        // Manejar error de carga de imagen 
        fotoPerfil.onerror = function() {
            this.src = '/img/placeholder.jpg';
            this.alt = 'Imagen no disponible';
        };
    }

});

// Manejar el evento popstate para navegación hacia atrás/adelante
window.addEventListener('popstate', function() {
    window.location.reload();
});