//FILTRO = (function () {

//    function init() {
//        bindAll();
//    }

//    function bindAll() {
//        bindFiltrar();
//    }  

//    function bindFiltrar() {

//        $('.frmFiltro').off('click', '#btnFiltrar');
//        $('.frmFiltro').on('click', '#btnFiltrar', function () {

//            var form = $('.frmFiltro');
//            var url = form.attr('action');

//            $.ajax({
//                url: url,
//                data: form.serialize(),
//                type: 'GET',
//                success: function (data) {                   
//                    $("#divLista").html(data);                    
//                    CarregarPaginacao();
//                    MenssagemDeRetornoVazio();
//                    CRUDBASE.Eventos.PosListar();
//                }
//            });
//            return false;
//        });
//    }

//    function MenssagemDeRetornoVazio() {
//        if ($("#grupo_lista_relacionar tbody tr").length === 0) {
//            var line = "<tr class='odd'><td valign='top' colspan='4' class='dataTables_empty'>Nenhum registro foi encontrado!</td></tr>";
//            $("#grupo_lista_relacionar tbody").append(line);
//        }
//    }

//    function CarregarPaginacao() {
//        console.log('filtro.js - CarregarPaginacao');
//        $('#grupo_lista_relacionar').dataTable({

//            /*Coluna que não permite ordenação, partindo do array 0*/
//            "aoColumnDefs": [{ "bSortable": false, "aTargets": ["no-sort"] },
//                             { "word-wrap": "break-word", "aTargets": ["col-wrap"] }],

//            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
//            "order": [[0, "asc"]],

//            /*Resposividade da tabela*/
//            responsive: false,

//        });
//    }

//    return {
//        Init: init,
//        Callbacks: {
//            Ativar: function () { return false; }
//        },
//    };
//}());

//$(function () {
//    FILTRO.Init();
//});