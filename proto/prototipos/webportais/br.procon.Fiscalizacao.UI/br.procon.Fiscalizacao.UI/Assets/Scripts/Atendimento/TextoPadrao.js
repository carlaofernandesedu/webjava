console.log('meh2');
var RESPOSTAPADRAO = (function () {

    function init() {
        carregarLista();
        btnPesquisarClick();

        $('input[name="IdClassificacao"]').off('change');
        $('input[name="IdClassificacao"]').on('change', function () {
            carregarLista();
        });

        $('input[name="IdClassificacao-textfd"]').on('blur', function () {
            if ($(this).val() == "") {
                $('input[name="IdClassificacao"]').val("");
                carregarLista();
            }
        });
    }

    var excluirTextoPadrao = function (id) {
        console.log('Excluir o item ' + id);
        BASE.Modal.ExibirModalConfirmacao('Excluir Texto Padrão', 'Deseja mesmo excluir o Texto Padrão?', 'small', '<i class="fa fa-close margR5"></i>Cancelar', 'btn-primary', '<i class="fa fa-trash margR5"></i>Excluir', 'btn-danger',
            function () {
                var form = { "Id": id };
                $.ajax({
                    type: "POST",
                    url: "/classificacao/TextoPadraoExcluir",
                    data: form,
                    dataType: "json",
                    success: function (response) {
                        BASE.Mensagem.Mostrar("Texto Padrão excluido com sucessso!", TipoMensagem.Sucesso, "Excluir");
                        $('input[name="IdClassificacao"]').val("");
                        carregarLista();
                    },
                    error: function (response) {
                        BASE.Mensagem.Mostrar("Erro ao excluir o Texto Padrão!" + response.error, TipoMensagem.Error, "Excluir");
                    }
                });
            }, null);
    }

    var table = null;
    var carregarLista = function () {
        $.ajax({
            type: "GET",
            url: "/classificacao/TextoPadraoPorClassificacao",
            dataType: "json",
            success: function (response) {
                var linha = 0;

                $('#tbl-data tbody tr td').css({ 'vertical-align': 'middle;' });

                if (table != null) {
                    table.destroy();
                }

                $('#tbl-data tbody').empty();

                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var alterar = $.validator.format("<a class='btn btn-primary btn-xs' href='/classificacao/TextoPadraoEdit?Id={0}' data-toggle='tooltip' data-placement='top' title='' data-original-title='Alterar'> <i class='fa fa-edit'></i></a>", response[i].Id);
                        var excluir = $.validator.format("<button type='button' onclick='RESPOSTAPADRAO.ExcluirTextoPadrao({0})' class='btn btn-danger btn-xs' href='/classificacao/TextoPadraoExcluir?Id={0}' data-toggle='tooltip' data-placement='top' title='' data-original-title='Excluir'> <i class='fa fa-trash'></i></button>", response[i].Id);

                        linha = $.validator.format("<tr> <td>{0}</td> <td class='text-center'>{1}</td><td class='text-center'> <i class='fa fa-list' style='display:" + (response[i].Tags == "" ? 'none' : 'block') + "' data-toggle='tooltip' data-placement='top' title='{2}' data-original-title='{2}' aria-hidden='true'></i> </td><td class='text-center'>{3} {4}</td></tr>", response[i].Titulo, (response[i].Ativo == true ? "SIM" : "NÃO"), ("" + response[i].Tags).replaceAll(',', ', \n'), alterar, excluir);
                        $('#tbl-data tbody').append(linha);
                    }
                } else {
                    linha = $.validator.format("<tr> <td colspan='5'>{0}</td></tr>", "Nenhum item encontrado.");
                    $('#tbl-data tbody').append(linha);
                }

                $("[data-toggle='tooltip']").tooltip();
                table = $('#tbl-data').DataTable();
            }
        });
    };

    var btnPesquisarClick = function () {
        $('#btn-pesquisar').off('click');
        $('#btn-pesquisar').on('click', function () {
            carregarLista();
        });
    };

    return {
        Init: function () {
            init();
        },
        ExcluirTextoPadrao: excluirTextoPadrao
    };
}());

var TEXTOPADRAO = (function () {
    var init = function () {
        console.log('init');

        $('[name="Resposta"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": false,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": false,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $(".tagsinput").each(function (index, element) {
            $(this).tagsinput({
                preventPost: true,
                allowDuplicates: false,
                cancelConfirmKeysOnEmpty: false,
                trimValue: true,
                freeInput: true,
                maxChars: 20, //Definição de tamanho no documento de requisitos
                confirmKeys: [1, 2, 9, 13, 32], //Botões de aceitação paara inclsão das Tags, clique esquerdo, clique direito do mouse,
                typeahead: { //https://github.com/biggora/bootstrap-ajax-typeahead
                    ajax: {
                        url: '/tag/Filtrar',
                        method: 'POST'
                    }
                }
            });
        });

        var form = $("#form-texto-padrao")
            .removeData("validator") /* added by the raw jquery.validate plugin */
            .removeData("unobtrusiveValidation");  /* added by the jquery unobtrusive plugin*/

        $.validator.unobtrusive.parse(form);
        $('input[name="IdClassificacao-textfd"]').rules('add', {
            required: true,
            messages: {
                required: "Preenchimento Obrigatório."
            }
        });
    }
    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    //RESPOSTAPADRAO.Init();
});

var PESQUISAR_MENSAGENS = (function () {
    var url = "/Classificacao/PesquisarRespostaPadrao";

    var modalTitle = "Procurar por Resposta Padrão";
    var divModal = "#div-modal-resposta-padrao";
    var textAreaResposta = "#resposta";
    var btnIncluirTextoPadrao = "button#respostaPadrao";

    var init = function (title, modal, resposta, btn, serviceUrl) {
        url = serviceUrl;

        modalTitle = title;
        divModal = modal;
        textAreaResposta = resposta;
        btnIncluirTextoPadrao = btn;

        CONTROLES.Editor.Configurar();
        $('.Editor-editor').height(450);

        carregarModal(function () {
            bindModalRespostaPadrao();
            bindPesquisaPorEnter();
            bindLimpaClassificacao();
            InitModal();         

        });        
       
    };

    function bindLimpaClassificacao() {

        $('#frm-filtro input[name="IdClassificacaoSelecionado-textfd"]').off('chamge');
        $('#frm-filtro input[name="IdClassificacaoSelecionado-textfd"]').on('change', function () {

            if($(this).val() == "")
            {
                $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val('');
            }

        });

    }

    var InitModal = function () {
        CONTROLES.Typeahead.Configurar();

        $(divModal + ' h4.modal-title').text(modalTitle);

        $('#frm-filtro #row_classificacao').css('display', 'block');

        $($('#frm-filtro input[name="titulo"]')[0]).prop('checked', 'true');

        bindPesquisarRespostaPadrao();
        bindConfirmarRespostaPadrao();
        

    };
    var bindModalRespostaPadrao = function () {
        $(btnIncluirTextoPadrao).off('click');
        $(btnIncluirTextoPadrao).on('click', function () {
            $(divModal).modal('show');

        });
    };
    var carregarModal = function (callback) {
        $.ajax({
            type: "GET",
            url: "/Classificacao/ModalRespostaPadrao",
            context: this,
            success: function (response) {
                $("body").append(response);
                callback();
            }
        });
    };

    function bindPesquisaPorEnter() {
        $('#frm-filtro input[name="filtro"]').off('keypress');
        $('#frm-filtro input[name="filtro"]').keypress(function (e) {          

            if (e.keyCode == 13) {

                if ($(this).val().length == 0 && $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val() == "") {
                    BASE.MostrarMensagem("Campo Pesquisa ou classificação obrigatório.", TipoMensagem.Alerta);                   
                    e.preventDefault();
                    return;
                }
                executarPesquisaPorClassificacao();
            }

        });

        $('#frm-filtro input[name="IdClassificacaoSelecionado-textfd"]').off('keypress');
        $('#frm-filtro input[name="IdClassificacaoSelecionado-textfd"]').keypress(function (e) {

            if (e.keyCode == 13) {

                if ($(this).val().length == 0 && $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val() == "") {
                    BASE.MostrarMensagem("Campo Pesquisa ou classificação obrigatório.", TipoMensagem.Alerta);
                    e.preventDefault();
                    return;
                }
                executarPesquisaPorClassificacao();
            }

        });
    }

    /*Pesquisar*/
    var items = [];
    var bindPesquisarRespostaPadrao = function () {
        $('#frm-filtro button[name="btn-pesquisar"]').off('click');
        $('#frm-filtro button[name="btn-pesquisar"]').on('click', function () {
            executarPesquisaPorClassificacao();
        });
    };

    function bindSelecionarTodos() {
        $("#chkTodos").prop('checked', false);
        $("#chkTodos").off('click');
        $("#chkTodos").on('click', function () {
            $('input[name="selectedResposta"]').prop("checked", $(this).prop("checked"));
        });

        $('input[name="selectedResposta"]').off('click');
        $('input[name="selectedResposta"]').on('click', function () {
            var checkeds = $('input[name="selectedResposta"]:checked');
            var todos = $('input[name="selectedResposta"]');

            if (checkeds.length == todos.length) {
                $("#chkTodos").prop('checked', true);
            } else {
                $("#chkTodos").prop('checked', false);
            }
        });
    };

    //BUSCA 1° NIVEL GRID: ORIENTACAO
    var executarPesquisaPorClassificacao = function () {
        var checked = [];

        if ($('#frm-filtro input[name="filtro"]').val().length == 0 && $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val() == "") {
            BASE.MostrarMensagem("Campo Pesquisa ou classificação obrigatório.", TipoMensagem.Alerta);
            return;
        }

        $("input[name='selectedFiltroResposta']:checked").each(function () {
            checked.push($(this).val());
        });

        if ($('input[data-service-displayfield').val() == '') {
            $('input[name=IdClassificacaoSelecionado]').val('');
        }

        console.log("Executando pesquisa");

        $('#listaRespostasEncontradas').empty();
        $(divModal + " p#resultado-encontrado").empty();
        $('#listaRespostasEncontradas').append("<tr>" + '<td colspan="2" class="text-center"><div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div></td>' + "</tr>");

        $.ajax({
            url: url,
            data: {
                "descricao": $('#frm-filtro input[name="descricao"]').is(":checked"),
                "titulo": $('#frm-filtro input[name="titulo"]').is(":checked"),
                "tag": $('#frm-filtro input[name="tag"]').is(":checked"),
                "filtro": $('#frm-filtro input[name="filtro"]').val(),
                "idclassificacao": $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val()
            },
            type: 'Post',
            dataType: "json",
            success: function (data) {
                console.log("Pesquisa executada");

                $(divModal + " p#resultado-encontrado").html("<strong>Foram encontado(s) " + data.Data.length + " resultado(s) </strong>");

                $('#listaRespostasEncontradas').empty();

                if (data.Valido) {
                    items = data.Data;

                    if (items.length == 0) {
                        $('#listaRespostasEncontradas').append(
                            "<tr>" +
                                '<td colspan="2" class="text-center">Nenhum item encontrado.</td>' +
                            "</tr>"
                        );
                    }

                    $(items).each(function (i) {
                        $('#listaRespostasEncontradas').append(
                            "<tr>" +
                                '<td class="col-md-1"></td>' +
                                '<td>' +
                                    '<div class="row">' +
                                        '<div class="class_classificacao col-md-11" style="display:block;" >' +
                                            '<input type="hidden" id="hid_titulo" value="' + items[i].Id + '" />' +
                                            '<span  style="cursor:pointer;padding-left:50px;color:slateblue;" id="span_titulo">' + items[i].Titulo + '</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</td>' +
                            "</tr>"
                        );
                    });

                    executarPesquisaPorDescricao();
                    marcarDesmarcarRespostaPadrao();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                BASE.MostrarMensagem("Erro ao enviar a solicitação!", TipoMensagem.Error);
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    };

    //BUSCA 2° NIVEL GRID: DESCRICAO
    function executarPesquisaPorDescricao() {
        $('#listaRespostasEncontradas #span_titulo').off('click');
        $('#listaRespostasEncontradas #span_titulo').on('click', function () {
            var div_titulo = $(this).closest('div');

            var id_orientacao = $(div_titulo).find('input[type=hidden]').val();

            if (div_titulo.find('div').length > 0) {
                div_titulo.find('div').each(function () {
                    if ($(this).css('display') == 'block') {
                        $(this).hide();
                    }
                    else {
                        $(this).show();
                    }
                });

                return;
            }

            $('#div_carregando').empty();
            $('#div_carregando').append('<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>');

            $.ajax({
                url: '/Orientacao/PesquisarOrientacaoDescricao/',
                data: { id_orientacao: id_orientacao },
                type: 'Post',
                dataType: "json",
                success: function (data) {
                    $('#div_carregando').empty();

                    if (data.Valido) {
                        items = data.Data;

                        if (items.length == 0) {
                            $(div_titulo).append(
                                '<div class="class_descricao" ><p>Nenhum item encontrado</p></div>'
                            );
                        }

                        $(items).each(function (i) {
                            $(div_titulo).append(
                                '<div class="row">' +
                                    '<div class="col-md-1" style="margin-left:10px;">' +
                                        '<input type="checkbox" name="selectedResposta" value="' + items[i].Id + '" class="checkbox-inline" />' +
                                    '</div>' +
                                    '<div class="class_descricao col-md-11" >' +
                                        '<input type="hidden" id="hid_descricao" value="' + items[i].Titulo + '" />' +
                                        '<span id="span_descricao">' + items[i].Resposta + '</span>' +
                                    '</div>' +
                                '</div>'
                            );
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log('erro !');
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        });
    }

    var bindConfirmarRespostaPadrao = function () {
        $("#confirmarRespostaPadrao").off('click');
        $("#confirmarRespostaPadrao").on('click', function () {
            $('#hdnRespostaPadrao').val(0);

            var txtaResposta = $(textAreaResposta);
            var texto = '';
            $('input[name=selectedResposta]:checked').each(function () {
                texto = texto + $(this).closest('div[class=row]').find('#span_descricao').html() + '<br\>'
            });
            texto = txtaResposta.val() + texto;
            CONTROLES.Editor.DefinirTexto(txtaResposta, texto);

            $(divModal).modal('hide');
            $('#hdnRespostaPadrao').val(1);
        });
    };

    var marcarDesmarcarRespostaPadrao = function () {
        $("#chkTodos").prop('checked', false);
        $("#chkTodos").off('click');
        $("#chkTodos").on('click', function () {
            $('input[name="selectedResposta"]').prop("checked", $(this).prop("checked"));
        });

        $('input[name="selectedResposta"]').off('click');
        $('input[name="selectedResposta"]').on('click', function () {
            var checkeds = $('input[name="selectedResposta"]:checked');
            var todos = $('input[name="selectedResposta"]');

            if (checkeds.length == todos.length) {
                $("#chkTodos").prop('checked', true);
            } else {
                $("#chkTodos").prop('checked', false);
            }
        });
    }

    return {
        Init: init
    };
}());