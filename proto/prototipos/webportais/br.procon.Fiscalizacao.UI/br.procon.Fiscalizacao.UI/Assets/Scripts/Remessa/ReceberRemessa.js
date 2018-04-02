$(document).ready(function () {
    MontaPaginacao();
});

function ReceberItemRemessa(idItemRemessa, acao) {
    var mensagem = '';
    if (acao == 2) {
        mensagem = 'Ao receber, você indicará que o documento está em ordem e que a sua posse será da sua unidade. Deseja receber o documento?';
    }
    else if (acao == 4) {
        mensagem = 'Ao recusar, você indicará que o documento físico não foi entregue. Deseja recusar o documento?';
    }

    BASE.Modal.ExibirModalConfirmacao(
          'Receber/Recusar Remessa', mensagem,
          'small',
          '<i class="fa fa-close margR5"></i>Não',
          'btn-primary',
          '<i class="fa fa-check margR5"></i>Sim',
          'btn-danger',
          function () {
              window.location = '/ReceberRemessa/ReceberItemRemessa?idItemRemessa=' + idItemRemessa + '&acao=' + acao;
          },
          null);
}

function AbreModal(item, situacaoItem) {
    console.log(item);

    $("#idItemRemessa").val(item.CodigoRemessaItem);
    $("#acao").val(situacaoItem);

    $("#lblRelacaoRemessa").text($.strPad($("#NumeroRemessa").val(), 6, '0') + '/' + $("#AnoRemessa").val());
    $("#lblDocumento").text($.strPad(item.Documento.Numero, 6, '0') + '/' + item.Documento.Ano);

    $("html").css("overflow", "hidden");
    $("#modalItemRemessa").modal();
    return false;
}

function FecharModalItemRemessa() {
    $("html").css("overflow", "scroll");
    $("#modalItemRemessa").modal('hide');
    LimpaCampos();
    return false;
}

$.strPad = function (i, l, s) {
    var o = i.toString();
    if (!s) { s = '0'; }
    while (o.length < l) {
        o = s + o;
    }
    return o;
};

function LimpaCampos() {
    $("#motivo").val('');
}

var MontaPaginacao = function () {
    $('#grupo_lista_remessa').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [3] }],

        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],

        /*Resposividade da tabela*/
        responsive: true,
        "bDestroy": true
    });

    $('#grupo_lista_itens_remessa').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [3] }],

        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],

        /*Resposividade da tabela*/
        responsive: true,
        "bDestroy": true
    });
};