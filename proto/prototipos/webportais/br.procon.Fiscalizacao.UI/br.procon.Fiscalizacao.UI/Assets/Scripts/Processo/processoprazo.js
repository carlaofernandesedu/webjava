PROCESSOPRAZO = (function () {

    var form = '#form-processo-prazo-filtro';

    function init() {
        bindAll();
        carregarListaMotivo();
    };

    function bindAll() {
        bindMascara();
        bindBtnPesquisar();
        bindAlterarSituacao();
        bindCarregarPaginacao();
    };

    function bindCarregarPaginacao() {
        $('#table-processo-prazo').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"]
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function bindBtnPesquisar() {
        $(form + ' #btn-pesquisar').off('click');
        $(form + ' #btn-pesquisar').on('click', function () {
            console.log('executando pesquisa do prazo');

            var vmodel = $(form).serializeObject();
            pesquisarProcessoPrazo(vmodel);
        });
    }

    function bindAlterarSituacao() {
        $(".acoes .btn-alterar-situacao").off("click");
        $(".acoes .btn-alterar-situacao").on("click", function () {
            var objProcessoPrazo = {
                idProcessoPrazo: $(this).data("id-processo-prazo"),
                idProcesso: $(this).data("id-processo"),
                IdSituacaoProcessoPrazo: null
            }

            carregarComboSituacao(function (listaSituacao) {
                BASE.Modal.ExibirModalPrompt(
                    "Situação Processo Prazo",
                    TipoInput.Select,
                    listaSituacao,
                    "Teste",
                    TamanhoModal.Pequeno,
                    null,
                    '<i class="fa fa-close margR5"></i>Cancelar',
                    'btn-danger',
                    '<i class="fa fa-save margR5"></i>Inclui',
                    'btn-primary',
                    function (value) {
                        objProcessoPrazo.IdSituacaoProcessoPrazo = parseInt(value);
                        alterarSituacaoProcessoPrazo(objProcessoPrazo);

                        return true;
                    },
                    function (value) {
                        var form = $(".bootbox-form");

                        if (value === undefined) {
                            valido = validarDados(form);
                            form.validate();
                            return valido;
                        }
                    });
            });
        });
    }

    function bindMascara() {
        $(form + " #NrProcessoFormatado").mask("999999.9999.9");
    }

    function bindValidacaoCampos() {
        $(".bootbox-form select").attr({ name: "IdSituacaoProcessoPrazo", id: "IdSituacaoProcessoPrazo" });

        $(".bootbox-form").validate({
            rules: {
                IdSituacaoProcessoPrazo: "required"
            },
            messages: {
                IdSituacaoProcessoPrazo: "Campo obrigatório"
            }
        });
    }

    function bindBtnCancelar() {
        $('.bootbox .modal-footer button.btn.btn-danger').attr("data-dismiss", "modal");
    }

    function carregarComboSituacao(callback) {

        $.ajax({
            url: "/ProcessoPrazo/CarregarComboSituacaoProcesso",
            type: "GET",
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (!isJson) {
                    console.log("erro ao carregar combo situação processo prazo.");
                }
                else {
                    if (callback !== undefined) {
                        callback(BASE.Objeto.CriarArrayObjetoDinamico(response.Lista));
                        bindBtnCancelar();
                        bindValidacaoCampos();
                    }

                }
            },
            error: function (response, status, xhr) {
                console.log("erro situação processo prazo.");
            }
        });
    }

    function carregarListaMotivo() {

        $.ajax({
            url: "/ProcessoPrazo/CarregarComboPrazoCumprimento",
            type: "GET",
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {

                    $("#PrazoCumprimento").empty();
                    $("#PrazoCumprimento").append($("<option value='null'>Selecione</option>"));

                    $.each(response.ListaPrazoCumprimento, function (index, value) {
                        $("#PrazoCumprimento").append($("<option value='" + value.Codigo + "'>" + value.DescricaoPrazoCumprimento + "</option>"));
                    });
                }
            },
            error: function () {
                console.log("Erro ao carregar lista de prazo cumprimento");
            }
        });

    }

    function pesquisarProcessoPrazo(vmodel) {

        $.ajax({
            url: "/ProcessoPrazo/Filtar",
            type: "POST",
            data: { filtro: vmodel },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    renderHtml(response);
                    posCarregar();
                }
                else {
                    BASE.Mensagem.Mostrar("Erro ao pesquisar Prazo Processo", TipoMensagem.Alerta, "Alerta");
                }
            },
            error: function () {
                console.log("Error ao carregar lista de prazo de processos.");
            }
        });
    }

    function alterarSituacaoProcessoPrazo(objeto) {
        $.ajax({
            url: "/ProcessoPrazo/AlterarSituacaoProcesso",
            type: "POST",
            data: { viewModel: objeto },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Retorno não é json");
                } else {
                    if (response.Retorno.Sucesso) {
                        BASE.Mensagem.Mostrar(response.Retorno.Mensagem, TipoMensagem.Sucesso, "Sucesso!");
                        preAlterar();
                    }

                }
            },
            error: function () {

            }
        });
    }

    function carregarListaProcessoPrazo() {
        $.ajax({
            url: "/ProcessoPrazo/Listar",
            type: "GET",
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    renderHtml(response);
                    posAlterar();
                }
            },
            error: function () {

            }
        });
    }

    function renderHtml(html) {
        $('#lista-processo-prazo').html(html);
    }

    function preAlterar() {
        carregarListaProcessoPrazo();
    }

    function posAlterar() {
        bindBtnPesquisar();
        bindAlterarSituacao();
        bindCarregarPaginacao();
    }

    function posCarregar() {
        bindCarregarPaginacao();
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
        }
    };

}());

$(function () {
    PROCESSOPRAZO.Init();
});