function NovoAutoApreensaoLacre(id, div, e) {
    var error = '';
    var valid = true;

    var idRfc = $('#Codigo').val();

    var txtSerieBomba = $('#AutosApreensao_' + div + '__Lacre_SerieBomba');
    var txtBico = $('#AutosApreensao_' + div + '__Lacre_NumeroBombaBico');
    var txtLacre = $('#AutosApreensao_' + div + '__Lacre_LacreBomba');
    var txtEncerrante = $('#AutosApreensao_' + div + '__Lacre_LeituraEncerramentoBico');
    var txtLacretanque = $('#AutosApreensao_' + div + '__Lacre_LacreTanque');
    var txtTanque = $('#AutosApreensao_' + div + '__NumeroTanque');
    var txtqtde = $('#AutosApreensao_' + div + '__QtdeCombustivelApreendida');
    var txtOrigemRegistro = $('#AutosApreensao_' + div + '__OrigemRegistro');

    var serie = txtSerieBomba.val();
    var bico = txtBico.val();
    var lacre = txtLacre.val();
    var encerrante = txtEncerrante.val();
    var lacretanque = txtLacretanque.val();
    var tanque = txtTanque.val();
    var qtde = txtqtde.val();

    if (txtOrigemRegistro.val() == 'Apreensao') {
        var origemLacre = 1; // Informação de Tanque/Bomba/Bico cadastrada no Auto de Apreensao.
    }
    else {
        var origemLacre = 0; // Informação de Tanque/Bomba/Bico cadastrada no Termo de Coleta.
    }

    if (serie !== '' && bico == '') {
        error = "O Campo 'Número do Bico' é de preenchimento obrigatório quando um número de série da bomba é fornecido.";
        valid = false;
    }

    if (!valid) {
        BASE.MostrarMensagemErro(error);
        return;
    }

    if (lacre === '') {
     
        BASE.MostrarModalConfirmacao('',
            'O Nº do Lacre da Bomba (Bico) não foi informado. Deseja incluir mesmo assim ?',
            function () {
                enviarDadosAprrensao(div, idRfc, id, serie, bico, lacre, lacretanque, encerrante, tanque, qtde, origemLacre);
            },
            function () {

            },
            null
        );
        valid = false;        
    }
    if (valid) {
        enviarDadosAprrensao(div, idRfc, id, serie, bico, lacre, lacretanque, encerrante, tanque, qtde, origemLacre);
    }
}

function enviarDadosAprrensao(div, idRfc, id, serie, bico, lacre, lacretanque, encerrante, tanque, qtde, origemLacre) {
    $.ajax({
        url: "/AutoApreensao/NovoAutoApreensaoLacre",
        data: { idRFC: idRfc, idTC: id, Lacre: JSON.stringify({ SerieBomba: serie, NumeroBombaBico: bico, LacreBomba: lacre, LacreTanque: lacretanque, LeituraEncerramentoBico: encerrante, NumeroTanque: tanque, Qtde: qtde, OrigemLacre: origemLacre }) },
        success: function (result) {
            if (result != null) {
                $('#divLacres_' + div).html(result);
                txtSerieBomba.val('');
                txtSerieBomba.prop('readonly', false);
                txtBico.val('');
                txtBico.prop('readonly', false);
                txtLacre.val('');
                txtEncerrante.val('');
            }
        },
        error: function (result) {
            BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
        }
    });

}

function AlterarAutoApreensaoLacre(campo) {  

    var linha = jQuery(campo).closest("tr");

    var serie = jQuery("#item_SerieBombaBico", linha).html();
    var lacre = jQuery("#item_LacreBomba", linha).val();
    var codigo = jQuery("#item_CodigoLacre", linha).val();
    var termo = jQuery("#item_TermoColeta", linha).val();
    var leituraEncerramentoBico = jQuery("#item_LeituraEncerramentoBico", linha).val();
    var numeroTanque = $('#TermosCircunstanciados_' + div + '__NumeroTanque').val();

    $.ajax({
        url: "/AutoApreensao/AlterarAutoApreensaoLacre",
        type: "post",
        data: {
            idRFC: $('#Codigo').val(), idTC: termo, serieBomba: serie, lacre: lacre,
            leituraEncerramentoBico: leituraEncerramentoBico, codigolacre: codigo, MumeroTanque: numeroTanque
        },
        success: function (result) {
            if (result != null) {
                jQuery("#item_LacreBomba", linha).val(result.lacre);
                if (result.msg != "") {
                    BASE.MostrarMensagemErro(result.msg);
                }
            }
        },
        error: function (result) {
            BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
        }
    });
}

function NovoTermoCircunstanciadoLacre(id, div, e) {
    var error = '';
    var valid = true;

    

    if ($('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val() === '') {
        error = "O Campo 'Lacre Bomba Bico' é de preenchimento obrigatório";
        valid = false;
    }
    if ($('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val() === '') {
        error = "O Campo 'Situação Lacre Tanque' é de preenchimento obrigatório";
        valid = false;
    }
    if ($('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val() === '') {
        error = "O Campo 'Situação Lacre Bomba' é de preenchimento obrigatório";
        valid = false;
    }
    //if ($('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val() === '') {
    //    error = "O Campo 'Leitura do Encerrante Bomba Bico' é de preenchimento obrigatório";
    //    valid = false;
    //}

    var regex = new RegExp("^\\d{1,7}\\,\\d{1,3}$");
    var leitura = $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val();
    if (!regex.test(leitura)) {
        error = "O campo Leitura do Encerrante Bomba (Bico) tem um valor inválido";
        valid = false;
    }

    if (!valid) {
        BASE.MostrarMensagemErro(error);
        return;

    }

    var numeroTanque = $('#TermosCircunstanciados_' + div + '__NumeroTanque').val();
    var tipoCombustivel = $('#TermosCircunstanciados_' + div + '__TipoCombustivel').val();
    var descCombustivel = $('#TermosCircunstanciados_' + div + '__DescricaoCombustivel').val();
    var serie = $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').val();
    var lacre = $('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val();
    var encerrante = $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val();
    var lacretanque = $('#TermosCircunstanciados_' + div + '__Lacre_LacreTanque').val();
    var situacaoTanque = $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val();
    var situacaoBomba = $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val();

    if (serie === null || serie === undefined) {
        serie = $('#TermosCircunstanciados_' + div + '__SerieBombaBico').val();
    }

    $.ajax({
        url: "/TermoCircunstanciado/NovoTermoCircunstanciadoLacre",
        data: { idRFC: $('#Codigo').val(), idAuto: id, Lacre: JSON.stringify({ NumeroTanque: numeroTanque, TipoCombustivel: tipoCombustivel, DescricaoCombustivel: descCombustivel, SerieBombaBico: serie, LacreBomba: lacre, LacreTanque: lacretanque, LeituraEncerramentoBico: encerrante, SituacaoLacreTanque: situacaoTanque, SituacaoLacreBomba: situacaoBomba }) },
        success: function (result) {
            if (result != null) {
                $('#divLacres_' + div).html(result);
                $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').val('');
                $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').prop('readonly', false);
                $('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val('');
                $('#TermosCircunstanciados_' + div + '__Lacre_LacreTanque').val('');
                $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val('');
                $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val('');
                $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val('');
            }
        },
        error: function (result) {
            console.log('Os dados de lacração informados estão duplicados, favor verificar!!');
            BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!!');
        }
    });
}

function AlterarTermoCircunstanciadoLacre(campo) {

    var idRfc = $('#Codigo').val();
    var linha = $(campo).closest("tr");
    var codigolacre = $(".codigo", linha).val();
    var autoApreensao = $(".autoApreensao", linha).val();
    var serieBomba = $(".serieBomba", linha).html();
    var lacreTanque = $(".lacreTanque", linha).val();
    var lacreBomba = $(".lacreBomba", linha).val();
    var situacaoTanque = $(".situacaoLacreTanque", linha).val();
    var situacaoBomba = $(".situacaoLacreBomba", linha).val();
    var leituraEncerramentoBico = $(".leituraEncerramentoBico", linha).val();
    var numeroTanque = $('#TermosCircunstanciados_' + div + '__NumeroTanque').val();

    $.ajax({
        url: "/TermoCircunstanciado/AlterarTermoCircunstanciadoLacre",
        type: "POST",
        data: {
            idRFC: idRfc, idAuto: autoApreensao,
            serieBomba: serieBomba, lacreTanque: lacreTanque,
            lacreBomba: lacreBomba, codigolacre: codigolacre,
            situacaoTanque: situacaoTanque, situacaoBomba: situacaoBomba,
            leituraEncerramentoBico: leituraEncerramentoBico, NumeroTanque: numeroTanque
        },
        success: function (result) {
            if (result.msg != "")
                BASE.MostrarMensagemErro(result.msg);
            return;
        },
        error: function (result) {
            BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
        }
    });
}

function RecusaAssinaturaAutoInfracao(campo) {
    RESPONSAVEL.Init();

    if ($(campo).prop('checked') == false) {
        RESPONSAVEL.AdicionarObrigatoriedade();
    }
    else {
        RESPONSAVEL.RemoverObrigatoriedade();
    }
}

$('.radio-inline').click(function () {
    if ($('#manualDeslacracao, .manualRetirada').is(':checked')) {
        $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').show();
        $('.localDeslacracao').removeAttr('disabled');
    }
    else if ($('#inlocoDeslacracao, .inlocoRetirada').is(':checked')) {
        $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').hide();
        $('.localDeslacracao').attr('disabled', 'disabled');
    }
})

//CONTROLES.FuncoesExtras.DropDownHabilita('#divMotivo', '#ddlMotivoDeslacracao', '4', '.divDeslacracao');
function OcultaDescricaoMotivoDeslacracao() {
    if ($('#ddlMotivoDeslacracao').val() === "4") {
        $('.divDeslacracao').show();
    }
    else {
        $('.divDeslacracao').hide();
        $('#descricaoDoMotivoDeslacracao').val('');
    }
}

$(document).ready(function () {
    $('body')
        .on('change', '#ddlMotivoDeslacracao', OcultaDescricaoMotivoDeslacracao);
});