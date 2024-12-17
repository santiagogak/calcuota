import RegistroCalculo from './registrocalculo.js';
const calcButton = document.getElementById("calcular");
const clearButton = document.getElementById("clear");
const printButton = document.getElementById("print");

//Funcion para crear el HTML de cada Registro de calculo
const crearTablaRegistros = () => {    
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';
    for (let i = localStorage.length-1; i >= 0; i--) {
        const entry = JSON.parse(localStorage.getItem(i+""));
        const h = Object.assign(new RegistroCalculo, entry);
        const {monto, tasa, cuotas, pagoMensual} = h;
        const creditoHTML = `
        <div class="registro">
        <h2>Registro ${parseInt(i+1)}:</h2>
        <div class="infoLeft">
        <p>Monto: ${h.formatoMoneda(monto)}</p>
        <p>Tasa: ${tasa}%</p>
        <p>Cuotas: ${cuotas}</p>
        </div>
        <div class="infoRight">
        <p>Pago Mensual: ${h.formatoMoneda(pagoMensual)}</p>
        <p>Total Interéses: ${h.imprimirTotalInteres()}</p>
        <p>Cuotas:<br> ${h.imprimirDetallePagos(true)}</p>
        </div>
        </div>
        `;
        resultados.insertAdjacentHTML( 'beforeend', creditoHTML );
    }
}

//Funcion para crear el HTML que muestra la información de la tasa de interés promedio de la CMF de Chile y el botón para utilizar esa tasa
const appendInteresCMF = (v) => {    
    const interesCMF = document.getElementById('cmf');
    interesCMF.innerHTML = '';
    const cmfHTML = `
    <p>La Tasa de Interés Promedio (CMF - Comisión para el Mercado Financiero de Chile) para el <strong>${v.Fecha}</strong> es de: <strong>${v.Valor}%</strong></p>
    <button class='btn-tasa' id='btn-tasa'>Usar Tasa CMF</button>
    `;
    
    interesCMF.insertAdjacentHTML( 'beforeend', cmfHTML );
}

//Función que hace el fetch de consulta a la API de la CMF de Chile para obtener la tasa de interés promedio
const getInteresCMF = async () => {
    const apiKey = "34dbf03ff4807805ecec32150fb4ee0b02733186";
    const urlCMF = `https://api.cmfchile.cl/api-sbifv3/recursos_api/tip/2024?apikey=${apiKey}&formato=json`;
    
    try {
        const response = await fetch(urlCMF);
        if (response.ok) {
            const jsonCMF = await response.json();
            const today = new Date();
            let idxTIP;
            let diffDias = today;
            jsonCMF.TIPs.forEach((e,idx) => {
                const eDate = new Date(e.Fecha+"T00:00:00");
                if (e.Tipo == "21" && (today - eDate < diffDias)) {
                    diffDias = today - eDate;
                    idxTIP = idx;
                }
            });
            if (idxTIP) {
                appendInteresCMF(jsonCMF.TIPs[idxTIP]);
                const tasaButton = document.getElementById("btn-tasa");
                
                tasaButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('presione tasa');
                    document.getElementById('interes').value = jsonCMF.TIPs[idxTIP].Valor.replace(',','.');
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//Llamo a la API CMF para obtener la tasa de interés promedio
getInteresCMF();

//Botón de cálculo de intereses
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
    if (cuotas < 1 || cuotas > 36) {
        if (!document.getElementById("errorCuotas")) {
            document.getElementById("cuotas").insertAdjacentHTML('afterend', `<p class="errorMessage" id='errorCuotas'>Por favor, introduce entre 1 a 36 cuotas</p>`);
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

//Borrar los registros del LocalStorage
clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    crearTablaRegistros();
});

//Imprimir todos los registros guardados en el LocalStorage
printButton.addEventListener('click', (e) => {
    e.preventDefault();
    crearTablaRegistros();
});