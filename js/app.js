const container = document.querySelector('.container');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
    
})

function buscarClima(e) {
    e.preventDefault();
    console.log('Buscando el clima');

    // validar formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

   if( ciudad === '' || pais === ''){
    // hubo un error 
    mostrarError('Ambos campos son obligatorios');
    return;
   }
    
    // consultar API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        // crear alerta
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'mx-w-md', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
        <strong class = "font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `
    container.appendChild(alerta);

    // TImer 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
    }
}

function consultarAPI(ciudad, pais){
     
    const appId= 'ea61edc0c9132814d3ab9776574631aa';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    console.log(url);

    Spinner();// Muestra un Spinner de carga

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            limpiarHTML(); //Limpiar el HTML previo


            if( datos.cod === "404") {
                mostrarError('ciudad no encontrada');
                return;
            }
            //Imprime los datos en el HTML 
            mostrarClima(datos);
        })
        .catch( error => console.log(error));
}


function mostrarClima(datos){
    const {name, main:{ temp, temp_max, temp_min}} = datos;
    
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent =`Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-6xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451`;
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);


    resultado.appendChild(resultadoDiv);
}

const  kelvinACentigrados =  grados => parseInt(grados - 273.15);

function limpiarHTML(){
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle')

    divSpinner.innerHTML= `
     <div class="sk-chase-dot"></div>
     <div class="sk-chase-dot"></div>
     <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);
}