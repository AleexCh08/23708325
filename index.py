import json
import os
from urllib.parse import parse_qs

def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
            content = content.replace('const perfil =', '')\
                            .replace('const config =', '')\
                            .strip().rstrip(';')
            return json.loads(content)
    except Exception as e:
        print(f"Error cargando {path}: {str(e)}")
        return None

def generate_profile_html(perfil_data, config_data):
    with open('perfil.html', 'r', encoding='utf-8') as f:
        html_template = f.read()

    # Actualizar metadatos básicos
    html = html_template.replace('<title></title>', f'<title>{perfil_data.get("nombre", "")}</title>')
    
    # Actualizar la imagen del perfil
    html = html.replace(
        '<img id="foto-perfil" src="" alt="" data-profile-id="" />',
        f'<img id="foto-perfil" src="reto3/{perfil_data["ci"]}/{perfil_data.get("imagen", "default.jpg")}" alt="Foto de {perfil_data["nombre"]}" data-profile-id="{perfil_data["ci"]}" />'
    )

    # Actualizar contenido principal
    html = html.replace('<h2></h2>', f'<h2>{perfil_data.get("nombre", "")}</h2>')
    html = html.replace('<p></p>', f'<p>{perfil_data.get("descripcion", "")}</p>')

    # Preparar datos para la tabla
    table_data = [
        (config_data.get("color", "Color favorito"), perfil_data.get("color", "")),
        (config_data.get("libro", "Libro favorito"), ', '.join(perfil_data["libro"]) if isinstance(perfil_data["libro"], list) else perfil_data["libro"]),
        (config_data.get("musica", "Música preferida"), ', '.join(perfil_data["musica"]) if isinstance(perfil_data["musica"], list) else perfil_data["musica"]),
        (config_data.get("video_juego", "Videojuegos favoritos"), ', '.join(perfil_data["video_juego"]) if isinstance(perfil_data["video_juego"], list) else perfil_data["video_juego"]),
        (config_data.get("lenguajes", "Lenguajes aprendidos"), ', '.join(perfil_data["lenguajes"]) if isinstance(perfil_data["lenguajes"], list) else perfil_data["lenguajes"]),
        (config_data.get("email", "Email"), f'<a href="mailto:{perfil_data["email"]}" target="_blank">{perfil_data["email"]}</a>')
    ]

    # Actualizar la tabla 
    for i, (label, value) in enumerate(table_data):
        html = html.replace(
            f'<td></td>\n              <td></td>', 
            f'<td>{label}</td>\n              <td>{value}</td>', 
            1
        )

    html = html.replace('href="css/style.css"', 'href="/static/css/style.css"')
    html = html.replace('src="js/perfil.js"', 'src="/static/js/perfil.js"')
    html = html.replace('href="img/favicon.ico"', 'href="/img/favicon.ico"')
    
    html = html.replace('src="reto3/', 'src="/reto3/')

    return html

def application(environ, start_response):
    path = environ.get('PATH_INFO', '')
    query = parse_qs(environ.get('QUERY_STRING', ''))

    # Página principal
    if path == '/' or path == '/index.html':
        try:
            with open('./index.html', 'rb') as f:
                content = f.read()
            start_response('200 OK', [('Content-Type', 'text/html')])
            return [content]
        except FileNotFoundError:
            start_response('404 Not Found', [])
            return [b'index.html no encontrado']
        
    # Endpoint para el perfil
    elif path == '/perfil':
        perfil_id = query.get('id', ['23708325'])[0]  # ID por defecto
        lang = query.get('lang', ['ES'])[0].upper()

        # Cargar datos
        perfil = load_json(f'./reto3/{perfil_id}/perfil.json')
        config = load_json(f'./reto3/conf/config{lang}.json')

        if not perfil or not config:
            start_response('404 Not Found', [('Content-Type', 'text/plain')])
            return [b'Perfil o configuracion no encontrados']

        # Generar HTML
        html = generate_profile_html(perfil, config)
        start_response('200 OK', [('Content-Type', 'text/html')])
        return [html.encode('utf-8')]

    # Servir archivos estáticos
    elif path.startswith(('/static/', '/img/', '/reto3/')): 
        static_path = f".{path}" 
        
        try:
            with open(static_path, 'rb') as f:
                content = f.read()

            content_type = 'text/plain'
            if path.endswith('.css'):
                content_type = 'text/css'
            elif path.endswith('.js'):
                content_type = 'application/javascript'
            elif path.endswith('.ico'):
                content_type = 'image/x-icon'
            elif path.endswith(('.jpg', '.jpeg')):
                content_type = 'image/jpeg'
            elif path.endswith('.png'):
                content_type = 'image/png'
            
            start_response('200 OK', [
                ('Content-Type', content_type),
                ('Cache-Control', 'max-age=3600') 
            ])
            return [content]
            
        except FileNotFoundError:
            start_response('404 Not Found', [])
            return [b'Archivo no encontrado']

    start_response('404 Not Found', [])
    return [b'Ruta no encontrada']

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    httpd = make_server('0.0.0.0', 8000, application)
    # print("Servidor WSGI en puerto 8000...")
    httpd.serve_forever()