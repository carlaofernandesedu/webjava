var ESTATISTICA = (function () {
    var init = function () {
        bindAll();
    }

    function bindAll() {
        bindEmitirRelatorios();
        bindLimparForm();

        if ($('.breadcrumb').html().indexOf('<a href="/Estatistica"') < 0) {
            $('.breadcrumb').html($('.breadcrumb').html() + '<a href="/Estatistica" >Estatistica</a>');
        }
    }

    function bindLimparForm() {
        $('#btnLimparForm').off('click');
        $('#btnLimparForm').on('click', function () {
            $('#formRelatorios')[0].reset();
        });
    }

    function bindEmitirRelatorios() {
        $('#btnEmitirRelatorios').off('click');
        $('#btnEmitirRelatorios').on('click', function () {
            var anoAtendimento = $('#AnoAtendimento').val();
            var anoAreaTecnica = $('#AnoAreaTecnica').val();
            var anoIndicadoresDAOC = $('#AnoIndicadoresDAOC').val();
            var anoIndicadoresPosto = $('#AnoIndicadoresPosto').val();

            var mesAtendimento = $('#MesAtendimento').val();
            var tipoClassificacao = $('#IdTipoClassificacao').val();
            var tipoAtendimento = $('#IdTipoAtendimento').val();

            if (anoAtendimento === '' && anoAreaTecnica === '' && anoIndicadoresDAOC === '' && anoIndicadoresPosto === '') {
                BASE.Mensagem.Mostrar("Preencha ao menos o ano de referência de um dos relatórios", TipoMensagem.Alerta, "Alerta");
                return;
            }

            if (anoAtendimento != '') {
                if (mesAtendimento === '') {
                    mesAtendimento = "0";
                }

                if (parseInt(anoAtendimento) != NaN && parseInt(mesAtendimento) != NaN) {
                    window.open('/Estatistica/ObterAtendimentoGeral?ano=' + anoAtendimento + '&mes=' + mesAtendimento, '_blank');
                }
            }

            if (anoAreaTecnica != '') {
                if (tipoClassificacao === '') {
                    tipoClassificacao = "0";
                }

                if (parseInt(anoAreaTecnica) != NaN && parseInt(tipoClassificacao) != NaN) {
                    window.open('/Estatistica/ObterIndicadoresAreaTecnica?ano=' + anoAreaTecnica + '&classificacao=' + tipoClassificacao, '_blank');
                }
            }

            if (anoIndicadoresDAOC != '') {
                if (parseInt(anoIndicadoresDAOC) != NaN) {
                    window.open('/Estatistica/ObterIndicadoresDaoc?ano=' + anoIndicadoresDAOC, '_blank');
                }
            }

            if (anoIndicadoresPosto != '') {
                if (tipoAtendimento === '') {
                    tipoAtendimento = "0";
                }

                if (parseInt(anoIndicadoresPosto) != NaN && parseInt(tipoAtendimento) != NaN) {
                    window.open('/Estatistica/ObterIndicadoresPosto?ano=' + anoIndicadoresPosto + '&tipo=' + tipoAtendimento, '_blank');
                }
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
    ESTATISTICA.Init();
});