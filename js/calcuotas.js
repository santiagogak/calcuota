import RegistroCalculo from './registrocalculo.js';
const calcButton = document.getElementById("calcular");
const clearButton = document.getElementById("clear");
const printButton = document.getElementById("print");

const crearTablaRegistros = () => {    
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';
    for (let i = localStorage.length-1; i >= 0; i--) {
        const entry = JSON.parse(localStorage.getItem(i+""));
        const h = Object.assign(new RegistroCalculo, entry);
        const creditoHTML = `
        <div class="registro">
        <h2>Registro ${parseInt(i+1)}:</h2>
        <div class="infoLeft">
        <p>Monto: ${h.formatoMoneda(h.monto)}</p>
        <p>Tasa: ${h.tasa}%</p>
        <p>Cuotas: ${h.cuotas}</p>
        </div>
        <div class="infoRight">
        <p>Pago Mensual: ${h.formatoMoneda(h.pagoMensual)}</p>
        <p>Total Interéses: ${h.imprimirTotalInteres()}</p>
        <p>Cuotas:<br> ${h.imprimirDetallePagos(true)}</p>
        </div>
        </div>
        `;
        resultados.insertAdjacentHTML( 'beforeend', creditoHTML );
    }
}

calcButton.addEventListener('submit', (e) => {

    e.preventDefault();
    
    //Variable capital para el monto del credito
    const capital = document.getElementById("monto").value || 1;
    let isCapital = true;
    if (capital < 1 || capital > 100000000) {
        if (!document.getElementById("errorMonto")) {
            document.getElementById("monto").insertAdjacentHTML('afterend', `<p class="errorMessage" id='errorMonto'>Por favor, introduce un monto entre 1$ y 100.000.000$, sin puntos ni decimales</p>`);
        }
        isCapital = false;
    } else {
        if (document.getElementById("errorMonto")) {
            document.getElementById("errorMonto").remove();
        }
        isCapital = true;
    }
    
    //Variable interes para la tasa de interés. Se pregunta tantas veces sea necesario hasta tener un número como respuesta
    const interes = document.getElementById("interes").value || 0.1;
    let isInteres = true;
    if (interes < 0.1 || interes > 100) {
        if (!document.getElementById("errorInteres")) {
            document.getElementById("interes").insertAdjacentHTML('afterend', `<p class="errorMessage" id='errorInteres'>Por favor, introduce una tasa entre 0.1% y 100%</p>`);
        }
        isInteres = false;
    } else {
        if (document.getElementById("errorInteres")) {
            document.getElementById("errorInteres").remove();
        }
        isInteres = true;
    }
    
    //Variable cuotas para el número de cuotas. Se pregunta tantas veces sea necesario hasta tener un número entre 1 y 24 como respuesta
    const cuotas = document.getElementById("cuotas").value || 1;
    let isCuotas = true;
    if (cuotas < 1 || cuotas > 24) {
        if (!document.getElementById("errorCuotas")) {
            document.getElementById("cuotas").insertAdjacentHTML('afterend', `<p class="errorMessage" id='errorCuotas'>Por favor, introduce entre 1 a 24 cuotas</p>`);
        }
        isCuotas = false;
    } else {
        if (document.getElementById("errorCuotas")) {
            document.getElementById("errorCuotas").remove();
        }
        isCuotas = true;
    }

    if (isCapital && isInteres && isCuotas) {   
        const credito = new RegistroCalculo(capital, interes, cuotas);
        credito.calcularTodo();
        localStorage.setItem(localStorage.length,JSON.stringify(credito));
        crearTablaRegistros();
    }
});

clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    crearTablaRegistros();
});

printButton.addEventListener('click', (e) => {
    e.preventDefault();
    crearTablaRegistros();
});