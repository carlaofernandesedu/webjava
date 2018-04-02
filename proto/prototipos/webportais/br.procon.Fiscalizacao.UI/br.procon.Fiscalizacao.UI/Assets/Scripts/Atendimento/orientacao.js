var ORIENTACAO = (function () {
    var EditorRespostaCurta = {};
    var EditorRespostaFormal = {};

    var bindModalOK = false;

    function init() {      

        $('#filtrar').slideToggle('show');

        CRUDFILTRO.Carregar = carregarFiltro;
        CRUDFILTRO.ElementoResultado = $("#divLista");
        CRUDFILTRO.Evento.PosListar = PosListar;
        CRUDFILTRO.Evento.PosFitrarErro = bindErro;

         document.body.addEventListener('DOMNodeInserted', function (event) {

            if ($('a[href=#InsertLink]').parent('div').parent('div[id=menuBarDiv]').length > 0){
                
                $('a[href=#InsertLink]').off('click');
                $('a[href=#InsertLink]').on('click', function(e) {

                    var textarea = $(this).parent('div').parent('div').parent('div').parent('div').find('textarea[class="form-control"]');

                    $(textarea).closest('div').find(' .Editor-editor').focus();  

                    var span_id =  $(textarea).attr('id') + '_caret';  

                    $('#' + span_id).remove();           

                    pasteHtmlAtCaret("<span id='" + span_id  + "' />", false);                   
                    
                    $('div[id=InserirHyperlink][class*="modal"]').attr('textarea', $(textarea).attr('id'));
                    
                    $('#InserirHyperlink').modal('toggle');   

                    e.stopPropagation();                        
                    
                });
            }

            if ($('#InserirHyperlink').find('button[class*=btn-success]').length > 0) {

                $('#InserirHyperlink').find('button[class*=btn-success]').off('click');
                $('#InserirHyperlink').find('button[class*=btn-success]').on('click', function(e) {                       
                    
                    var textarea = $('div[id=InserirHyperlink][class*="modal"]').attr('textarea');                   
                    var descricaoLink = $('#InserirHyperlink').find('input[id=inputText]').val();
                    var url = $('#InserirHyperlink').find('input[id=inputUrl]').val();                             

                    var hyperlink = "<a href='" + url + "'>" + descricaoLink + "</a>";

                    $('#' + textarea + '_caret').after(hyperlink);

                    $('#' + textarea + '_caret').remove();

                    $('#InserirHyperlink').modal('hide');                  

                    e.stopPropagation();

                  });
            }
            
        }, false);

        bindAll();
    }

    function carregarFiltro() { }
    
    function PosListar() { }

    function bindErro() { }

    //Sinaliza que os Binds serão feitos posteriomente
    //a chamada de criação da Modal
    function bindAll() {
        bindEventos();
        bindBtnFiltrar();
        bindLimpaClassificacao();       
        
    }  

    function bindBtnFiltrar() {
        $('#btnFiltrar').off('click');
        $('#btnFiltrar').on('click', function () {
            $('#IdClassificacao').val($('input[name=IdClassificacaoSelecionado]').val());
        });
    }

    function bindLimpaClassificacao() {
        $('input[name="IdClassificacaoSelecionado-textfd"]').off('chamge');
        $('input[name="IdClassificacaoSelecionado-textfd"]').on('change', function () {
            if ($(this).val() == "") {
                $('input[name=IdClassificacaoSelecionado]').val('');
                $('#IdClassificacao').val('');
            }
        });
    }

    //O método só será executado após ser chamado
    //no objeto CRUDBASE
    function bindEventos() {
        CRUDBASE.Eventos.PosCarregarEditar = posCarregarEditar;
    }

    //Faz o Bind após a Modal ser carregada
    //para identificar os controles corretamente
    function posCarregarEditar() {
        bindLimpar();
        bindSalvar();
        bindPublicar();
        bindBuscarClassificacao();
        TAG.PosCarregarDetalhe();
        perderFocoTitulo();
        RespostaCurtaChange();
        RespostaFormalChange();

        CONTROLES.Typeahead.Configurar();

        if (verificarStatus()) {
            habilitarBotoes();
        }

        EditorRespostaCurta = $('textarea[name="RespostaCurta"]').Editor({
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
            "insert_link": true,
            "unlink": true,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": false,
            "splchars": false,
            "block_quote": false,
            "source": true
        });

        EditorRespostaFormal = $('textarea[name="RespostaFormal"]').Editor({
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
            "insert_link": true,
            "unlink": true,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": false,
            "splchars": false,
            "block_quote": false,
            "source": true
        });

        if (verificarStatus()) {
            habilitarBotoes();
        } else {
            desabilitarBotoes();
        }
    };

    function bindLimpar() {
        $('#modalDetalhe').off('click', '.modal-footer .btn-limpar');
        $('#modalDetalhe').on('click', '.modal-footer .btn-limpar', function () {
            limpar();
            TAG.LimparTags();
            return false;
        });
    }

    function bindSalvar() {
        $('#modalDetalhe').off('click', '.btn-salvar');
        $('#modalDetalhe').on('click', '.btn-salvar', function () {
            var form = $("#form-detalhe");
            var valido = validarDados(form);
            if (valido) {
                if (($('textarea[name="RespostaCurta"]').val() == undefined && $('textarea[name="RespostaFormal"]').val() == undefined) || ($('textarea[name="RespostaCurta"]').val() == '' && $('textarea[name="RespostaFormal"]').val() == '')) {
                    BASE.Mensagem.Mostrar("Favor preencher os campos Resposta Curta ou Resposta Formal" + "<br>" + " Ao menos um dos campos deve ser preenchido.",
                        TipoMensagem.Error,
                        "Atenção");
                    return false;
                }
                var form = $("#modalDetalhe #form-detalhe");
                btn = $(this);
                url = btn.attr('data-url');
                publicarSalvar(url, form);
                return false;
            } else {
                form.validate();
            }
        });
    }

    function bindPublicar() {
        $('#modalDetalhe').off('click', '.btn-publicar');
        $('#modalDetalhe').on('click', '.btn-publicar', function () {
            var form = $("#form-detalhe");
            var valido = validarDados(form);
            if (valido) {
                if (($('textarea[name="RespostaCurta"]').val() == undefined && $('textarea[name="RespostaFormal"]').val() == undefined) || ($('textarea[name="RespostaCurta"]').val() == '' && $('textarea[name="RespostaFormal"]').val() == '')) {
                    BASE.Mensagem.Mostrar("Favor preencher os campos Resposta Curta ou Resposta Formal" + "<br>" + " Ao menos um dos campos deve ser preenchido.",
                        TipoMensagem.Error,
                        "Atenção");
                    return false;
                }
                var form = $("#modalDetalhe #form-detalhe");
                btn = $(this);
                url = btn.attr('data-url');
                publicarSalvar(url, form);
                return false;
            } else {
                form.validate();
            }
        });
    }

    function bindBuscarClassificacao() {
        $('#txtClassificacao').val($('#hdClassificacaoTexto').val());

        $("#Classificacao").data("val", 'true');
        $("#Classificacao").data("valRequired", "O campo 'Classificacao' é de preenchimento obrigatório.");

        $("#txtClassificacao").off('blur');
        $("#txtClassificacao").on('blur', function () {
            if ($('#IdClassificacao').val()) {
                if (verificarStatus()) {
                    habilitarBotoes();
                } else {
                    desabilitarBotoes();
                }
            } else {
                desabilitarBotoes();
            }
        });

        $("#txtClassificacao").off('keyup');
        $("#txtClassificacao").on('keyup', function (e) {
            if ($(this).val() == '' || e.keyCode == 8) {
                $('#IdClassificacao').val('');
            }
        });

        $("#txtClassificacao").typeahead({
            onSelect: function (item) {
                $('#IdClassificacao').val(item.value);
            },
            ajax: {
                url: '/Classificacao/BuscarClassificacaoAutoComplete/',
                triggerLength: 4,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    return data;
                }
            }
        });
    }

    function perderFocoTitulo() {
        $("#modalDetalhe #Titulo").off('blur');
        $("#modalDetalhe #Titulo").on('blur', function () {
            if ($('#modalDetalhe #Titulo').val()) {
                if (verificarStatus()) {
                    habilitarBotoes();
                } else {
                    desabilitarBotoes();
                }
            } else {
                desabilitarBotoes();
            }
        });
    }

    function RespostaCurtaChange() {
        $('textarea[name="RespostaCurta"]').off('change');
        $('textarea[name="RespostaCurta"]').on('change', function () {
            console.log(BASE.CountWords($(this).data('editor')));

            if (BASE.CountWords($(this).data('editor')) != 0) {
                if (verificarStatus())
                    habilitarBotoes();
                else
                    desabilitarBotoes();
            } else {
                if (verificarStatus())
                    habilitarBotoes();
                else
                    desabilitarBotoes();
            }
        });
    }

    function RespostaFormalChange() {
        $('textarea[name="RespostaFormal"]').off('change');
        $('textarea[name="RespostaFormal"]').on('change', function () {            

            if (BASE.CountWords($(this).data('editor')) != 0) {
                if (verificarStatus())
                    habilitarBotoes();

                else
                    desabilitarBotoes();
            } else {
                if (verificarStatus())
                    habilitarBotoes();

                else
                    desabilitarBotoes();
            }
        });
    }

    function verificarStatus() {
        var resposta = (BASE.CountWords($('#modalDetalhe textarea[name="RespostaCurta"]').data('editor')) != 0 || BASE.CountWords($('#modalDetalhe textarea[name="RespostaFormal"]').data('editor')) != 0);

        if ($("#modalDetalhe input[name='IdClassificacao-textfd']").val()) {
            if ($('#modalDetalhe #Titulo').val()) {
                if (resposta) {
                    if ($('#modalDetalhe #txtClassificacao').val() && $('#modalDetalhe #IdClassificacao').val() == '') {
                        BASE.Mensagem.Mostrar("Classificação não existe!", TipoMensagem.Error, "Atenção");
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function habilitarBotoes() {
        $("#modalDetalhe #btnSalvar").prop('disabled', false);
        $("#modalDetalhe #btnPublicar").prop('disabled', false);
    }

    function desabilitarBotoes() {
        $("#modalDetalhe #btnSalvar").prop('disabled', true);
        $("#modalDetalhe #btnPublicar").prop('disabled', true);
    }

    function limpar(form) {
        $("#modalDetalhe input:text:not([readonly])").val('');
        $("#modalDetalhe textarea").val('');
        $('#modalDetalhe select').val('');
        $('#modalDetalhe .radio-inline').prop('checked', false);
        $('#modalDetalhe .radio-default-value').prop('checked', true);
        TAG.LimparTags();
    }

    function publicarSalvar(url, form) {
        var respostaCurta = $($('div[class*=Editor-editor]')[0]).html()
        var respostaFormal = $($('div[class*=Editor-editor]')[1]).html()

        var obj = form.serializeObject();

        obj.RespostaCurta = respostaCurta;
        obj.RespostaFormal = respostaFormal;

        $.ajax({
            type: "POST",
            url: url,
            data: obj,
            success: function (response) {
                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                }
                else if (response.Sucesso === true) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                    BASE.Modal.Ocultar(CRUDFILTRO.Filtrar);
                }
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }   

    return {
        Init: function () {
            init();
        },
        Limpar: limpar
    };
}());

$(function () {
    ORIENTACAO.Init();
    //CRUDFILTRO.Filtrar();
});
