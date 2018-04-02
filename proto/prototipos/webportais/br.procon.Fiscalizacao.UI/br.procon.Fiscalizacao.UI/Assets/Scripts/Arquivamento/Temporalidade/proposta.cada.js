PROPOSTACADA = (function () {

    function init() {
        CRUDFILTRO.Evento.PosListar = posListar;
    }

    //function bindBtnClickImprimirAnexoI() {
    //    $('.acoes .btn-imprimir-anexo-I').off('click');
    //    $('.acoes .btn-imprimir-anexo-I').on('click', function () {
    //        console.log("imprimindo anexo I");
    //    });
    //}

    function bindBtnClickImprimirAnexoII() {
        $('.acoes .btn-imprimir-anexo-II').off('click');
        $('.acoes .btn-imprimir-anexo-II').on('click', function () {
            var idPropostaEliminacao = $(this).data('id'),
                tipoAnexo = $(this).data('tipo-anexo');

            console.log(idPropostaEliminacao);
            if (idPropostaEliminacao !== '' && idPropostaEliminacao !== null && idPropostaEliminacao !== undefined) {
                window.open('/PropostaEliminacao/Imprimir?id=' + idPropostaEliminacao + '&tipoAnexo=' + tipoAnexo, '_blank');
            }
        });
    }

    function bindBtnClickImprimirAnexoIII() {
        $('.acoes .btn-imprimir-anexo-III').off('click');
        $('.acoes .btn-imprimir-anexo-III').on('click', function () {
            var idPropostaEliminacao = $(this).data('id'),
                tipoAnexo = $(this).data('tipo-anexo');

            console.log(idPropostaEliminacao);
            if (idPropostaEliminacao !== '' && idPropostaEliminacao !== null && idPropostaEliminacao !== undefined) {
                window.open('/PropostaEliminacao/Imprimir?id=' + idPropostaEliminacao + '&tipoAnexo=' + tipoAnexo, '_blank');
            }
        });
    }

    function bindBtnClickDetalhar() {
        $('.acoes .btn-detalhar').off('click');
        $('.acoes .btn-detalhar').on('click', function () {
            var btn = $(this);
            detalharProposta(btn);
        });
    }

    function bindBtnClickDataFragmentacao() {
        $('.acoes .btn-data-fragmentacao').off('click');
        $('.acoes .btn-data-fragmentacao').on('click', function () {
            var btn = $(this);
            exibirModalDataFragmentacao(posCarregarModal, btn);
        });
    }

    function bindDataFragmentacao() {
        $('#dataFragmentacao').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
        $("#dataFragmentacao").datetimepicker('update', new Date());
    }

    function exibirModalDataFragmentacao(callback, btn) {
        BASE.Modal.ExibirModalPrompt("Data Fragmentação",
            TipoInput.Text,
            undefined,
            "Teste",
            TamanhoModal.Pequeno,
            null,
            '<i class="fa fa-close margR5"></i>Cancelar',
            "btn-danger",
            '<i class="fa fa-save margR5"></i>Inclui',
            "btn-primary",
            function (value) {
                exibirModalAlerta(value, btn, adicionarDataFragmentacao);
            },
            null
            );
        callback !== undefined ? callback() : null;
    }

    function exibirModalAlerta(value, btn, callback) {
        BASE.Modal.ExibirModalConfirmacao("Alerta",
            "Deseja mesmo incluir data de fragmentação",
            TamanhoModal.Pequeno,
            "Não",
            "btn-danger",
            "Sim",
            "btn-primary",
            function () {
                if (callback !== undefined)
                    callback(value, btn, salvarDataFragmentacao);
            }, null);
    }

    function posListar() {
        //bindBtnClickImprimirAnexoI();
        bindBtnClickImprimirAnexoII();
        bindBtnClickImprimirAnexoIII();
        bindBtnClickDetalhar();
        bindBtnClickDataFragmentacao();
    }

    function posCarregarModal() {
        $('.bootbox-form').find('input').attr('id', 'dataFragmentacao');
        bindDataFragmentacao();
    }

    function adicionarDataFragmentacao(value, btn, callback) {
        btn.closest('tr').find("td.data-fragmentacao span").text(value);
        btn.closest('tr').find("td.data-fragmentacao input.data-fragmentacao").val(value);
        if (callback !== undefined)
            callback(value, btn);
    }

    function salvarDataFragmentacao(value, btn) {

        var idPropostaEliminacao = btn.data('id'),
            dataFragmentacao = value;

        var viewModel = {
            Id: idPropostaEliminacao,
            DataFragmentacao: dataFragmentacao
        }

        $.ajax({
            url: '/PropostaEliminacao/AlterarPropostaCada',
            type: 'POST',
            data: { viewModel: viewModel },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    if (response.Sucesso) {
                        CRUDFILTRO.Filtrar();
                    }
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
            },
            complete: function () {
            }
        });
    }

    function detalharProposta(btn) {

        var idPropostaEliminacao = btn.data('id');

        $.ajax({
            url: '/PropostaEliminacao/DetalharItemPropostaCada',
            type: 'GET',
            data: { idPropostaEliminacao: idPropostaEliminacao },
            success: function (response, status, xhr) {

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson)
                    renderHtml(response)
                else
                    console.log('retornou json no método detalhar proposta.')
            },
            error: function (jqXhr, textStatus, errorThrown) {
            }
        });
    }

    function renderHtml(view) {
        $("#conteudo_principal").html(view)
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PROPOSTACADA.Init();
    CRUDFILTRO.Evento.PosListar();
});