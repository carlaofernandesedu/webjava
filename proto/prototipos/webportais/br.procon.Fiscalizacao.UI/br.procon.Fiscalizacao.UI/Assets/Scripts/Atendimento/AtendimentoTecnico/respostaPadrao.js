var RESPOSTAPADRAO = (function () {
    var moduleName = "RESPOSTAPADRAO";
    var table = null;

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);
        carregarLista();
        btnPesquisarClick();

        $('input[name="IdClassificacao"]').off("change");
        $('input[name="IdClassificacao"]').on("change", function (e) {
            BASE.LogEvent(e, moduleName);

            carregarLista();
        });

        $('input[name="IdClassificacao-textfd"]').on("blur", function (e) {
            BASE.LogEvent(e, moduleName);

            if ($(this).val() === "") {
                $('input[name="IdClassificacao"]').val("");
                carregarLista();
            }
        });
    }

    var excluirTextoPadrao = function (id) {
        BASE.LogFunction(arguments.callee, moduleName);

        BASE.Modal.ExibirModalConfirmacao("Excluir Texto Padrão", "Deseja mesmo excluir o Texto Padrão?", "small", '<i class="fa fa-close margR5"></i>Cancelar', "btn-primary", '<i class="fa fa-trash margR5"></i>Excluir', "btn-danger",
            function () {
                var form = { "Id": id };
                $.ajax({
                    type: "POST",
                    url: "/TextoPadrao/TextoPadraoExcluir",
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
    };

    function carregarLista() {
        BASE.LogFunction(arguments.callee, moduleName);
     
        $.ajax({
            type: "GET",
            url: "/TextoPadrao/Listar",            
            dataType: "json",
            success: function (response) {
                var linha = 0;

                $("#tbl-data tbody tr td").css({ 'vertical-align': "middle;" });

                if (table != null) {
                    table.destroy();
                }              

                $("#tbl-data tbody").empty();

                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var alterar = $.validator.format("<a class='btn btn-primary btn-xs' href='/TextoPadrao/TextoPadraoEdit?Id={0}' data-toggle='tooltip' data-placement='top' title='' data-original-title='Alterar'> <i class='fa fa-edit'></i></a>", response[i].Id);
                        var excluir = $.validator.format("<button type='button' onclick='RESPOSTAPADRAO.ExcluirTextoPadrao({0})' class='btn btn-danger btn-xs' href='/classificacao/TextoPadraoExcluir?Id={0}' data-toggle='tooltip' data-placement='top' title='' data-original-title='Excluir'> <i class='fa fa-trash'></i></button>", response[i].Id);

                        linha = $.validator.format("<tr>" +
                            "<td>{0}</td>" +
                            "<td class='text-center'>{1}</td>" +
                            "<td class='text-center'><i class='fa fa-list' style='display:" + (response[i].Tags === "" ? "none" : "block") + "' data-toggle='tooltip' data-placement='top' title='{2}' data-original-title='{2}' aria-hidden='true'></i> </td>" +
                            "<td class='text-center'>{3} {4}</td>" +
                            "</tr>", response[i].Titulo, (response[i].Ativo === true ? "SIM" : "NÃO"), ("" + response[i].Tags).replaceAll(",", ", \n"), alterar, excluir);
                        $("#tbl-data tbody").append(linha);
                    }
                }

                $("[data-toggle='tooltip']").tooltip();
                table = $("#tbl-data").DataTable();
                
            }
        });
    };

    function btnPesquisarClick() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btn-pesquisar").off("click");
        $("#btn-pesquisar").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

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
    var moduleName = "TEXTOPADRAO";

    var init = function () {
        BASE.LogFunction(arguments.callee, moduleName);

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
                maxChars: 20,
                confirmKeys: [1, 2, 9, 13, 32],
                typeahead: {
                    ajax: {
                        url: "/tag/Filtrar",
                        method: "POST"
                    }
                }
            });
        });

        var form = $("#form-texto-padrao")
            .removeData("validator")
            .removeData("unobtrusiveValidation");

        $.validator.unobtrusive.parse(form);
        $('input[name="IdClassificacao-textfd"]').rules("add", {
            required: true,
            messages: {
                required: "Preenchimento Obrigatório."
            }
        });
    };
    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    RESPOSTAPADRAO.Init();
});

var PESQUISAR_MENSAGENS = (function () {
    var moduleName = "PESQUISAR_MENSAGENS";   

    var modalTitle = "Procurar por Texto Padrão";
    var divModal = "#div-modal-resposta-padrao";
    var textAreaResposta = "#resposta";
    var btnIncluirTextoPadrao = "button#respostaPadrao";

    var init = function (title, modal, resposta, btn, serviceUrl) {
        BASE.LogFunction(arguments.callee, moduleName);      

        modalTitle = title;
        divModal = modal;
        textAreaResposta = resposta;
        btnIncluirTextoPadrao = btn;

        CONTROLES.Editor.Configurar();
        $(".Editor-editor").height(450);      

        carregarModal(function () {           

            bindModalRespostaPadrao();
            bindPesquisaPorEnter();
            initModal();
        });
    };

    function initModal() {
        BASE.LogFunction(arguments.callee, moduleName);

        CONTROLES.Typeahead.Configurar();

        $(divModal + " h4.modal-title").text(modalTitle);

        $($('#frm-filtro input[name="titulo"]')[0]).prop("checked", "true");

        bindPesquisarRespostaPadrao();
        bindConfirmarRespostaPadrao();
    };

    function bindModalRespostaPadrao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $(btnIncluirTextoPadrao).off("click");
        $(btnIncluirTextoPadrao).on("click", function () {
            $(divModal).modal("show");
        });
    };

    function carregarModal(callback) {      
        BASE.LogFunction(arguments.callee, moduleName);       

        var tipoAtendimento = $('#idTipoAtendimento').val();

        if(tipoAtendimento == undefined){
            tipoAtendimento = $('#TipoAtendimento').val();
            
        }

        var url = "";      

        if(tipoAtendimento == "1")
        {
            url = "/Classificacao/ModalRespostaPadrao";

        }
        else{

            url = "/TextoPadrao/ModalTextoPadrao";

        }      

        $.ajax({
            type: "GET",
            url: url,
            context: this,
            success: function (response) {
                $("body").append(response);
                callback();
            }
        });
    };

    function bindPesquisaPorEnter() {
        console.log("bindPesquisaPorEnter");

        $('#frm-filtro input[name="filtro"]').off("keypress");
        $('#frm-filtro input[name="filtro"]').keypress(function (e) {
            BASE.LogEvent(e, moduleName);         

            if (e.keyCode === 13) {
                if ($(this).val().length === 0) {
                    BASE.MostrarMensagem("Campo Pesquisa obrigatório.", TipoMensagem.Alerta);
                    e.preventDefault();
                    return;
                }
                executarPesquisaPorClassificacao();
                e.preventDefault();
            }
            
        });
    }

    /*Pesquisar*/
    var items = [];
    function bindPesquisarRespostaPadrao() {
        console.log('bindPesquisarRespostaPadrao');

        $('#frm-filtro button[name="btn-pesquisar"]').off('click');
        $('#frm-filtro button[name="btn-pesquisar"]').on('click', function (e) {
            BASE.LogEvent(e, moduleName);

            executarPesquisaPorClassificacao();
        });
    };

    function bindSelecionarTodos() {
        console.log("bindSelecionarTodos");

        $("#chkTodos").prop("checked", false);
        $("#chkTodos").off("click");
        $("#chkTodos").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            $('input[name="selectedResposta"]').prop("checked", $(this).prop("checked"));
        });

        $('input[name="selectedResposta"]').off("click");
        $('input[name="selectedResposta"]').on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var checkeds = $('input[name="selectedResposta"]:checked');
            var todos = $('input[name="selectedResposta"]');

            if (checkeds.length === todos.length) {
                $("#chkTodos").prop("checked", true);
            } else {
                $("#chkTodos").prop("checked", false);
            }
        });
    };

    function executarPesquisaPorClassificacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var checked = [];

        if ($('#frm-filtro input[name="filtro"]').last().val().length === 0) {
            BASE.MostrarMensagem("Campo Pesquisa obrigatório.", TipoMensagem.Alerta);
            return;
        }

        $("input[name='selectedFiltroResposta']:checked").each(function () {
            checked.push($(this).val());
        });

        if ($("input[data-service-displayfield").val() === "") {
            $("input[name=IdClassificacaoSelecionado]").val("");
        }

        $("#listaRespostasEncontradas").empty();
        $(divModal + " p#resultado-encontrado").empty();
        $("#listaRespostasEncontradas").append("<tr>" + '<td colspan="2" class="text-center"><div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div></td>' + "</tr>");
       
        var tipoAtendimento = $('#idTipoAtendimento').val();       

        if(tipoAtendimento == undefined){
            tipoAtendimento = $('#TipoAtendimento').val();
            
        }

        var url = "";

        var obj = {};       

        if(tipoAtendimento == "1")
        {
            url = "/Orientacao/PesquisarOrientacaoClassificacao";

            obj.descricao = $('#frm-filtro input[name="descricao"]').is(":checked");
            obj.titulo = $('#frm-filtro input[name="titulo"]').is(":checked");
            obj.tag = $('#frm-filtro input[name="tag"]').is(":checked");
            obj.filtro =  $('#frm-filtro input[name="filtro"]').val(); 
            obj.idclassificacao  = $('#frm-filtro input[name="IdClassificacaoSelecionado"]').val();

        }
        else{

            url = "/TextoPadrao/BuscarTextoPadrao";

            obj.descricao = $('#frm-filtro input[name="descricao"]').is(":checked");
            obj.titulo = $('#frm-filtro input[name="titulo"]').is(":checked");
            obj.tag = $('#frm-filtro input[name="tag"]').is(":checked");
            obj.filtro =  $('#frm-filtro input[name="filtro"]').val();           

        }
        

        $.ajax({
            url: url,
            data: obj,
            type: "POST",
            dataType: "json",
            success: function (response) {               
                
                $(divModal + " p#resultado-encontrado").html("<strong>Foram encontado(s) " + response.Resultado.length + " resultado(s) </strong>");

                $(".modal-scrollable").find("#listaRespostasEncontradas").empty();

                if (response.Sucesso) {
                    items = response.Resultado;

                    if (items.length === 0) {
                        $(".modal-scrollable").find("#listaRespostasEncontradas").append(
                            "<tr>" +
                                '<td colspan="2" class="text-center">Nenhum item encontrado.</td>' +
                            "</tr>"
                        );
                    }

                    $(items).each(function (i) {
                        $(".modal-scrollable").find("#listaRespostasEncontradas").append(
                            "<tr>" +
                                '<td class="col-md-1"></td>' +
                                "<td>" +
                                    '<div class="row">' +
                                        '<div class="class_classificacao col-md-11" style="display:block;" >' +
                                            '<input type="hidden" id="hid_titulo" value="' + items[i].Key + '" />' +
                                            '<span  style="cursor:pointer;padding-left:50px;color:slateblue;" id="span_titulo">' + items[i].Value + "</span>" +
                                        "</div>" +
                                    "</div>" +
                                "</td>" +
                            "</tr>"
                        );
                    });

                    executarPesquisaPorDescricao();
                    marcarDesmarcarRespostaPadrao();
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.MostrarMensagem("Erro ao enviar a solicitação!", TipoMensagem.Error);
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    };

    //BUSCA 2° NIVEL GRID: DESCRICAO
    function executarPesquisaPorDescricao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#listaRespostasEncontradas #span_titulo").off("click");
        $("#listaRespostasEncontradas #span_titulo").on("click", function (e) {
            BASE.LogEvent(e, moduleName);         

            var divTitulo = $(this).closest("div");

            var idTitulo = $(divTitulo).find("input[type=hidden]").val();

            if (divTitulo.find("div").length > 0) {
                divTitulo.find("div").each(function () {
                    if ($(this).css("display") === "block") {
                        $(this).hide();
                    }
                    else {
                        $(this).show();
                    }
                });

                return;
            }

            $("#div_carregando").empty();
            $("#div_carregando").append('<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>');

            var url = "";   

            var obj = {};         

            var tipoAtendimento = $('#idTipoAtendimento').val();           

            if(tipoAtendimento == undefined){
                tipoAtendimento = $('#TipoAtendimento').val();

            }

            if(tipoAtendimento == "1")
            {
                url = "/Orientacao/PesquisarOrientacaoDescricao/";
                obj.id_orientacao = idTitulo;
                
            }
            else{
                url = "/TextoPadrao/PesquisarTextoPadraoDescricao/";
                obj.idTitulo = idTitulo;

            }

            $.ajax({
                url: url,
                data: obj,
                type: "Post",
                dataType: "json",
                success: function (data) {
                    $("#div_carregando").empty();

                    if (data.Valido) {
                        items = data.Data;

                        if (items.length === 0) {
                            $(divTitulo).append(
                                '<div class="class_descricao" ><p>Nenhum item encontrado</p></div>'
                            );
                        }

                        $(items).each(function (i) {
                            $(divTitulo).append(
                                '<div class="row">' +
                                    '<div class="col-md-1" style="margin-left:10px;">' +
                                        '<input type="checkbox" name="selectedResposta" value="' + items[i].Codigo + '" class="checkbox-inline" />' +
                                    "</div>" +
                                    '<div class="class_descricao col-md-11" >' +
                                        '<input type="hidden" id="hid_descricao" value="' + items[i].Titulo + '" />' +
                                        '<span id="span_descricao">' + items[i].Resposta + "</span>" +
                                    "</div>" +
                                "</div>"
                            );
                        });
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        });
    }

    function bindConfirmarRespostaPadrao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#confirmarRespostaPadrao").off("click");
        $("#confirmarRespostaPadrao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            $("#hdnRespostaPadrao").val(0);

            var txtaResposta = $(" .Editor-editor #span_mensagem_padrao");

            if (txtaResposta.length === 0) {
                txtaResposta = $(" .Editor-editor");
            }

            var texto = "";
            $('input[name=selectedResposta]:checked').each(function () {
                texto = texto + $(this).closest("div[class=row]").find('#span_descricao').html() + "<br\>";
            });

            txtaResposta.html(texto);

            CONTROLES.Editor.DefinirTexto(txtaResposta, texto);

            $(".modal").modal("hide");
            $("#hdnRespostaPadrao").val(1);
        });
    };

    function marcarDesmarcarRespostaPadrao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#chkTodos").prop("checked", false);
        $("#chkTodos").off("click");
        $("#chkTodos").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            $('input[name="selectedResposta"]').prop("checked", $(this).prop("checked"));
        });

        $('input[name="selectedResposta"]').off("click");
        $('input[name="selectedResposta"]').on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var checkeds = $('input[name="selectedResposta"]:checked');
            var todos = $('input[name="selectedResposta"]');

            if (checkeds.length == todos.length) {
                $("#chkTodos").prop("checked", true);
            } else {
                $("#chkTodos").prop("checked", false);
            }
        });
    };

    return {
        Init: init
    };
}());