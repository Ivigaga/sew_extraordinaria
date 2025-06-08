import xml.etree.ElementTree as ET

def obtenerPuntos(ruta,ns):
    puntos=[]

    distancia=50

    altitud=ruta.find(ns+"coordenadas/"+ns+"altitud")
    als=altitud.text
    puntos.append((distancia,int(als),"Inicio"))

    for hito in ruta.findall(ns+"hitos/"+ns+"hito"):

        largo=hito.find(ns+"distancia")
        altitud=hito.find(ns+"coordenadas/"+ns+"altitud")
        distancia+=float(largo.text)
        als=altitud.text
        nombre=hito.findtext(ns+"nombre")
        puntos.append((round(distancia,2),int(als),nombre))
    altitud=ruta.find(ns+"coordenadas/"+ns+"altitud")
    als=altitud.text

    print(puntos)
    return puntos


def puntosSVG(salida,ruta,ns):
    puntos = obtenerPuntos(ruta,ns)
    min_distancia = min([punto[0] for punto in puntos])-1
    escala_ancho=1650/(puntos[-1][0]-min_distancia)
    max_altitud = max([punto[1] for punto in puntos])+1
    escala_alto= 400/max_altitud


    min_distancia = min([punto[0] for punto in puntos])-1
    min_altitud = min([punto[1] for punto in puntos])
    # Calcular la altitud mínima de todos los puntos

    ultima_distancia = (puntos[-1][0]-min_distancia) * escala_ancho

    salida.write(f'<svg xmlns="http://www.w3.org/2000/svg" version="2.0" viewBox="0 0 1800 450">\n')
    salida.write('<polyline points=\n')
    salida.write('"')

    # Aplicar escalas fijas: 20 para distancia y 5 para altitud
    for punto in puntos:
        distancia_escalada = (punto[0]-min_distancia) * escala_ancho
        altitud_escalada = (-punto[1]+max_altitud) * escala_alto
        salida.write(f"{distancia_escalada},{altitud_escalada} ")

    # Después de dibujar los puntos originales, cerrar la polilínea hacia abajo:
    # 1. Añadir un punto con la misma distancia que el último, pero con la altitud mínima (base inferior)

    salida.write(f"{ultima_distancia},{(+max_altitud+1) * escala_alto} ")

    # 2. Añadir un punto con la misma distancia que el primer punto, y con la altitud mínima (base inferior)
    primera_distancia = (puntos[0][0]-min_distancia) * escala_ancho
    salida.write(f"{primera_distancia},{(+max_altitud+1) * escala_alto} ")

    # 3. Finalmente, cerrar el polígono regresando al primer punto (completar el ciclo)
    salida.write(f"{primera_distancia},{(-puntos[0][1]+max_altitud) * escala_alto} ")
    salida.write('"\n')
    salida.write('style="fill:white;stroke:red;stroke-width:4" />\n')
    for punto in puntos:
        distancia_escalada = (punto[0]-min_distancia) * escala_ancho
        altitud_escalada = (-punto[1]+max_altitud) * escala_alto
        salida.write(f'<text x="{distancia_escalada-20}" y="{altitud_escalada+50}" fill="black">{punto[2]}</text>\n')

def prologoSVG(salida):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    salida.write('<?xml version="1.0" encoding="UTF-8"?>\n')



def epilogoSVG(salida):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""


    salida.write('</svg>')


def writeFile(ruta,ns):
    nombreSalida  = ruta.findtext(ns+"altimetria")

    try:
        salida = open(nombreSalida,'w')
    except IOError:
        print ('No se puede crear el archivo ', nombreSalida)
        exit()

    # Procesamiento y generación del archivo kml

    nLinea=0


    # Escribe la cabecera del archivo de salida
    prologoSVG(salida)

    puntosSVG(salida,ruta,ns)

    epilogoSVG(salida)
    salida.close()

def main():
    nombreArchivo = "rutas.xml"
    ns = '{http://www.uniovi.es}'

    try:
        archivo = open(nombreArchivo,'r')
    except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()

    try:

        arbol = ET.parse(nombreArchivo)

    except IOError:
        print ('No se encuentra el archivo ', archivo)
        exit()

    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivo)
        exit()

    raiz=arbol.getroot()

    rutas=raiz.findall(ns+"ruta")
    for ruta in rutas:
        writeFile(ruta,ns)


if __name__ == "__main__":
    main()