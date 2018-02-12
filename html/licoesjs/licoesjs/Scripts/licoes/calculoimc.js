'use strict';

//Elementos 
var formulario = null;
//Valores para IMC 
var kilos = 0; 
var metros = 0;
var centimetros = 0;

const tagjQuery = '#';
const idFormulario = tagjQuery + 'form01';
const idCampoIMC = tagjQuery + 'imc';
const idCampoDetalheIMC = tagjQuery + 'detalheimc';
const idlinkCalculoIMC = tagjQuery +"calcular";
const idCampoKilos = tagjQuery +'kilos';
const idCampoCentimetros = tagjQuery +'centimetros';
const idCampoMetros = tagjQuery + 'metros';

function ExecutarCalculo()
{
    let resultado = 0;
    /*
    ObterValoresParaIMC();
    resultado = CalcularIMC(kilos, metros, centimetros);
    formulario.imc.value = resultado;
    formulario.detalheimc.value = FormatarResultadoIMC(resultado);
    */
    ObterValoresParaIMCPorJquery();
    resultado = CalcularIMC(kilos, metros, centimetros);
    $(idCampoIMC).val(resultado);
    $(idCampoDetalheIMC).val(FormatarResultadoIMC(resultado));
}


function ObterValoresParaIMCPorJquery() {
    kilos = +$(idCampoKilos).val();
    centimetros = +$(idCampoCentimetros).val();
    metros = +$(idCampoMetros).val();
 }

function ObterValoresParaIMC() {
    formulario = document.getElementById(idFormulario);
    kilos = +formulario.kilos.value;
    centimetros = +formulario.centimetros.value;
    metros = +formulario.metros.value;
}

function FormatarResultadoIMC(imc) {
    let resultado = '';
    if (imc <= 20) { resultado = 'Abiaxo do Peso'; }
    else if (imc > 20 && imc <= 25) { resultado = 'Peso Ideal'; }
    else if (imc > 25 && imc < 30) { resultado = 'SobrePeso'; }
    else { resultado = 'Obesidade'; }
    return resultado;
}
function CalcularIMC(pkilos, pmetros, pcentimetros) {
    let altura = (pmetros * 100 + pcentimetros) / 100;
    let imc = pkilos / (altura * altura);
    return imc.toFixed(2);
}

/*
window.onload = function () {
    document.getElementById(idlinkCalculoIMC).onclick = ExecutarCalculo;
}
*/
$(document).ready(function ()
{
    $(idlinkCalculoIMC).click(ExecutarCalculo);
});