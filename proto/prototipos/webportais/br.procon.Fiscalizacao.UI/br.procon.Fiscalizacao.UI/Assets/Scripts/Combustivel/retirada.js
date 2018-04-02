jQuery(document).ready(function () {

    jQuery(".cnpj").blur(function () {
        if (!validarCNPJ(jQuery(this).val())) {
            BASE.MostrarMensagemErro("CNPJ inválido.");
        }
    });

    jQuery(".validar-cpf").blur(function () {
        if (!validarCPF(jQuery(this).val())) {
            BASE.MostrarMensagem("CPF inválido.");
        }
    });

    jQuery("#frmTermoRetirada").submit(function () {
        if (!validarCNPJ(jQuery(".cnpj").val())) {
            BASE.MostrarMensagemErro("CNPJ inválido.");
            return false;
        }
    });
});


function AlteraTipoCombustivel() {
    if (jQuery("#ddlTipoCombustivel").val() == "5") {
        jQuery("#Retirada_DescricaoCombustivel").closest("div").show();
    }
    else {
        jQuery("#Retirada_DescricaoCombustivel").closest("div").hide();
    }
} 

function AlteraBandeira() {
    if (jQuery("#BandeiraPosto").val() == "OUTROS") {
        jQuery("#DescricaoBandeira").closest("div").show();
    }
    else {
        jQuery("#DescricaoBandeira").closest("div").hide();
    }
}

function InicializarTermoRetirada() {
    $('.imprimir-termo-retirada').click(function () {
        ImprimirTermoRetirada();
    });
    $('.imprimir-termo-retirada-rascunho').click(function () {
        ImprimirTermoRetiradaRascunho();
    });
    $('.ddlTipoCombustivel').click(function () { MostrarOcultarDivCombustivel(); });
    MostrarOcultarDivCombustivel();
    AlteraRecusaInformarDadosResponsavel();
    $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
}


function ImprimirTermoRetirada() {
    setTimeout(function () {
        window.open("/TermoRetirada/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirTermoRetiradaRascunho() {
    setTimeout(function () {
        window.open("/TermoRetirada/ImprimirRascunho?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function MostrarOcultarDivCombustivel() {
    var tipo = $('.ddlTipoCombustivel').val();
    $('.divDescricaoCombustivel').toggle(tipo == 5);
}

function NovoRetiradaCombustivel() {
    var error = '';
    //var valid = true;

    if ($('#ddlTipoCombustivel').val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Tipo Combustível' é de preenchimento obrigatório");
        return;
    }

    if ($('#ddlTipoCombustivel').val() == '5' && jQuery("#Retirada_DescricaoCombustivel").val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Descrição do Combustivel' é de preenchimento obrigatório");
        return;
    }

    if ($('#Retirada_NumeroTanque').val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Número do Tanque' é de preenchimento obrigatório");
        return;
    }
    if ($('#Retirada_QtdeCombustivel').val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Quantidade de Combustível Retirado' é de preenchimento obrigatório");
        return;
    }

    if ($('#Retirada_CompartimentoCaminhao').val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Compartimento do Caminhão' é de preenchimento obrigatório");
        return;
    }
    if ($('#Retirada_CompartimentoCaminhao').val() > parseInt(32767)) {
        BASE.MostrarMensagemErro("O campo 'Compartimento do Caminhão' deve ser preenchido com valor máximo de 32767");
        return;
    }
    if ($('#Retirada_NumeroLacre').val() == '') {
        BASE.MostrarMensagemErro("O Campo 'Número do Lacre' é de preenchimento obrigatório");
        return;
    } 

    var codigoRFC = $("#Codigo").val();
    var tipoCombustivel = $('#ddlTipoCombustivel').val();
    var numeroTanque = $('#Retirada_NumeroTanque').val();
    var quantidadeCombustivel = $('#Retirada_QtdeCombustivel').val();
    var descricaoCombustivel = $('#Retirada_DescricaoCombustivel').val();
    var compartimentoCaminhao = $('#Retirada_CompartimentoCaminhao').val();
    var numeroLacre = $('#Retirada_NumeroLacre').val();

    var codigoTermo = $('#CodigoTermo').val();

    $.ajax({
        url: "/TermoRetirada/NovoRetiradaCombustivel",
        type: 'POST',
        data: { idRFC: codigoRFC, idRetirada: codigoTermo, Lacre: JSON.stringify({ tipoCombustivel: tipoCombustivel, descricaoCombustivel: descricaoCombustivel, numeroTanque: numeroTanque, quantidadeCombustivel: quantidadeCombustivel, compartimentoCaminhao: compartimentoCaminhao, numeroLacre: numeroLacre }) },
        success: function (result) {
            if (result != null) {               

                jQuery("#Retirada_DescricaoCombustivel").val("");
                jQuery('#ddlTipoCombustivel').val("");
                jQuery('#Retirada_NumeroTanque').val("");
                jQuery('#Retirada_QtdeCombustivel').val("");
                jQuery('#Retirada_CompartimentoCaminhao').val("");
                jQuery('#Retirada_NumeroLacre').val("");

                $('#RetiradasCombustivel').html(result);

            }
        },
        error: function (result) {
            BASE.MostrarMensagemErro(JSON.parse(result.responseText).msg);
        }
    });
}

function AlteraRecusaInformarDadosResponsavel() {
    RESPONSAVEL.Init();
    if ($('.recusouInformarDadosReponsavel').is(':checked')) {
        RESPONSAVEL.RemoverObrigatoriedade();
    }
    else {
        RESPONSAVEL.AdicionarObrigatoriedade();
    }
}