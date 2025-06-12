class Pregunta {
  constructor(texto, opciones, indiceCorrecta) {
    this.texto = texto;
    this.opciones = opciones;
    this.indiceCorrecta = indiceCorrecta;
  }

  esCorrecta(indice) {
    return indice === this.indiceCorrecta;
  }
}

class Juego {
  constructor(preguntas) {
    this.preguntas = preguntas;
    this.indice = 0;
    this.puntuacion = 0;

    var seccion = document.body.querySelector("main").querySelector("section");
    this.seccion = seccion;
    this.hPregunta = seccion.querySelector("h3");
    this.fieldset = seccion.querySelector("fieldset");
    this.ulOpciones = seccion.querySelector("ul");
    this.boton = seccion.querySelector("button");

    this.boton.addEventListener("click", () => this.procesarRespuesta());

    this.mostrarPregunta();
  }

  mostrarPregunta() {
    const actual = this.preguntas[this.indice];
    this.hPregunta.textContent = actual.texto;
    this.ulOpciones.innerHTML = "";

    for (let i = 0; i < actual.opciones.length; i++) {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "opcion";
  input.value = i;
  input.id = `opcion-${i}`;  // Agregado

  const label = document.createElement("label");
  label.setAttribute("for", `opcion-${i}`);  // Asociar input y label
  label.appendChild(document.createTextNode(" " + actual.opciones[i]));

  li.appendChild(input);
  li.appendChild(label);
  this.ulOpciones.appendChild(li);
}

  }

  procesarRespuesta() {
    const opciones = this.ulOpciones.querySelectorAll('input[type="radio"]');
    let seleccion = -1;
    var error= document.body.querySelector("main").querySelector("section  ul + p");
    error.textContent = "";
    opciones.forEach((op) => {
      if (op.checked) {
        seleccion = parseInt(op.value);
      }
    });

    if (seleccion === -1) {
      
      error.textContent = "Debes seleccionar una respuesta.";
      return;
    }

    if (this.preguntas[this.indice].esCorrecta(seleccion)) {
      this.puntuacion++;
    }

    this.indice++;

    if (this.indice >= this.preguntas.length) {
      this.terminarJuego();
    } else {
      this.mostrarPregunta();
    }
  }

 terminarJuego() {
  this.hPregunta.remove();
  this.fieldset.remove();
  this.boton.remove();

  const pMensaje = document.createElement("p");
  pMensaje.textContent = "Tu puntuación final es:";

  const pNota = document.createElement("p");
  pNota.textContent = `${this.puntuacion} / ${this.preguntas.length}`;

  this.seccion.appendChild(pMensaje);
  this.seccion.appendChild(pNota);
}

}

class JuegoApp {
  constructor() {
    const preguntas = [
      new Pregunta("¿Sobre que concejo trata la página?", ["Rivadesella", "Pola de Siero", "Avilés", "Mieres", "Sariego"], 4),
      new Pregunta("¿Cuál es el plato típico del concejo?", ["Fabada", "Paella", "Tortilla", "Arepas", "Hamburguesa"], 0),
      new Pregunta("¿De hasta cuantos días se puede ver el tiempo en esta web?", ["5", "7", "3", "1", "15"], 1),
      new Pregunta("¿De qué no hay una foto en la web?", ["Un museo", "Una iglesia", "Un mapa", "Comida", "Una cueva"], 0),
      new Pregunta("¿Qué restaurante está en Sariego?", ["Asador Juan Luis", "Casa Ali", "Taberna La Casuca", "Bar Manolo", "El Mirador"], 2),
      new Pregunta("¿Dónde se pueden leer las noticias sobre el concejo?", ["Meteorología", "Gastronomía", "Ayuda", "Inicio", "Rutas"], 3),
      new Pregunta("¿Qué se come en el Antroxu?", ["Fabada", "Arroz con leche", "Sidra", "Cachopo", "Pitu caleya"], 4),
      new Pregunta("¿De que trata el video que hay en la web?", ["Un museo", "El alcalde", "Un restaurante", "Una iglesia", "Las fiestas del concejo"], 2),
      new Pregunta("¿Cuál es el precio de la ruta de las cercanías al cielo?", ["15€", "10€", "20€", "5€", "Es gratis"], 1),
      new Pregunta("¿Cuál no es un dato que se necesite para crearse una cuenta?", ["Nombre", "Email", "Contraseña", "DNI", "Ninguno de los anteriores"], 3)
    ];

    new Juego(preguntas);
  }
}

