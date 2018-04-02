FORNECEDORANALISE = (function () {

    function init() {
        bindAll();
        FORNECEDORANALISE.PostLoad = postLoad;
    }

    function bindAll() {
        atribuirFuncionalidadeParaInteracao();
        atribuirFuncionalidadeParaRespostaFinal();
        enviarNovaInteracaoAoAtendimento();
        enviarRespostaFinalDoFornecedor();
        recusarAtendimento();

        // se vencido entra no modo visualização
        if ($('#PrazoVencido').val() === "True") {

            $(".btn-include-message").css("cursor", "not-allowed").off("click");
            $(".btn-send-response").css("cursor", "not-allowed").off("click");
            $(".btn").css("cursor", "not-allowed").click(false).addClass('desabilitado');
            $(":input").css("cursor", "not-allowed").prop("disabled", true);
        }

        $("#btnIncluirIteracao").css("pointer-events", "none");
        $("#btnIncluirResposta").css("pointer-events", "none");
    }

    function atribuirFuncionalidadeParaInteracao() {
        controlarQuantidadeMaximaDeCaracteres({
            textarea: $(".textarea-incluir"),
            botao: $("#btnIncluirIteracao")
        })
    }

    function atribuirFuncionalidadeParaRespostaFinal() {
        controlarQuantidadeMaximaDeCaracteres({
            textarea: $(".textarea-enviar"),
            botao: $("#btnIncluirResposta")
        })
    }

    function controlarQuantidadeMaximaDeCaracteres(parametros) {
        parametros.textarea.off("keyup");
        parametros.textarea.on("keyup", function () {
            atualizaQuantidadeDeCaracteresRestantes(parametros);

            configuraPonteiroDeEventosDoBotao({
                sucesso: parametros.textarea.val().length > 0,
                botao: parametros.botao
            })
        });
    }

    function atualizaQuantidadeDeCaracteresRestantes(parametros) {
        var maxlength = parametros.textarea.attr("maxlength");
        var length = parametros.textarea.val().length;

        parametros.textarea.parent().parent()
            .find("span.remaining-chars")
            .text((maxlength - length));
    }

    function configuraPonteiroDeEventosDoBotao(parametros) {
        if (parametros.sucesso) {
            parametros.botao.css("pointer-events", "auto");
        } else {
            parametros.botao.css("pointer-events", "none");
        }
    }


    function listarInteracoesDoAtendimento(idFichaAtendimento) {
        var action = "/AtendimentoFornecedor/ListarInteracoesDoAtendimento";
        var parameters = { idFichaAtendimento: idFichaAtendimento };

        $.get(action, parameters)
            .done(function (data) {
                $("#iteracao").html(data);
                FORNECEDORANALISE.PostLoad();
                configuraPonteiroDeEventosDoBotao({ sucesso: false, botao: $("#btnIncluirIteracao") });
            })
            .fail(function (XMLHttpRequest, textStatus, errorThrown) { BASE.MostrarMensagem(errorThrown, TipoMensagem.Error); });
    }

    function enviarNovaInteracaoAoAtendimento() {
        $(".btn-include-message").off("click");
        $(".btn-include-message").on("click", function (e) {
            e.preventDefault();

            if (!$(".textarea-incluir").val().trim()) {
                BASE.MostrarMensagem("Informe a Mensagem antes de enviar a interação!", TipoMensagem.Informativa);
                return false;
            }

            var action = "/AtendimentoFornecedor/EnviarNovaInteracaoAoAtendimento";
            var parameters = { idFichaAtendimento: $("#IdFichaAtendimento").val(), mensagem: $(".textarea-incluir").val() };

            $.post(action, parameters)
                .done(function (data) { listarInteracoesDoAtendimento($("#IdFichaAtendimento").val()); })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) { BASE.MostrarMensagem(errorThrown, TipoMensagem.Error); });
        });
    }

    function enviarRespostaFinalDoFornecedor() {
        $(".btn-send-response").off("click");
        $(".btn-send-response").on("click", function (e) {
            e.preventDefault();

            if (!$(".textarea-enviar").val().trim()) {
                BASE.MostrarMensagem("Informe a Resposta antes de enviar a Resposta Final!", TipoMensagem.Informativa);
                return false;
            }

            var action = "/AtendimentoFornecedor/EnviarRespostaFinalDoFornecedor";
            var parameters = { idFichaAtendimento: $("#IdFichaAtendimento").val(), mensagem: $(".textarea-enviar").val() };

            $.post(action, parameters)
                .done(function (data) {
                    BASE.Modal.ExibirModalAlerta("Atendimento Respondido!", "Resposta enviada com sucesso!<br>", "small", "OK", "btn-primary",
                        function () { window.location = "/AtendimentoFornecedor"; }
                    );
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) { BASE.MostrarMensagem(errorThrown, TipoMensagem.Error); });
        });
    }

    function recusarAtendimento() {
        console.log('entrou');
        $("#recusarAtendimento").off("click");
        $("#recusarAtendimento").on("click", function (e) {
            console.log('entrou evento');
            e.preventDefault();

            var action = "/AtendimentoFornecedor/RecusarAtendimento";
            var parameters = { idFichaAtendimento: $("#IdFichaAtendimento").val(), mensagem: $("#RespostaProcon").val() };

            $.post(action, parameters)
                .done(function (data) {
                    BASE.Modal.ExibirModalAlerta("Atendimento Recusado!", "Recusa enviada com sucesso!<br>", "small", "OK", "btn-primary",
                        function () { window.location = "/AtendimentoFornecedor"; }
                    );
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) { BASE.MostrarMensagem(errorThrown, TipoMensagem.Error); });
        });
    }


    function postLoad() {
        enviarNovaInteracaoAoAtendimento();
        atribuirFuncionalidadeParaInteracao();
        enviarRespostaFinalDoFornecedor();
        atribuirFuncionalidadeParaRespostaFinal();
        recusarAtendimento();
    }


    return {
        Init: function () {
            init();
        },
        PostLoad: function () { return false }
    };
}());

$(function () {
    FORNECEDORANALISE.Init();
});

