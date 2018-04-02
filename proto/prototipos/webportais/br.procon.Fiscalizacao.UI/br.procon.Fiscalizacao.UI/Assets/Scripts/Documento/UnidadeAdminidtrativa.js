$(document).ready(function () {

    $("#Protocolo").change(function () {
        //ValoresDistintosDropDownList(this, $("#Tramitacao"))
    });

    $("#Tramitacao").change(function () {
        //ValoresDistintosDropDownList(this, $("#Protocolo"))
    });

});

var ValoresDistintosDropDownList = function (requestCombo, responseCombo) {

    var currentControler = $(requestCombo).val();

    if (currentControler == $(responseCombo).val() && currentControler == "True") {
        $(responseCombo).val("False");
    }
}

$('#tblUnidadeAdministrativa').dataTable({

    /*Coluna que não permite ordenação, partindo do array 0*/
    "aoColumnDefs": [{ "bSortable": false, "aTargets": [5] }],

    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    "order": [[0, "asc"]],

    /*Resposividade da tabela*/
    responsive: true,
    "bDestroy": true
});


$('#ddlIndicProtocolo').change(function () {
    if ($(this).val() == '1') {
        $('#ddlIndicRecebimento').prop('disabled', true).val('0');
    } else {
        $('#ddlIndicRecebimento').prop('disabled', false);
    }
});
$('#ddlIndicRecebimento').change(function () {
    if ($(this).val() == '1') {
        $('#ddlIndicProtocolo').prop('disabled', true).val('0');
    } else {
        $('#ddlIndicProtocolo').prop('disabled', false)
    }
});

var ExibeMensagem = function (msg) {
    var template = '<div id="divMensagem">' +
                       '<div class="alert alert-success mensagemAlerta fade in" style="bottom: 510px; right: 10px;">' +
                          '<button data-dismiss="alert" class="close" type="button">×</button>' +
                          '<div style="text-align: initial">' +
                             '<strong>Sucesso!</strong>' + msg + '' +
                          '</div>' +
                       '</div>' +
                   '</div>';
    return template;
};

var AtivarInativarUA = function (element) {

    var item = $(element).data("id");
    console.log(item);
    $.ajax({
        url: "/UnidadeAdministrativa/ModificarStatusUnidadeAdministrativa",
        data: { obj: item },
        method: "POST",
        cache: false,
        success: function (result) {
            window.location = '/UnidadeAdministrativa/Index';
        }
    });
};

var Limpar = function () {
    $("#Sigla").val("");
    $("#Nome").val("");
    RegrasDropDownList();
};

var CancelarOperacaoUnidadeAdm = function () {

    window.location = '/UnidadeAdministrativa/Index';
    BASE.MostrarMensagem("Operação cancelada com sucesso!", TipoMensagem.Sucesso);
}

$('#mascaraDocumento').mask('999999/9999');