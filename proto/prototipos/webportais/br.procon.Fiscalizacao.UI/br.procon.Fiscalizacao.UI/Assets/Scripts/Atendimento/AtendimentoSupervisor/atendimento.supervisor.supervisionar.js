var SUPERVISOR_SUPERVISIONAR = (function () {
    var init = function () {
        var tipoAtendimento = $('#idTipoAtendimento').val();

        if (tipoAtendimento == undefined) {
            tipoAtendimento = $('#TipoAtendimento').val();
        }

        if (tipoAtendimento == "1") {
            PESQUISAR_MENSAGENS.Init(
                "Pesquisar em Resposta Padrão",
                "#modal-resposta-padrao",
                "#Resposta",
                "button#incluir-resposta-padrao",
                ""
             );
        }
        else {
            PESQUISAR_MENSAGENS.Init(
                "Pesquisar em Texto Padrão",
                "#modal-resposta-padrao",
                "#Resposta",
                "button#incluir-resposta-padrao",
                ""
             );
        }

        bindEnviarConsumidor();

        ATENDIMENTOBASE.Redirect.Definir("/AtendimentoSupervisor/ListarParaSupervisionar");
    };

    var bindEnviarConsumidor = function () {
        $("#enviarConsumidor").off('click');
        $("#enviarConsumidor").on('click', function () {
            if (!$('#RespostaProcon').val().trim()) {
                BASE.MostrarMensagem("Informe o campo resposta antes de enviar a solicitação!", TipoMensagem.Error);
                return false;
            }

            $.ajax({
                url: '/AtendimentoTecnico/EnviarConsumidor/',
                data: { idFicha: $('#IdFichaAtendimento').val(), descricao: $('#RespostaProcon').val() },
                type: 'Post',
                dataType: "json",
                success: function (data) {
                    if (data) {
                        BASE.Modal.ExibirModalAlerta("Envio Consumidor!",
							"Atendimento enviado ao consumidor com sucesso!<br>" +
							"Estaremos redirecionando para fila de atendimento.",
							"small", "OK",
							'btn-primary',
							function () {
							    window.location = ATENDIMENTOBASE.Redirect.Obter();
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
    };

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    SUPERVISOR_SUPERVISIONAR.Init();
});