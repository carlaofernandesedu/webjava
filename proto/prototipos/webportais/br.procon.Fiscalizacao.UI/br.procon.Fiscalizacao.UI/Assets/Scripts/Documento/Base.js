var modulo = {
    CLASSIFICACAO: 1,
    INTERESSADO: 2,
    SOLICITANTE: 3,
    CONCLUIR: 4
};

$(document).ready(function () {
    var qtdMenus = parseInt($('.menu--link').length);
    if (qtdMenus === 1) {
        AbreFrame(1);

        var label = $('.lblProtocolo-load').text();
        var protocolo = $('#nrProtocolo').val(label);
    }
    else {
        if ($("#Situacao").val() === 'Cadastrado') {
            AbreFrame(modulo.CONCLUIR);
        } else {
            if ($("#partialViewAtual").val() > 0)
                AbreFrame($("#partialViewAtual").val());
            else
                AbreFrame(1);
        }

        $('#grupo_lista_relacionar_filter').toggle(false);

        if ($("#tblInteressado").children("tbody").children().length <= 0)
            $("#Identificador_Principal").prop("checked", true);
        else
            $("#Identificador_Principal").prop("checked", false);

        if ($("#codDocumento").val() !== 0 && $("#codDocumento").val() !== undefined && $("#codDocumento").val() !== "0") {
            $("#frmContent").css("display", "block");

        }
        else {
            $("#frmContent").css("display", "none");
        }

        $("#Numero").val(padLeft($("#Numero").val()));

        $('#form_documento').on('keyup keypress', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });
    }

    bindFocusEnter();
});

$(document).ready(function () {
    $('#nrProtocolo').mask('999999/9999', { reverse: true });
    var el = document.getElementById('nrProtocolo');
    var updatetext = function () {
        el.value = ('000000000' + el.value).slice(-10);
    }

    el.addEventListener("keyup", updatetext, false);

    $('#nrProtocolo').keyup(function () {
        $(this).mask('999999/9999', { reverse: true });
    });

    bindFocusEnter();
});

$('input[name=optRadioDoc]').click(function () {
    $('#divIntSerieDocumental').toggle($(this).val() === '1' ? true : false);
    $('#divExtOrgao').toggle($(this).val() === '2' ? true : false);
    $('#divExtNomeDocumento').toggle($(this).val() === '2' ? true : false);
});

if ($("#codDocumento")) {
    $("#frmContent").css("display", "block");
}

function LoadTabelaSolicitante() {
    $('#tblSolicitante').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [2] }],
        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],
        /*Resposividade da tabela*/
        responsive: true,
        "bDestroy": true,
        bAutoWidth: false,
        "aoColumns": [
         { "sWidth": "50%" },
         { "sWidth": "20%" },
         { "sWidth": "10%" }
        ],
    });
    $('select[name=tblSolicitante_length]').addClass('tabela-length');
};

function LoadTabelaInteressado() {
    $('#tblInteressado').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [3] }],
        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],
        /*Resposividade da tabela*/
        responsive: true,
        bAutoWidth: false,
        "aoColumns": [
         { "sWidth": "50%" },
         { "sWidth": "20%" },
         { "sWidth": "10%" },
         { "sWidth": "10%" },
        ],
    });
    $('select[name=tblInteressado_length]').addClass('tabela-length');
}

$('#tblHistorico').dataTable({
    /*Coluna que não permite ordenação, partindo do array 0*/
    "aoColumnDefs": [{ "bSortable": false, "aTargets": [] }],
    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    "order": [[0, "asc"]],
    /*Resposividade da tabela*/
    responsive: true
});
$('select[name=tblHistorico_length]').addClass('tabela-length').css("margin-top", "10px");

$('#btnLimpar').click(function () {
    LimpaFormulario();
});

function LimpaFormulario() {
    $('#txtNomeOrgaoExterno').val('');
    $('#txtDataDocumento').val('');
    $('#txtAssunto').val('');
    $('#txtVolume').val('');
    $('#txtNomeDocumento').val('');
    $('#txtSdNome').val('');
    $('#ddlFuncao').val('0');
    $('#ddlSubFuncao').val('0').disabled = true;
    $('#ddlAtividade').val('0').disabled = true;
}

function AbreFrame(indice) {
    $("#partialViewAtual").val(indice);

    $('#frmContent div.frame').each(function () {
        $(this).toggle(false);
    });

    if ($("#Codigo").val() === "" || $("#Codigo").val() === "0") {
        $('#frmContent div.frame').each(function () {
            $(this).remove();
        });
    }

    $('#frmContent div.frame:nth-child(' + indice + ')').toggle(true);

    $("html, body").animate({ scrollTop: 0 }, "slow");

    ExibeMenuAtivo(indice);
    return false;
}

function EditTblSolicitante(indice) {
    $('#txtRazaoSocial').val($('#tblSolicitante tbody tr:eq(' + indice + ') td:eq(0)').html());
    $('#ddlTipoDocumentoSolic').val('1');
    $('#divFormRgSolic').toggle(true);
    $('#txtRgSolic').val($('#tblSolicitante tbody tr:eq(' + indice + ') td:eq(1)').html());
    $('#txtOrgExpSolic').val('SSP');
    $('#txtUfExpSolic').val('SP');
}

function EditTblInteressado(indice) {
    $('#txtNomeParte').val($('#tblInteressado tbody tr:eq(' + indice + ') td:eq(0)').html());
    $('#chkIdentificadorPrincipal').prop('checked', $('#tblInteressado tbody tr:eq(' + indice + ') td:eq(2)').html() == 'Sim');
    $('#ddlTipoDocumentoInter').val('1');
    $('#divFormRg').toggle(true);
    $('#txtNumRgInter').val($('#tblInteressado tbody tr:eq(' + indice + ') td:eq(1)').html());
    $('#txtOrgaoExpInter').val('SSP');
    $('#txtUfExpInter').val('SP');
    $('#chkIdentifExterior').prop('checked', false);
    $('#chkIdentificadorSolicitante').prop('checked', false);
}

var ExibeMenuAtivo = function (item) {

    switch (parseInt(item)) {
        case modulo.CLASSIFICACAO:
            $("#liClass").addClass("js-menu-active");
            break;
        case modulo.INTERESSADO:
            $("#liIdentInt").addClass("js-menu-active");
            break;
        case modulo.SOLICITANTE:
            $("#liIdenSol").addClass("js-menu-active");
            break;
        case modulo.CONCLUIR:
            $("#liConc").addClass("js-menu-active");
            break;
    }
}

var CancelarOperacaoProtocolo = function () {
    window.location = '/';
}

function bindFocusEnter() {
    if (document.activeElement.id !== undefined)
        $('#' + document.activeElement.id).click();
}