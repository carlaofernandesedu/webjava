var CONSUMIDOR = (function () {

    var init = function () {
        CONTROLES.Tabela.Configurar();
        bindAll();
    }

    function bindAll() {
        bindChangeIdTipoDeficiencia();
        bindClickPossuiDeficiencia();
        bindBtnSalvar();
        bindBtnEditar();
        bindBtnVoltar();
        verificarIdTipoDeficiencia();
        veridicarPossuiDeficiencia();
        verificarIdConsumidor();

        document.body.addEventListener('DOMNodeInserted', function (event) {           

            if ($('#tblUsuario tr button').length > 0){
                bindConsumidorSeleciona();
            }
        }, false);
        
    }

    function bindChangeIdTipoDeficiencia() {
        $("#IdTipoDeficiencia").off("change");
        $("#IdTipoDeficiencia").on("change", function () {
            if ($("#IdTipoDeficiencia").val() === "0") {
                $("#deficiencia_outro").toggleClass("hide");
            }
            else {
                $("#OutroTipoDeficiencia").val("");
                $("#deficiencia_outro").addClass("hide");
            }
        });
    }

    function bindClickPossuiDeficiencia() {
        $("#PossuiDeficiencia").off("click");
        $("#PossuiDeficiencia").on("click", function () {
            $("#deficiencia").toggleClass("hide");
        });
    }

    function bindConsumidorSeleciona() {
        $(" .btnConsumidorSeleciona").off("click");
        $(" .btnConsumidorSeleciona").on("click", function () {
            var that = $(this);
            var url = that.data("url");

            var idConsumidor = url.split('/')[url.split('/').length - 1];

            $('#IdConsumidor').val(idConsumidor);

            $.ajax({
                url: url,
                success: function (response, status, xhr) {                    
                    $("#conteudo_principal").empty();
                    $("#conteudo_principal").html(response);
                    
                    $(' [data-url*=ConsumidorContinuar]').hide();

                    bindVoltarParaConsumidorProcura();
                    bindConsumidorEscrita();
                    
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    $("#modalDetalhe").modal("hide");
                }
            });
        });
    }

    function bindConsumidorEscrita() {
        $("body").on("click", "#btnConsumidorEscrita", function () {
            
            var idConsumidor = $('#IdConsumidor').val();

            var that = $(this);
            var url = that.data("url");

            $.ajax({
                url: url,
                data: { id: idConsumidor },
                success: function (response, status, xhr) {
                   
                    $("#conteudo_principal").empty();
                    $("#conteudo_principal").html(response);

                    $('#btnConsumidorSalvarEContinuar').html($('#btnConsumidorSalvarEContinuar').html().replace('Salvar e Continuar', 'Salvar'));

                    bindValidaFormConsumidorEscrita();
                    bindComportamentoEscrita();
                    definirComportamentoFornecedorEscrita();
                    bindMascara();
                    bindConsumidorSalvarEContinuar();
                    bindVoltarParaConsumidorProcura();
                    bindClickPossuiDeficiencia();
                    CONTROLES.Configurar.DatePicker();
                    definirDeficiencia();

                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    bindHabilitaCampoOutroTipoDeficiencia();
                    bindCampoTipoDeficiencia();
                    $("#divConsumidorEscrita #CPF").prop("disabled", true);
                    $("#divConsumidorEscrita #Email").prop("disabled", true);
                }
            });
        });
    }

    function bindBtnSalvar() {
        $(".btn-salvar").unbind("click").bind("click", function () {
            if ($("#form-detalhe").valid()) {

                var obj = $("#form-detalhe").serializeObject();

                $.ajax({
                    type: "POST",
                    url: "/Consumidor/Salvar",
                    data: obj,
                    dataType: "json",
                    success: function (response, text) {
                        window.location = "/Consumidor/"
                    },
                    error: function (request, status, error) {
                        BASE.MostrarMensagem("Não foi possível salvar o consumidor.", TipoMensagem.Error, "Erro");
                    }
                });
            }
        });
    }

    function bindBtnEditar() {
        $(".btn-editar").off("click");
        $(".btn-editar").on("click", function () {
            $(":input").css("cursor", "default").prop("disabled", false);
            $(".cpf").css("cursor", "not-allowed").prop("disabled", true);
            $(".email").css("cursor", "not-allowed").prop("disabled", true);
        });
    }

    function bindBtnVoltar() {
        $(".btn-voltar").off("click");
        $(".btn-voltar").on("click", function () {
            parent.history.back();

            return false;
        });
    }

    function verificarIdTipoDeficiencia() {
        if ($("#IdTipoDeficiencia").val() === "0") {
            $("#deficiencia_outro").toggleClass("hide");
        }
        else {
            $("#OutroTipoDeficiencia").val("");
            $("#deficiencia_outro").addClass("hide");
        }
    }

    function veridicarPossuiDeficiencia() {
        if ($("#PossuiDeficiencia").is(":checked")) {
            $("#deficiencia").toggleClass("hide");
        }
    }

    function verificarIdConsumidor() {
        if ($("#IdConsumidor").val() === undefined || $("#IdConsumidor").val() === "0") {
            $("#DataNascimento").val("");
        }
        else {
            $(".btn-success").show();
        }

        if ($("#IdConsumidor").val() !== undefined && $("#IdConsumidor").val() !== "0") {
            $(":input").css("cursor", "not-allowed").prop("disabled", true);
            $(".btn").css("cursor", "default").prop("disabled", false);
        }
    }

    function bindValidaFormConsumidorEscrita() {
        $("#frmConsumidorEscrita").validate({
            rules: {
                DataNascimento: {
                    required: true,
                    dateBR: true
                },
                CPF: {
                    required: true
                },
                Nome: {
                    required: true,
                },
                Sexo: {
                    required: true,
                },
                CEP: {
                    required: true,
                },
                Logradouro: {
                    required: true,
                },
                Numero: {
                    required: true,
                },
                Cidade: {
                    required: true,
                },
                UF: {
                    required: true,
                }
            },
            messages: {
                DataNascimento: {
                    required: "Campo obrigatório",
                },
                CPF: {
                    required: "Campo obrigatório",
                },
                Nome: {
                    required: "Campo obrigatório",
                },
                Sexo: {
                    required: "Campo obrigatório",
                },
                CEP: {
                    required: "Campo obrigatório",
                },
                Logradouro: {
                    required: "Campo obrigatório",
                },
                Numero: {
                    required: "Campo obrigatório",
                },
                Cidade: {
                    required: "Campo obrigatório",
                },
                UF: {
                    required: "Campo obrigatório",
                }
            }
        });
    }

    function bindMascara() {
        $("#Numero").mask("99999");
    }

    function bindComportamentoEscrita() {
        $("#frmConsumidorEscrita").on('click', '#PossuiDeficiencia', function () {
            definirComportamentoFornecedorEscrita();
        });
    }

    function definirComportamentoFornecedorEscrita() {
        definirDeficiencia();
    }

    function definirDeficiencia() {
        var possuiDeficiencia = $("#frmConsumidorEscrita #PossuiDeficiencia").is(":checked");

        if (possuiDeficiencia)
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), true, null);
        else
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), false, function () { $("#IdTipoDeficiencia").val(""); });
    }

    function bindHabilitaCampoOutroTipoDeficiencia() {
        var habilita = $("#IdTipoDeficiencia").val() === "0";
        CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), habilita, null);
    }

    function bindCampoTipoDeficiencia() {
        $("#frmConsumidorEscrita #PossuiDeficiencia").on("change", function () {
            var possuiDeficiencia = $(this).is(":checked");

            if (!possuiDeficiencia)
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia, #outroTipoDeficienciaDiv"), false, null);
            else
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), true, function () { $("#frmConsumidorEscrita #IdTipoDeficiencia").val("") });

            bindValidaTipoDeficientia(possuiDeficiencia);
        });

        $("#frmConsumidorEscrita #IdTipoDeficiencia").off("change", function () {
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), false, null);
        });

        $("#frmConsumidorEscrita #IdTipoDeficiencia").on("change", function () {
            var habilitaOutroTipoDef = $("#IdTipoDeficiencia").val() === "0";

            if (habilitaOutroTipoDef)
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), true, function () { bindValidaOutroTipoDeficiencia(true); });
            else
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), false, function () {
                    bindValidaOutroTipoDeficiencia(false);
                    limpaCampoOutroTipoDeficiencia();
                });
        });
    }

    function bindConsumidorSalvarEContinuar() {
        $("body").on("click", "#btnConsumidorSalvarEContinuar", function () {
            var that = $(this),
                url = that.data("url"),
                form = $("#frmConsumidorEscrita"),
                dataNasc = $('#divConsumidorEscrita #DataNascimento').val(),
                data = BASE.Util.ValidarData(dataNasc);

            if (!data.isValid()) {
                bindValidaFormConsumidorEscrita();
            }

            var obj = $("#frmConsumidorEscrita").serializeObject();

            if (validarDados(form)) {
                $.ajax({
                    url: url,
                    data: obj,
                    success: function (response, status, xhr) {
                        
                        if (BASE.Util.ResponseIsJson(xhr)) {
                            if (response.Sucesso === false) {
                                BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                            }
                        }
                        else {
                            BASE.Mensagem.Mostrar("Cadastro salvo com sucesso.", TipoMensagem.Sucesso);
                        }
                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    },
                    complete: function () {
                       
                    }
                });
            }
        });

    }  

    function bindValidaTipoDeficientia(possuiDeficiencia) {
        var inputIdTipoDeficiencia = $("#frmConsumidorEscrita #IdTipoDeficiencia");

        if (possuiDeficiencia) {
            inputIdTipoDeficiencia.rules("add",
                {
                    required: true,
                    messages: {
                        required: "Campo obrigatório"
                    }
                });
        }
        else
            inputIdTipoDeficiencia.rules("remove", "required");
    }

    function bindVoltarParaConsumidorProcura() {
        $("body").on("click", "#btnVoltarParaConsumidorProcura", function () {
            window.location = "/Consumidor";
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

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    CONSUMIDOR.Init();
});

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