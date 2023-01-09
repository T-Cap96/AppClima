const resultados = document.querySelector('.resultados');
const formulario = document.querySelector('.obtenerClima');
const nombreCiudad = document.querySelector('#ciudad');
const nombrePais = document.querySelector('#paises');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nombreCiudad.value === '' || nombrePais.value === '') {
        mostrarError('Ambos campos son obligatorios...');
        return;
    }

    llamadaAPI(nombreCiudad.value, nombrePais.value);     
})


function llamadaAPI(city, country){
    const apiId = '41d1d7f5c2475b3a16167b30bc4f265c';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                mostrarError('Ciudad no encontrada...');
            } else {
                clearHTML();
                mostrarClima(dataJSON);
            }            
        })
        .catch(error => {
            console.log(error);
        })
}

function mostrarClima(data){
    const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;

    const degrees = kelvinACentigrados(temp);
    const min = kelvinACentigrados(temp_min);
    const max = kelvinACentigrados(temp_max);

    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;

    resultados.appendChild(content);     
}

function mostrarError(message){     
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    formulario.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function kelvinACentigrados(temp){
    return parseInt(temp - 273.15);
}

function clearHTML(){
    resultados.innerHTML = '';
}