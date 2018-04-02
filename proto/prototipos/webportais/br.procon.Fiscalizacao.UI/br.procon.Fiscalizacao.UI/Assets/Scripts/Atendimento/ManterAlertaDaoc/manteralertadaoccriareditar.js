MANTERALERTADAOCCRIAREDITAR = (function () {

    var form = $("#form-manter-alerta-daoc");

    function init() {
        bindAll();
    }

    function bindAll() {
     
        bindSelectTipoAlertaDaoc();
        bindChangeNrCnpj();
        bindSelectGrupoFornecedores();
        bindAutoCompleteClassificacao();
        bindAutoCompleteCnae();
        bindBtnVoltar();
        bindBtnCancelar();
        bindBtnLimpar();
        bindBtnSalvar();
    }

    function bindChangeNrCnpj() {
        $("#form-manter-alerta-daoc #NrCnpj").off("change");
        $("#form-manter-alerta-daoc #NrCnpj").on("change", function () {
            var documento = $(this).val();

            buscarFornecedor(documento);
        });
    }

    function bindBtnVoltar() {
        $("#detalhe-alerta-daoc #btn-voltar").off("click");
        $("#detalhe-alerta-daoc #btn-voltar").on("click", function () {

            console.log("execuntado o voltar");
            window.location = "/ManterAlertadaDaoc";
        });
    }

    function bindBtnCancelar() {
        $("#form-manter-alerta-daoc #btn-cancelar").off("click");
        $("#form-manter-alerta-daoc #btn-cancelar").on("click", function () {

            console.log("execuntado o cancelar");
            window.location = "/ManterAlertadaDaoc";
        });
    }

    function bindBtnLimpar() {
        $("#form-manter-alerta-daoc #btn-limpar").off("click");
        $("#form-manter-alerta-daoc #btn-limpar").on("click", function () {
            console.log("execuntado o limpar");
        });
    }

    function bindBtnSalvar() {
        $("#form-manter-alerta-daoc #btn-salvar").off("click");
        $("#form-manter-alerta-daoc #btn-salvar").on("click", function () {
            console.log("execuntado o salvar");
            var valido = validarDados(form);

            if (valido) {
                var objeto = form.serializeObject();
                salvar(objeto);
            }

            else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }

        });
    }

    function bindSelectTipoAlertaDaoc() {
        CONTROLES.DropDown.Preencher("#form-manter-alerta-daoc #IdTipoAlertaDaoc", "ManterAlertadaDaoc", "ComboTipoAlertaDaoc", null, true, null, null, function () {
            var idTipoAlertaSelecionado = $("#IdTipoAlertaSelecionado").val();

            if (idTipoAlertaSelecionado !== undefined && idTipoAlertaSelecionado !== null && idTipoAlertaSelecionado !== "")
                $("#form-manter-alerta-daoc #IdTipoAlertaDaoc").val(idTipoAlertaSelecionado);
        });
    }

    function bindSelectGrupoFornecedores() {
        CONTROLES.DropDown.Preencher("#IdGrupoFornecedor", "ManterAlertadaDaoc", "ComboGrupoFornecedor", null, true);
    }

    function salvar(objeto) {

        $.ajax({
            url: "/ManterAlertadaDaoc/Salvar",
            type: "POST",
            cache: false,
            data: { model: objeto },
            success: function (response, status, xhr) {
              
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length !== 0)
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response.MensagensCriticas);

                else if (response.Erro !== null && response.Erro !== undefined && response.Erro.length !== 0)
                    BASE.Mensagem.Mostrar("Erro ao salvar Alerta Daoc", TipoMensagem.Error, "Erro");

                else {
                    BASE.Mensagem.Mostrar("Cadastro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");

                    setTimeout(function () { window.location = BASE.Url.Simples("/ManterAlertadaDaoc/"); }, 2000);
                }
            },
            error: function () {

            }
        });
    }

    function buscarFornecedor(documento) {
        $.ajax({
            url: "/Fornecedor/GetFornecedorByCNPJ",
            type: "GET",
            data: { cnpj: documento },
            cache: false,
            success: function (response, status, xhr) {

                if (response !== undefined && response !== null)
                    definirNomeFantasiaFornecedor(response.NomeFantasia);

            },
            error: function () {

            }
        });
    }

    function bindAutoCompleteCnae() {

        $("#DescricaoCnae").typeahead({
            onSelect: function (item) {
                definirIdCnaeSelecionado(item.value);
            },
            ajax: {
                url: '/CNAE/BuscarCNAENome',
                triggerLength: 4,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Codigo",
                cache: false,
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {

                    if (data.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta);
                        return false;
                    }

                    return data;
                }
            }
        });
    }

    function bindAutoCompleteClassificacao() {

        $("#DescricaoClassificacao").typeahead({
            onSelect: function (item) {
                definirIdClassificacaoSelecionada(item.value);
            },
            ajax: {
                url: '/Classificacao/BuscarClassificacaoAutoComplete',
                triggerLength: 4,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Id",
                cache: false,
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (result) {

                    if (result.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta);
                        return false;
                    }

                    return result;
                }
            }
        });
    }

    function definirNomeFantasiaFornecedor(nomeFantasiaFornecedor) {
        $("#form-manter-alerta-daoc #nome-fantasia-fornecedor").text(nomeFantasiaFornecedor);
        $("#form-manter-alerta-daoc #NomeFornecedor").val(nomeFantasiaFornecedor);
    }

    function definirIdClassificacaoSelecionada(value) {
        $("#form-manter-alerta-daoc #IdClassificacao").val(value);
    }

    function definirIdCnaeSelecionado(value) {
        $("#IdCnae").val(value);
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
    MANTERALERTADAOCCRIAREDITAR.Init();
});