import xml.etree.ElementTree as ET

def obtenerCoordenadas(ruta,ns):
    coordenadas=[]
    longitud=ruta.find(ns+"coordenadas/"+ns+"longitud")
    latitud=ruta.find(ns+"coordenadas/"+ns+"latitud")
    altitud=ruta.find(ns+"coordenadas/"+ns+"altitud")
    ls=longitud.text
    las=latitud.text
    als=altitud.text
    coordenadas.append((float(ls),float(las),int(als)))
    for hito in ruta.findall(ns+"hitos/"+ns+"hito"):

        longitud=hito.find(ns+"coordenadas/"+ns+"longitud")
        latitud=hito.find(ns+"coordenadas/"+ns+"latitud")
        altitud=hito.find(ns+"coordenadas/"+ns+"altitud")
        ls=longitud.text
        las=latitud.text
        als=altitud.text
        coordenadas.append((float(ls),float(las),int(als)))

    return coordenadas

def coordenadasKML(archivo,ruta,ns):
    coordenadas=obtenerCoordenadas(ruta,ns)
    for coordenada in coordenadas:
        archivo.write(f"{coordenada[0]},{coordenada[1]},{coordenada[2]}\n")

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")


def writeFile(ruta,ns):
    nombreSalida  = ruta.findtext(ns+"planimetria")

    try:
        salida = open(nombreSalida,'w')
    except IOError:
        print ('No se puede crear el archivo ', nombreSalida)
        exit()



    # Escribe la cabecera del archivo de salida
    prologoKML(salida, ruta.findtext(ns+"nombre"))

    coordenadasKML(salida,ruta,ns)

    epilogoKML(salida)
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


main()
