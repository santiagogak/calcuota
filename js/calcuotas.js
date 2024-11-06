window.onload = function() {

    alert('Bienvenido/a a la Calculadora de cuotas con interés!');
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
    
    //Función para calcular el pago mensual del crédito
    const pagoMensual = (cap, int, cuo) => {
        const intN = int / 100;
        //Fórmula de amortización
        if (cuo > 1) {
            return (cap*intN) / (1-(1+intN)**(-cuo));
        } else {
            return cap;
        }
    };
    
    //Funcion para dar formato de moneda al número
    const formatoMoneda = (monto) => monto.toLocaleString('es-CL', {style: 'currency', currency: 'CLP', maximumFractionDigits: 2 });
    
    //Función para calcular todos los pagos mensuales mes a mes y el interés que se paga en cada uno, así como el total de interes pagado
    function detallePagos (cap, int, cuo) {
        const intN = int / 100;
        const pagoMes = pagoMensual(cap,int,cuo);
        let strPagos = '';
        
        if (cuo > 1) {
            let restoCap = cap;
            let totalInteres = 0;
            for (let i = 1; i <= cuotas; i++) {
                const capMes = restoCap * (1+intN);
                strPagos = strPagos + `Pago ${i}: ${formatoMoneda(restoCap)} - Interés: ${formatoMoneda(restoCap*intN)}\n`;
                totalInteres += restoCap*intN;
                restoCap = capMes - pagoMes;
            }
            strPagos = strPagos + `\nTotal Intereses: ${formatoMoneda(totalInteres)}`;
        } else {
            strPagos = strPagos + `Pago: ${formatoMoneda(cap)} - Interés: 0`;
        }
        return strPagos;
    }
    
    alert(`Pago Mensual: ${formatoMoneda(pagoMensual(capital,interes,cuotas))}`)
    alert(detallePagos(capital,interes,cuotas))
}