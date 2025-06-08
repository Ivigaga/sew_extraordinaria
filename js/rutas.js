class Rutas {
  constructor() {
    this.doesApiWork = window.File && window.FileReader && window.FileList && window.Blob;
    this.indiceActual=0;
    this.rutas= [];
  }

  leerArchivoTexto(files) {
    this.rutas=[];
    const archivo = files[0];
    const extension = archivo.name.split(".").pop();
    const areaVisualizacion = document.querySelector("main p:last-of-type");
    areaVisualizacion.innerText = "";

    const main = document.querySelector("main");
    

    const tipoTexto = /text.*/;
    var remove= document.querySelectorAll('main> p:last-of-type ~ *');
    for (var i = 0; i < remove.length; i++) {
      remove[i].remove();
    }

    if (!this.doesApiWork) return;

    const lector = new FileReader();

    lector.onload = async (evento) => {
      const contenido = lector.result;

      if (archivo.type.match(tipoTexto) && extension === "xml") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contenido, "text/xml");
        await this.formatXML(xmlDoc);
      } 
       else {
        areaVisualizacion.innerText = "Error : ¡¡¡ Archivo no válido !!!";
      }
    };

    lector.readAsText(archivo);
  }

  insertarBotonesNavegacion(parent) {
    const nav = document.createElement("section");

    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "◄";
    btnAnterior.onclick = () => this.mostrarAnterior();

    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "►";
    btnSiguiente.onclick = () => this.mostrarSiguiente();

    var title = parent.querySelector("h3");
    if (title) {
      title.prepend( btnAnterior);
      title.append( btnSiguiente);
    } else {
      parent.appendChild(btnAnterior);
      parent.appendChild(btnSiguiente);
    }

    //nav.appendChild(btnAnterior);
    //nav.appendChild(btnSiguiente);
    //parent.insertBefore(nav, document.querySelector("main article p"));
  }

  mostrarAnterior() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
     
    }else{
      this.indiceActual=this.rutas.length - 1;
    }
     this.mostrarRutaActual();
  }

  mostrarSiguiente() {
    if (this.indiceActual < this.rutas.length - 1) {
      this.indiceActual++;
    }else{
      this.indiceActual=0;
    }
    this.mostrarRutaActual();
  }

  readKml(texto) {
    const lineas = texto.split(/\r?\n/);
    const coordenadas = [];
    let areCoordinates = false;

    for (const linea of lineas) {
      if (linea.trim() === "<coordinates>") {
        areCoordinates = true;
      } else if (linea.trim() === "</coordinates>") {
        areCoordinates = false;
      } else if (areCoordinates) {
        const puntos = linea.trim().split(",");
        if (puntos.length >= 2) {
          coordenadas.push({ lat: parseFloat(puntos[1]), lng: parseFloat(puntos[0]) });
        }
      }
    }

    return this.initMap(coordenadas);
  }

  initMap(coordinates) {
    const div = document.createElement("div");
    // Insertar primero en el DOM
    document.querySelector("main ").appendChild(div);

    // Ahora inicializar el mapa
    const map = new google.maps.Map(div, {
      zoom: 15,
      center: coordinates[0],
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });


    const flightPath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);
    return div;
  }

  async formatXML(xml) {
    var s = this.self;
    var texto = "";
    var nodes = xml.documentElement.children;
    this.xml= xml;
    this.rutas = nodes;
    var node = nodes[this.indiceActual];
    await this.formatRuotes(node, 3);
    

  }

  async mostrarRutaActual() {
    var remove= document.querySelectorAll('main> p:last-of-type ~ *');
    for (var i = 0; i < remove.length; i++) {
      remove[i].remove();
    }
    await this.formatXML(this.xml);
  }

  async formatRuotes(route, cabecera) {
    var nodes = route.children;
    var texto = `<h${cabecera}>${nodes[0].textContent}</h${cabecera}>`;;
    var a = document.createElement("article");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      texto += await this.formatNodes(node, cabecera, a);
    }

    a.innerHTML += texto;
    document.querySelector("main").append(a);
    this.insertarBotonesNavegacion(a);

    try {
      var response = await fetch("xml/" + route.getElementsByTagName("planimetria")[0].textContent);
      var kmlContent = await response.text();
      var tituloPlanimetria = document.createElement("h3");
      tituloPlanimetria.textContent = "Planimetria de la ruta";
      document.querySelector("main").append(tituloPlanimetria);
      const mapaDiv = this.readKml(kmlContent);

    } catch (err) {
      console.error("Error cargando KML:", err);
    }
    var response = await fetch("xml/" + route.getElementsByTagName("altimetria")[0].textContent);
    var svgContent = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgContent;

    const svgElement = tempDiv.querySelector("svg");
    svgElement.setAttribute("version", "1.1");

    const newSvg = document.createElement("svg");
    newSvg.innerHTML = tempDiv.innerHTML;
    Array.from(svgElement.attributes).forEach(attr => {
      newSvg.setAttribute(attr.name, attr.value);
    });
    var tituloAltimetria = document.createElement("h3");
    tituloAltimetria.textContent = "Altimetría de la ruta";
    document.querySelector("main").append(tituloAltimetria);
    document.querySelector("main").append(newSvg);

  }

  async formatNodes(node, cabecera, a) {
    var text = "";

    if (node.children.length > 0) {
      const children = node.children;
      if (node.nodeName === "ruta" || node.nodeName === "hito") {
        text += `<h${cabecera}>${children[0].textContent}</h${cabecera}>`;
      } else {
        text += `<h${cabecera}>${node.nodeName}</h${cabecera}>`;
      }

      for (const child of children) {
        text += await this.formatNodes(child, cabecera + 1);
      }
    } else {
      switch (node.nodeName) {
        case "imagen":
          text += `<img alt="${node.textContent.split(".")[0]}" src="multimedia/imagenes/${node.textContent}" />`;
          break;
        case "video":
          text += `
            <video controls preload="auto">
              <source src="multimedia/imagenes/${node.textContent}" type="video/mp4" />
            </video>`;
          break;
        case "referencia":
          text += `<p><a href="${node.textContent}">${node.textContent}</a></p>`;
          break;
        case "nombre":
          break;
        case "planimetria":

          break;
        case "altimetria":

          break;
        default:
          text += "<p>" + node.nodeName + ": " + node.textContent;
          if (node.attributes.length > 0) {
            for (var i = 0; i < node.attributes.length; i++) {
              text += " " + node.attributes[i].textContent;
            }
          }
          text += "</p>";
      }
    }

    return text;
  }
}
