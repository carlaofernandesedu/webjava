var SolicitacaoAlteracaoFornecedor = (function () {

    function init() {
        bindAll();

        compararInformacoesFornecedor();
    }

    function bindAll() {
        bindAceitarSolicitacao();
        bindContadorCaracteres();
        bindRecusarSolicitacao();
        bindVoltar();
    }

    function bindAceitarSolicitacao() {
        $('#form-detalhe .acoesform').on('click', '#aceitarSolicitacao', function () {
            var
                btn = $(this);
            var url = btn.data('url');
            var codigo = btn.data('codigo');

            aceitarSolicitacaoalteracao(url, codigo);
            return false;
        });
    }

    function bindContadorCaracteres() {
        $('#CampoTexto').keyup(function () {
            var charsno = $(this).val().length;
            $('#ValorCampo').html("500 : " + charsno);
        });
    }

    function bindRecusarSolicitacao() {
        $('#form-negar .modal-footer').on('click', '#negarAlteracao', function () {
            var
                btn = $(this);
            var url = btn.data('url');
            var codigo = $('#codigoSolicitacaoFornecedor').val();
            var justificativa = $('#CampoTexto').val();

            if (justificativa == "" || justificativa == undefined) {
                BASE.Mensagem.Mostrar("O campo Justificativa é de preenchimento obrigatório.", TipoMensagem.Error);
                return false;
            }
            alterarStatus(url, codigo, justificativa);
            return false;
        });
    }

    function bindVoltar() {
        $('#form-detalhe .acoesform').on('click', '#voltarSolicitacao', function () {
            CRUDFILTRO.Filtrar();
            return false;
        });

    }

    function compararInformacoesFornecedor() {
        var formSpan = $("#form-detalhe p");
        $.each(formSpan, function (index, element) {
            var obj = $(element);

            var valorAtual = obj.data("atual") != undefined ? obj.data("atual").toString() : "sem valor";
            var valorAlterado = obj.text();

            if (valorAtual !== valorAlterado) {
                obj.attr("data-toggle", "tooltip");
                obj.attr("data-placement", "bottom");
                obj.attr('data-original-title', valorAtual === "" ? "sem valor" : valorAtual);
                obj.addClass("alert alert-danger");
                $('[data-toggle="tooltip"]').tooltip();
            }
            else {
                obj.removeAttr("data-toggle", "tooltip");
                obj.removeAttr("data-placement", "right");
                obj.removeClass("label label-danger");
            }
        });
    }

    function posRecusarSolicitacao() {
        $('#CampoTexto').val("");
        $("#form-negar #negar").modal('hide');;
    }

    function alterarStatus(url, codigo, justificativa) {
        $.ajax({
            url: url,
            data: { id: codigo, justificativa: justificativa },
            type: 'GET',
            success: function (result) {
                if (result.Sucesso === true) {
                    BASE.Mensagem.Mostrar("Solicitação de alteração rejeitada", TipoMensagem.Sucesso);
                    posRecusarSolicitacao();
                    CRUDBASE.Eventos.Cancelar = window.location = "/ValidarSolicitacaoAlteracaoFornecedor/Index";
                }
            },
            error: function () {

            }
        });
    }

    function aceitarSolicitacaoalteracao(url, codigo) {
        $.ajax({
            url: url,
            data: { codigo: codigo },
            type: 'GET',
            success: function (result) {
                if (result.Sucesso == true) {
                    BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Sucesso);
                    CRUDBASE.Eventos.Cancelar = window.location = "/ValidarSolicitacaoAlteracaoFornecedor/Index";
                }
                else {
                    BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                }
            },
            error: function (erro) {
                BASE.Mensagem.Mostrar(erro.Mensagem, TipoMensagem.Error);
            }
        });
    }

    function addRequired() {
        $('#form-negar .modal-body #CampoTexto').rules('add', {
            required: true,
            messages: {
                required: "Campo Justficativa é obrigatorio!"
            }
        });
    }

    return {
        Init: function () {
            init();
        }
    };

}());

$(function () {
    SolicitacaoAlteracaoFornecedor.Init();
    CRUDFILTRO.Filtrar();
});
