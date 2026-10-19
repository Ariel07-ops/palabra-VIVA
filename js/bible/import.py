import json
import os

# Lista de archivos de Biblias que quieras revisar
archivos_idiomas = [
    "data/SpaPlatense.json",
    "data/bibleweb.json",
    "data/bibliaAveMaria.json"
    # Agregá acá la ruta de otros archivos JSON que tengas en data/
]

def inspeccionar_json(ruta_archivo):
    if not os.path.exists(ruta_archivo):
        print(f"[X] El archivo '{ruta_archivo}' no existe.\n")
        return

    print("==================================================")
    print(f"ANALIZANDO: {ruta_archivo}")
    print("==================================================")

    try:
        with open(ruta_archivo, "r", encoding="utf-8") as f:
            datos = json.load(f)

        if isinstance(datos, dict):
            print(f"Claves raiz del JSON: {list(datos.keys())}")
            
            if "books" in datos and isinstance(datos["books"], list) and len(datos["books"]) > 0:
                primer_libro = datos["books"][0]
                print(f"Total de libros: {len(datos['books'])}")
                print(f"Estructura de Libro: {list(primer_libro.keys())}")
                print(f"Nombre 1er Libro: {primer_libro.get('name') or primer_libro.get('book') or primer_libro.get('title')}")
                
                if "chapters" in primer_libro and len(primer_libro["chapters"]) > 0:
                    primer_cap = primer_libro["chapters"][0]
                    print(f"Estructura de Capitulo: {list(primer_cap.keys())}")
                    if "verses" in primer_cap and len(primer_cap["verses"]) > 0:
                        primer_verso = primer_cap["verses"][0]
                        print(f"Estructura de Versiculo: {list(primer_verso.keys())}")

            libros = set()
            if "books" in datos:
                for b in datos["books"]:
                    nombre = b.get("name") or b.get("book") or b.get("title")
                    if not nombre and "chapters" in b:
                        for c in b["chapters"]:
                            for v in c.get("verses", []):
                                if "name" in v:
                                    import re
                                    nombre = re.sub(r'\s+\d+:\d+$', '', v["name"]).strip()
                                    break
                            if nombre: break
                    if nombre:
                        libros.add(nombre)

            print(f"\nMuestra de libros ({len(libros)} detectados):")
            print(sorted(list(libros))[:15])

        elif isinstance(datos, list):
            print(f"El JSON es un arreglo plano de {len(datos)} elementos.")
            if len(datos) > 0:
                print(f"Estructura del primer elemento: {list(datos[0].keys())}")

    except Exception as e:
        print(f"Error al leer {ruta_archivo}: {e}")
    
    print("\n")

for archivo in archivos_idiomas:
    inspeccionar_json(archivo)