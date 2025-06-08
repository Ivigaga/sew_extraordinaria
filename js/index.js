class Carrusel{
    createCarrusel(){
        var slides=document.querySelectorAll("img");
        var nextSlide = document.querySelector("article button:first-of-type");
        var prevSlide = document.querySelector("article button:last-of-type");
        // current slide counter
        let curSlide = slides.length - 1;
        // maximum number of slides
        let maxSlide = slides.length - 1;
        nextSlide.addEventListener("click", function () {
            // check if current slide is the last and reset current slide
            if (curSlide === maxSlide) {
              curSlide = 0;
            } else {
              curSlide++;
            }
          
            //   move slide by -100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
              $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });

        prevSlide.addEventListener("click", function () {
            // check if current slide is the first and reset current slide to last
            if (curSlide === 0) {
              curSlide = maxSlide;
            } else {
              curSlide--;
            }
          
            //   move slide by 100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
              $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });
        
        // Trigger a click on the nextSlide button
        nextSlide.click();
    }
}

class Noticias {
  constructor() {
    this.apiKey="ee6c3fb1a2c0ce4324bd12a7f4398a6a";
    this.places="Sariego";
    this.url = "https://gnews.io/api/v4/search?q="+this.places+"&lang=es&max=6&apikey="+this.apiKey;

}

cargarNoticias() {
  const secciones = document.querySelectorAll("main > section");
  const contenedorNoticias = secciones[0];
    $.getJSON(this.url, (data) => {
        

        data.articles.forEach(article => {
            const art = document.createElement("article");
            art.innerHTML = `
                <h4>${article.title}</h4>
                <p>${article.description || "Sin descripción disponible."}</p>
                <p>${article.content}</p>
                <a href="${article.url}" target="_blank">Leer más</a>
            `;
            if(art!==null && art!==undefined){
              contenedorNoticias.appendChild(art);
            }
              
        });
        if(data.articles.length < 6){
          this.places="(Pola de Siero) OR Villaviciosa";
          this.url = "https://gnews.io/api/v4/search?q="+this.places+"&lang=es&max="+(6-data.articles.length)+"&apikey="+this.apiKey;
          $.getJSON(this.url, (data) => {
    
            data.articles.forEach(article => {
                const art = document.createElement("article");
                art.innerHTML = `
                    <h4>${article.title}</h4>
                    <p>${article.description || "Sin descripción disponible."}</p>
                    <p>${article.content}</p>
                    <a href="${article.url}" target="_blank">Leer más</a>
                `;
                if(art!==null && art!==undefined){
              contenedorNoticias.appendChild(art);
            }
            });
            
        }).fail(() => {
            console.error("Error al cargar noticias desde GNews.");
        });
        }
            
    }).fail(() => {
        console.error("Error al cargar noticias desde GNews.");
    });
}
}