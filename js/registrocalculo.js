export default class RegistroCalculo {
    constructor(monto = 0, tasa = 0, cuotas = 1) {
        this.monto = monto;
        this.tasa = tasa;
        this.cuotas = cuotas;
        this.pagoMensual = 0;
        this.pagos = [];
    }

    //Función para calcular el pago mensual del crédito
    calcularPagoMensual() {
        const intN = this.tasa / 100;
        //Fórmula de amortización
        if (this.cuotas > 1) {
            this.pagoMensual = (this.monto*intN) / (1-(1+intN)**(-this.cuotas));
        } else {
            this.pagoMensual = this.monto;
        }
    };

    //Función para calcular todos los pagos mensuales mes a mes y el interés que se paga en cada uno, así como el total de interes pagado
    calcularPagos() {
        const intN = this.tasa / 100;
        const pagoMes = this.pagoMensual;
        let arrPagos = [];
        
        if (this.cuotas > 1) {
            let restoCap = this.monto;
            let totalInteres = 0;
            for (let i = 1; i <= this.cuotas; i++) {
                const capMes = restoCap * (1+intN);
                arrPagos.push({cuota: i, pago: restoCap, interes: restoCap*intN});
                restoCap = capMes - pagoMes;
            }
        } else {
            arrPagos.push({cuota: 1, pago: this.monto, interes: this.tasa});
        }
        this.pagos = arrPagos;
    }

    //Hacer todos los calculos
    calcularTodo() {
        this.calcularPagoMensual();
        this.calcularPagos();
    }

    //Funcion para dar formato de moneda al número
    formatoMoneda = (monto) => monto.toLocaleString('es-CL', {style: 'currency', currency: 'CLP', maximumFractionDigits: 2 });

    //Generar texto con detalle de pagos
    imprimirDetallePagos(html=false) {
        const charSalto = html ? '<br>' : '\n';
        let strPagos = '';
        this.pagos.forEach((p) => {
            strPagos += `Pago ${p.cuota}: ${this.formatoMoneda(p.pago)} - Interés: ${this.formatoMoneda(p.interes)}${charSalto}`;            
        });
        return strPagos;
    }

    //calcular el total de intereseses
    totalInteres() {
        return this.pagos.reduce((acc, item) => acc += item.interes, 0);
    }

    //imprimir el total de intereses
    imprimirTotalInteres() {
        return `${this.formatoMoneda(this.totalInteres())}`;
    }
};