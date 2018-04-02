//$(document).ready(function () {

//    LoadTabelaListarRemessa();

//    var idDestino = localStorage["idDestino"];

//    PopulaComboUnidadeAdm(idDestino);

//    $("#comboUnidadeAdm").change(function () {
//        var id = this.value;
//        localStorage['idDestino'] = id;
//        window.location = '/RemessaDocumento/CarregaRemessa?idUaDestino=' + id;
//    });

//    if (localStorage["idDestino"] == 0 || localStorage["idDestino"] == undefined)
//        $("#geraRemessa").css("display", "none");
//});

//function LoadTabelaListarRemessa() {
//    $('#grupo_lista_relacionar').dataTable({

//        /*Coluna que não permite ordenação, partindo do array 0*/
//        "aoColumnDefs": [{ "bSortable": false, "aTargets": [5] }],

//        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
//        "order": [[0, "asc"]],

//        /*Resposividade da tabela*/
//        responsive: true
//    });
//}

//$('#grupo_lista_relacionar_filter, #grupo_lista_relacionar_length, #grupo_lista_relacionar_info, #grupo_lista_relacionar_paginate').toggle(false);

//$('#mascaraDocumento').mask('999999/9999');

//var PopulaComboUnidadeAdm = function (idDestino) {

//    $.ajax({
//        url: '/RemessaDocumento/PopulaComboUnidadeAdm',
//        type: 'GET',
//        success: function (data) {

//            $("#comboUnidadeAdm").empty();
//            $("#comboUnidadeAdm").append($("<option value='0'>Todos</option>"));

//            $.each(data, function (index, value) {
//                $("#comboUnidadeAdm").append($("<option value='" + value.Codigo + "'>" + value.Nome + "</option>"));
//            });

//            if (localStorage['idDestino'])
//                $("#comboUnidadeAdm").val(localStorage['idDestino']);
//        }
//    });
//};

//var DeletarRemessaDocumentoId = function (id) {
//    $.ajax({
//        url: '/RemessaDocumento/ExcluirRemessaDocumento',
//        type: 'GET',
//        data: { idDocumentoDestino: id },
//        success: function (data) {

//            window.location = '/RemessaDocumento/CarregaRemessa?idUaDestino=' + localStorage['idDestino'];
//        }
//    });
//}