var ITERACAO = (function () {

    function init() {
        bindAll();
    };

    function bindAll() {
        bindInteracaoEnviar();
        CONTROLES.Configurar.ContadorCaracter($("#iteracao textarea#inputMsg"), function (tamanho) {
            if (tamanho > 0) {
                $("#iteracao #btnEnviar").css("pointer-events", "auto");
            } else {
                $("#iteracao #btnEnviar").css("pointer-events", "none");
            }
        });
    };

    function bindInteracaoEnviar() {
        $('#iteracao #btnEnviar').off('click');
        $('#iteracao #btnEnviar').on('click', function () {

            if (!$('#inputMsg').val().trim()) {
                BASE.MostrarMensagem("Informe a Mensagem antes de enviar a interação!", TipoMensagem.Error);
                return false;
            }
            $.ajax({
                url: '/AtendimentoTecnico/SalvarIteracao/',
                type: 'post',
                cache: false,
                data: { idFichaAtendimento: $("#IdFichaAtendimento").val(), mensagem: $('#inputMsg').val(), publico: true },
                success: function (response, status, xhr) {                   

                    if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                        monstrarMensagensAlerta(response);
                    }
                    else {
                        buscarInteracoes($('#IdFichaAtendimento').val());
                        $("#encerrarConsulta").removeAttr("disabled");
                        $('#inputMsg').val('');
                        console.log('salvou com sucesso a interação do consumidor');
                    }
                },
                error: function (xhr) {
                    console.log('erro ao salvar a interação do consumidor');
                }
            });
        });

        $('#btn-enviar-msg-privada').off('click');
        $('#btn-enviar-msg-privada').on('click', function () {

            bootbox.setLocale("pt");
            bootbox.prompt({
                locale: "pt",
                title: "Informe a mensagem a ser enviada como <strong>Privada</strong>:",
                inputType: 'textarea',
                callback: function (result) {
                    if (result != "") {
                        $.ajax({
                            url: '/AtendimentoTecnico/SalvarIteracao/',
                            type: 'post',
                            cache: false,
                            data: { idFichaAtendimento: $("#IdFichaAtendimento").val(), mensagem: result, publico: false },
                            success: function (data) {
                                buscarInteracoes($('#IdFichaAtendimento').val());
                                $("#encerrarConsulta").removeAttr("disabled");
                                console.log('salvou com sucesso a interação do consumidor');
                            },
                            error: function (xhr) {
                                console.log('erro ao salvar a interação do consumidor');
                            }
                        });
                    } else {
                        BASE.Mensagem.Mostrar("A mensagem deve ser preenchida");
                    }
                }
            });
        });
    };


    function monstrarMensagensAlerta(response) {
        $.each(response.MensagensCriticas, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }

    function buscarInteracoes(idFicha) {
        $.ajax({
            url: "/AtendimentoTecnico/Interacao/",
            type: "post",
            cache: false,
            data: { id: idFicha },
            success: function (data) {
                $("#iteracao").html(data);
                bindAll();
                $("#iteracao #btnEnviar").css("pointer-events", "none");
            },
            error: function (data) {
                console.log("erro");
            }
        });
    };

    return {
        Init: init,
        Eventos: {
            PosCarregar: function () { return false; }
        }
    };

}());

$(function () {
    ITERACAO.Init();
});
