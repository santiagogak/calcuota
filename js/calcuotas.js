
import RegistroCalculo from './registrocalculo.js';
const calcButton = document.getElementById("calcular");

//variable para guardar el historial de cálculos
let historial = [];

const crearTablaRegistros = (arrH) => {
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';
    arrH.forEach((h,idx) => {
        const creditoHTML = `
        <div class="registro">
            <h2>Registro ${idx+1}:</h2>
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
    });
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
    historial.push(credito);
    console.log(historial);
    crearTablaRegistros(historial);
});