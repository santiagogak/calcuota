
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

calcButton.addEventListener('click', function() {

    //Variable capital para el monto del credito. Se pregunta tantas veces sea necesario hasta tener un número como respuesta
    let capital;
    let isCapital = false;
    while (!isCapital) {
        capital = parseFloat(prompt('Introduce el monto de tu crédito (sin puntos, ni comas, ni $, solo el monto entre 1 peso a 100 Millones):'));
        isCapital = !isNaN(capital) && (capital >= 1 && capital <= 100000000);
        if (!isCapital) {
            alert('Por favor, introduce un valor válido');
        }
    }
    
    //Variable interes para la tasa de interés. Se pregunta tantas veces sea necesario hasta tener un número como respuesta
    let interes;
    let isInteres = false;
    while (!isInteres) {
        interes = parseFloat(prompt('Introduce la tasa de interés (sin %, solo el número entre 0.1 y 100%):'));
        isInteres = !isNaN(interes) && (interes >= 0.1 && interes <= 100);
        if (!isInteres) {
            alert('Por favor, introduce un valor válido');
        }
    }
    
    //Variable cuotas para el número de cuotas. Se pregunta tantas veces sea necesario hasta tener un número entre 1 y 24 como respuesta
    let cuotas;
    let isCuotas = false;
    while (!isCuotas) {
        cuotas = parseInt(prompt('Introduce cuantas cuotas tiene el crédito (entre 1 y 24)'));
        isCuotas = !isNaN(cuotas) && (cuotas >= 1 && cuotas <= 24);
        if (!isCuotas) {
            alert('Por favor, introduce un valor válido');
        }
    }
    
    const credito = new RegistroCalculo(capital, interes, cuotas);
    credito.calcularTodo();
    historial.push(credito);
    alert(`Pago Mensual: ${credito.formatoMoneda(credito.pagoMensual)}`)
    alert(`${credito.imprimirDetallePagos()}`)
    alert(`Total Interés: ${credito.imprimirTotalInteres()}`);
    console.log(historial);
    crearTablaRegistros(historial);
});