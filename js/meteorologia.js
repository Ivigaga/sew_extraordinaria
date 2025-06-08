class Meteorologia {
    mostrarTiempo = () => {
    const apiKey = "MV942WUJ8UH83754J6PKKB4A5";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/43.410778,-5.557528/today?unitGroup=metric&key=${apiKey}&include=current&lang=es`;

    $.ajax({
        dataType: "json",
        url: url,
        method: 'GET',
        success: (datos) => {
            const actual = datos.currentConditions;
            const fecha = new Date(actual.datetimeEpoch * 1000);
            const dia = fecha.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'numeric' });

            const temperatura = actual.temp;
            const tempMin = datos.days[0].tempmin;
            const tempMax = datos.days[0].tempmax;
            const humedad = actual.humidity + "%";
            const lluvia = actual.precip || 0;
            const icono = this.obtenerIconoVisualCrossing(actual.icon);
            const descripcion = actual.conditions;

            let contenidoHTML = "<article>";
            contenidoHTML += "<h4>" + dia + "</h4>";
            contenidoHTML += "<img alt='" + descripcion + "' src='" + icono + "' />";
            contenidoHTML += "<p>Temperatura actual: " + temperatura + " ºC</p>";
            contenidoHTML += "<p>Temperatura Mínima (día): " + tempMin + " ºC</p>";
            contenidoHTML += "<p>Temperatura Máxima (día): " + tempMax + " ºC</p>";
            contenidoHTML += "<p>Humedad: " + humedad + "</p>";
            contenidoHTML += "<p>Lluvia: " + lluvia + " mm</p>";
            contenidoHTML += "<p>Condición: " + descripcion + "</p>";
            contenidoHTML += "</article>";

            $("main section").first().append(contenidoHTML);
        },
        error: (xhr, status, error) => {
            console.log("Error en la solicitud:", status, error);
            $("main section").first().append("<h3>¡Tenemos problemas! No puedo obtener datos de <a href='https://www.visualcrossing.com'>Visual Crossing</a></h3>");
        }
    });
}


// Este método también como propiedad de clase:
obtenerIconoVisualCrossing = (nombreIcono) => {
    return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${nombreIcono}.png`;
}


mostrarPrevision = () => {
    const apiKey = "MV942WUJ8UH83754J6PKKB4A5";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/43.4161,-5.5500/next7days?unitGroup=metric&key=${apiKey}&lang=es`;

    $.ajax({
        dataType: "json",
        url: url,
        method: 'GET',
        success: (datos) => {
            const dias = datos.days;

            for (let i = 1; i < dias.length; i++) {
                const dia = dias[i];
                const fecha = new Date(dia.datetime);
                const nombreDia = fecha.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'numeric' });

                const descripcion = dia.conditions;
                const icono = this.obtenerIconoVisualCrossing(dia.icon);

                let contenidoHTML = "<article>";
                contenidoHTML += "<h4>" + nombreDia + "</h4>";
                contenidoHTML += "<img alt='" + descripcion + "' src='" + icono + "' />";
                contenidoHTML += "<p>Temperatura Mínima: " + dia.tempmin + " ºC</p>";
                contenidoHTML += "<p>Temperatura Máxima: " + dia.tempmax + " ºC</p>";
                contenidoHTML += "<p>Humedad: " + (dia.humidity || "N/A") + "%</p>";
                contenidoHTML += "<p>Lluvia: " + (dia.precip || 0) + " mm</p>";
                contenidoHTML += "<p>Condición: " + descripcion + "</p>";
                contenidoHTML += "</article>";

                $("main section").last().append(contenidoHTML);
            }
        },
        error: (xhr, status, error) => {
            console.log("Error en la solicitud:", status, error);
            $("main section").last().append("<h3>No se pudo obtener la previsión desde <a href='https://www.visualcrossing.com'>Visual Crossing</a></h3>");
        }
    });
}



}