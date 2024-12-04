
import RegistroCalculo from './registrocalculo.js';
const calcButton = document.getElementById("calcular");
const clearButton = document.getElementById("clear");
const printButton = document.getElementById("print");

const crearTablaRegistros = () => {

    const historial = window.localStorage;
    console.log(historial);
    
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const idx = localStorage.key(i);
        const entry = JSON.parse(localStorage.getItem(idx));
        const h = Object.assign(new RegistroCalculo, entry);
        console.log(h);
        const creditoHTML = `
        <div class="registro">
        <h2>Registro ${parseInt(idx)}:</h2>
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
    
    //Variable capital para el monto del credito. Se pregunta tantas veces sea necesario hasta tener un número como respuesta
    const capital = document.getElementById("monto").value || 1;
    
    //Variable interes para la tasa de interés. Se pregunta tantas veces sea necesario hasta tener un número como respuesta
    const interes = document.getElementById("interes").value || 0.1;
    
    //Variable cuotas para el número de cuotas. Se pregunta tantas veces sea necesario hasta tener un número entre 1 y 24 como respuesta
    const cuotas = document.getElementById("cuotas").value || 1;

    
    const credito = new RegistroCalculo(capital, interes, cuotas);
    credito.calcularTodo();
    localStorage.setItem(localStorage.length,JSON.stringify(credito));
    crearTablaRegistros();
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