var GRUPOATENDIMENTO = (function () {
    var validate = {};

    var init = function () {
        bindObterFornecedorAutoComplete();
        bindFornecedor();
        bindTipoAtendimentoSituacaoAtendimento();
        bindCNAE();
        bindSalvar();
        bindRemoverFornecedor();
        bindRemoverCnae();
        bindFornecedorChange();
        bindCnaeChange();
    };

    function bindFornecedorChange() {
        $('#txtFornecedorNome').off('change');
        $('#txtFornecedorNome').on('change', function () {
            if ($(this).val() == '') {
                $('#id_fornecedor').val('');
            }
        });
    }

    function bindCnaeChange() {
        $('input[data-value-field=id_cnae]').off('change');
        $('input[data-value-field=id_cnae]').on('change', function () {
            if ($(this).val() == '') {
                $('input[name=id_cnae]').val('');
            }
        });
    }

    function bindRemoverFornecedor() {
        $('#conteudo_principal').on('click', '#btnRemoverFornecedor', function () {
            $('#txtFornecedorNome').val('');
            $('#id_fornecedor').val('');
        });
    }

    function bindRemoverCnae() {
        $('#conteudo_principal').on('click', '#btnRemoverCnae', function () {
            $('input[name=id_cnae-textfd]').val('');
            $('input[name=id_cnae]').val('');
        });
    }

    function atribuirTipoAtendimento(tipoGrupo) {
        switch (tipoGrupo) {
            case "1":
                $("#form-grupo #id_tipo_atendimento").val(4);
                break;
        }
    }
    var bindSalvar = function () {
        var campo = $('button[name="btnSalvar"]');
        campo.unbind('click').bind('click', function (e) {
            atribuirTipoAtendimento($("#grupo_por").val());

            var obj = $("#form-grupo").serializeObject();

            var form = $("#form-grupo");
            validade = form.validate();

            if (form.valid()) {
                $.ajax({
                    type: "POST",
                    url: "/GruposAtendimento/Salvar",
                    data: obj,
                    dataType: "json",
                    success: function (response) {
                        BASE.Mensagem.Mostrar("Grupo salvo com sucesso!", TipoMensagem.Sucesso);
                        setTimeout(function () {
                            window.location = "/GruposAtendimento/Index";
                        }, 1000);
                    },
                    error: function (data) {
                        var msgs = JSON.parse(data.responseText);
                        var msg = '';
                        for (var i = 0; i < msgs.length; i++) {
                            msg += msgs[i] + "<br/>";
                        }
                        BASE.Mensagem.Mostrar("Problemas ao salvar o grupo." + msg, TipoMensagem.Error);
                    }
                });
            }
        });
    };

    function bindObterFornecedorAutoComplete() {
        var txt = $("#txtFornecedorNome", "body");
        txt.typeahead({
            onSelect: function (item) {
                definirFornecedor(item.value, '', '');
            },
            matcher: function (item) {
                return true;
            },
            ajax: {
                url: '/Fornecedor/ObterFornecedorAutoComplete/',
                triggerLength: 2,
                dataType: "json",
                displayField: "Html",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        filtro: query
                    }
                },
                preProcess: function (data) {
                    console.log(data);
                    return data;
                }
            }
        });
    }

    var bindFornecedor = function () {
        var campo = $('input[name="nr_cpf_cnpj"]');
        campo.unbind('keypress').bind('keypress', function (e) {
            if ($(this).val().length == 18) {
                pesquisarFornecedor($(this).val());
            }
            else {
                removerFornecedor();
            }
        })
        campo.unbind('blur').bind('blur', function (e) {
            if ($(this).val().length == 18) {
                pesquisarFornecedor($(this).val());
            }
            else {
                removerFornecedor();
            }
        })
    };

    var bindTipoAtendimentoSituacaoAtendimento = function () {
        $('.listaTipoAtendimento').hide();
        $('.listaSituacaoAtendimento').hide();

        if ($('input[name="id_tipo_atendimento"]:checked').val() != undefined && $('input[name="id_tipo_atendimento"]:checked').val() != "") {
            $('select[name="grupo_por"]').val("0");
            MudarSituacaoGrupo("0");
        }

        if ($('input[name="id_situacao_atendimento"]:checked').val() != undefined && $('input[name="id_situacao_atendimento"]:checked').val() != "") {
            $('select[name="grupo_por"]').val("1");
            MudarSituacaoGrupo("1");
        }

        $('select[name="grupo_por"]').off('change');
        $('select[name="grupo_por"]').on('change', function () {
            MudarSituacaoGrupo($(this).val());
        });
    };

    var MudarSituacaoGrupo = function (v) {
        $('.listaTipoAtendimento').hide();
        $('.listaSituacaoAtendimento').hide();

        $('input[name="id_tipo_atendimento"]').rules("remove", "required");
        $('input[name="id_situacao_atendimento"]').rules("remove", "required");

        switch (v) {
            case "0":
                $('input[name="id_situacao_atendimento"]').removeProp('checked');
                $('input[name="id_tipo_atendimento"]').rules("add", { required: true, messages: { required: "Preechimento obrigatório." } });
                $('.listaTipoAtendimento').show();
                break;

            case "1":
                $('input[name="id_tipo_atendimento"]').removeProp('checked');
                $('input[name="id_situacao_atendimento"]').rules("add", { required: true, messages: { required: "Preechimento obrigatório." } });
                $('.listaSituacaoAtendimento').show();
                break;

            default:
                break;
        }

        var form = $("#form-grupo");
        $.validator.unobtrusive.parse(form);
    };

    var pesquisarFornecedor = function (value) {
        $.ajax({
            type: "GET",
            url: "/Fornecedor/GetFornecedorByCNPJ/",
            data: { cnpj: value },
            success: function (data) {
                console.log(data);
                if (data) {
                    definirFornecedor(data.Codigo, data.NomeFantasia, data.PJ.CNPJ);
                }
            },
            error: function (data) {
                console.log(data);
                BASE.Mensagem.Mostrar("Erro ao carregar um fornecedor!", TipoMensagem.Alerta);
            }
        });
    };

    function definirFornecedor(codigo, nome, cnpj) {
        $('input[name="id_fornecedor"]').val(codigo);
        $('#span_fornecedor_nome').html(nome);
        $('#span_fornecedor_documento').html(cnpj);
    }

    function removerFornecedor() {
        $('input[name="id_fornecedor"]').val('');
        $('#span_fornecedor_nome').html('');
        $('#span_fornecedor_documento').html('');
    }

    var bindCNAE = function () {
    };

    $.fn.serializeObject = function () {
        var o = {};

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
    GRUPOATENDIMENTO.Init();
});