var ATENDIMENTOSUPERVISOR = (function () {

    var form  = '#filtrar';

    var filtro = "";
    
    function init() {       

        var url  = ATENDIMENTOBASE.Redirect.Obter();

        if(url != undefined && url.split('filtro=').length > 1){
            filtro = ATENDIMENTOBASE.Redirect.Obter().split('filtro=')[1];

        }

        if(filtro != undefined && filtro != ""){

            var data = JSON.parse(atob(unescape(encodeURIComponent(filtro))));

            populaForm(form, data);

        }        

        CONTROLES.Tabela.Configurar();

        bindAll();

    }

    function bindAll() {
        bindBtnAlterarSituacao();
        atribuirAtendimento();
        desatribuirAtendimento();
        bindUnidadeAdministrativa();
        popularComboUa();
        obterTecnico();
        bindAtribuido();
        checkChange();
        removerEnumSituacaoAtendimento();
        radioChange();

        bindBtnFiltrarPaginado();
        bindBtnLimpar();
    }

    function bindBtnFiltrarPaginado() {
        $('#frmFiltroAtendimentoSupervisor #btnFiltrarPaginado').off('click');
        $('#frmFiltroAtendimentoSupervisor #btnFiltrarPaginado').on('click', function (e) {

            var model = $('#filtrar').serializeObject();

            var filtroBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(model))));

            ATENDIMENTOBASE.Redirect.Definir('/AtendimentoSupervisor?filtro=' + filtroBase64);

        });
    }

    function bindBtnLimpar() {
        $('#frmFiltroAtendimentoSupervisor #btnLimpar').off('click');
        $('#frmFiltroAtendimentoSupervisor #btnLimpar').on('click', function (e) {

            ATENDIMENTOBASE.Redirect.Definir('/AtendimentoSupervisor');

        });

    }

    function bindBtnAlterarSituacao() {
        $("#divLista").off("click", "button.btn-alterar-situacao");
        $("#divLista").on("click", "button.btn-alterar-situacao", function () {
            var that = $(this);
            var url = that.data("url");
            BASE.Mensagem.Confirmacao("Alterar situação", "Deseja mesmo alterar a situação da Ficha de Atendimento?", function () {
                alterarSituacaoFichaAtendimento(url);
            }, null, "");
        });
    }

    function alterarSituacaoFichaAtendimento(url) {
        $.ajax({
            url: url,
            type: "POST",
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (isJson)
                    posAlterarSituacaoFichaAtendimento(response);
            },
            error: function () {
                console.log("erro ao salvar a juntada");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function habilitarDesabilitarBotao(bool) {
        $('#barra-associacao button').prop("disabled", bool);
    }

    function atribuirAtendimento() {
        $('#divBarraInferior #associarTecnicoModal #confirmar-atribuir-tecnico').on('click', function () {
            var itens = [];

            $('#divLista table.dataTable input[type="checkbox"]:checked').each(function (i, chk) {
                itens.push(chk.dataset.id);
            });
            if (retornarSelecionado('optiontecnico') === null) {
                BASE.MostrarMensagem("Selecione ao menos um técnico para atribuir.", TipoMensagem.Alerta);
                return;
            }
            if (itens.length > 0 || $("#idUnidadeAdministrativa").val() !== "0") {
                var action = "/AtendimentoSupervisor/AtribuirDesatribuirAtendimentoAoTecnico";
                var parameters = { fichas: itens, tecnico: parseInt(retornarSelecionado("optiontecnico")), atribuir: true };

                $.post(action, parameters)
                    .done(function (data) {
                        if (data.Valido) {
                            BASE.MostrarMensagem(data.Mensagem, TipoMensagem.Sucesso);
                            $("#idUnidadeAdministrativa").val("0");
                            removerSelecionados();
                        }
                    })
                    .fail(function (xmlHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem(jQuery.parseJSON(xmlHttpRequest.responseText).Mensagem, TipoMensagem.error);
                    });
            } else {
                BASE.MostrarMensagem("Selecione ao menos um atendimento para atribuir.", TipoMensagem.Alerta);
                return;
            }
        });
    }

    function desatribuirAtendimento() {
        $("#divBarraInferior #desassociarTecnicoModal #desatribuir-tecnico-modal").on("click", function () {
            var itens = [];

            $('#divLista table.dataTable input[type="checkbox"]:checked').each(function (i, chk) {
                itens.push(chk.dataset.id);
            });

            if (itens.length > 0) {
                var action = "/AtendimentoSupervisor/AtribuirDesatribuirAtendimentoAoTecnico";
                var parameters = { fichas: itens, atribuir: false };

                $.post(action, parameters)
                    .done(function (data) {
                        if (data.Valido) {
                            BASE.MostrarMensagem(data.Mensagem, TipoMensagem.Sucesso);
                            $("#idUnidadeAdministrativa").val("0");
                            removerSelecionados();
                        }
                    })
                    .fail(function (xmlHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem(jQuery.parseJSON(xmlHttpRequest.responseText).Mensagem, TipoMensagem.error);
                    });
            } else {
                BASE.MostrarMensagem("Selecione ao menos um atendimento para desatribuir.", TipoMensagem.Alerta);
                return;
            }
        });
    }

    function removerSelecionados() {
        $('#divLista table.dataTable tr').has('input[type="checkbox"]:checked').remove();
        $("input:radio").attr("checked", false);
    }

    function retornarSelecionado(name) {
        var rads = document.getElementsByName(name);

        for (var i = 0; i < rads.length; i++) {
            if (rads[i].checked) {
                return rads[i].value;
            }
        }
        return null;
    }

    function popularComboUa() {
        $.ajax({
            url: "/UnidadeAdministrativa/ComboUnidadeAdministrativa",
            type: 'GET',
            success: function (data) {
                $("#idUnidadeAdministrativa").empty();
                $("#idUnidadeAdministrativa").append($("<option value='0'>Selecione</option>"));

                $.each(data, function (index, value) {
                    $("#idUnidadeAdministrativa").append($("<option value='" + value.Codigo + "'>" + value.Nome + "</option>"));
                });
                filtroPesquisa($("#idUnidadeAdministrativa").val("0"));
            }
        });
    }

    function obterTecnico(idUa) {
        var ua = idUa === undefined ? 0 : idUa;
        $.ajax({
            url: "/Usuario/ObterTecnicoAtendimento",
            type: 'GET',
            data: { unidadeAdministrativa: parseInt(ua) },
            success: function (data) {
                if (data && data.length > 0) {
                    $("#carregar-tecnicos").empty();
                    $(data).each(function (i) {
                        if (data[i].UnidadeAdministrativas !== null) {
                            $("#carregar-tecnicos").append("<tr>" +
                                "<td class='text-center'><input type='radio' name='optiontecnico' id=" +
                                data[i].Codigo +
                                " value=" +
                                data[i].Codigo +
                                ">" +
                                "</td><td>" +
                                data[i].NomeUsuario +
                                "</td> <td>" +
                                data[i].UnidadeAdministrativas.Nome +
                                "</td></tr>");
                        }
                    });
                } else {
                    $("#carregar-tecnicos").empty();
                    $("#carregar-tecnicos").append("<tr><td colspan='3'>Nenhum arquivo encontrado.</td></tr>");
                }
            }
        });
    }

    function bindUnidadeAdministrativa() {
        $('#idUnidadeAdministrativa').off('change');
        $('#idUnidadeAdministrativa').on('change', function () {
            filtroPesquisa($("#idUnidadeAdministrativa").val());
            $('#idUnidadeAdministrativa').val(localStorage.getItem('idUnidadeAdministrativa'));
            obterTecnico($('#idUnidadeAdministrativa').val());
        });
    }

    function checkChange() {
        $('#divLista').off('click', 'table.dataTable input[type="checkbox"]');
        $('#divLista').on('click', 'table.dataTable input[type="checkbox"]', function () {
            console.log('clicou');
            var checked = 0;
            if (this.checked) {
                habilitarDesabilitarBotao(false);
                return;
            }
            else {
                $('#divLista table.dataTable input[type="checkbox"]:checked').each(function (i, chk) {
                    if (chk.checked) {
                        checked++;
                        return;
                    }
                });
                habilitarDesabilitarBotao(checked > 0 ? false : true);
            }
        });
    }

    function radioChange() {
        $('#carregar-tecnicos').on('click', function () {
            if (retornarSelecionado('optiontecnico') > 0) {
                $('#confirmar-atribuir-tecnico').prop("disabled", false);
            }
        });
    }

    function bindAtribuido() {
        $('#Atribuido').off('change');
        $('#Atribuido').on('change', function () {
            $('#Atribuido').val($('#Atribuido').val());
        });
    }

    function filtroPesquisa(id) {
        localStorage.setItem('idUnidadeAdministrativa', id);
    };

    function removerEnumSituacaoAtendimento() {
        $("#EnumSituacaoAtendimento option[value='RetornoAtendimentoConsumidor']").remove();
        $("#EnumSituacaoAtendimento option[value='Rascunho']").remove();
        $("#EnumSituacaoAtendimento option[value='RecusadoPeloFornecedor']").remove();
    }

    function posAlterarSituacaoFichaAtendimento(response) {
        switch (response.Sucesso) {
            case true:
                BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso, "Sucesso");
                setTimeout(function () { window.location = "/AtendimentoSupervisor" }, 2000);
                break;
            case false:
                BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta, "Alerta");
                break;
        }
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], textarea, input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () {
            if ($(this).attr('type') == 'hidden') {
                //if checkbox is checked do not take the hidden field                
                var $parent = $(this).parent(); var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(elemValue || '');
            }
            else {
                o[this.name] = elemValue || '';
            }
        }); return o;
    }

    function populaForm(form, data) {
        $.each(data, function (name, val) {
            var formId = '#' + $(form).prop('id');
            var $el = $(formId + ' [name="' + name + '"]'),
                type = $el.attr('type');

            switch (type) {
                case 'checkbox':
                    val === 'true' ? $el.attr('checked', true) : $el.attr('checked', false);
                    break;
                case 'radio':
                    $el.filter('[value="' + val + '"]').attr('checked', 'checked');
                    if ($el.filter('[value="' + val + '"]').parent().hasClass('btn'))
                        $el.filter('[value="' + val + '"]').parent().addClass('btn-primary active');
                    break;
                default:
                    $el.val(val);
            }
        });
    }



    return {
        Init: init
    };
}());

$(function () {
    ATENDIMENTOSUPERVISOR.Init();
    CRUDFILTRO.Carregar();
});