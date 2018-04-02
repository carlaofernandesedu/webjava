ARQUIVOARQUIVAMENTO = (function () {
    function incluirDivisao() {
    }

    function init() {
        CRUDBASE.Eventos.PosCarregarEditar = carregarVolumePorProtocoloProcesso;
        CRUDBASE.Eventos.PosCarregarDetalhe = carregarVolumePorProtocoloProcesso;

        carregaComboBoxCaixa();
        bindFiltrar();
        configurarInicializacao();
        $("#divLocalizacao").hide();
        $('.elemento-descricao').hide();
    }

    function configurarInicializacao() {
        $('#btnNovo').prop('disabled', true);
    }

    function bindMascara() {
        definirProtocoloProcesso();
        bindTipoPesquisaProcesso();
        bindBtnCancelarModal();
    }

    function bindBtnCancelarModal() {
        $('#btnCloseIncluirMovel').off('click');
        $('#btnCloseIncluirMovel').on('click', function () {
            var btn = $(this);
            bindCancelar();
        });
    }

    function bindCancelar() {
        BASE.Modal.ExibirModalConfirmacao(
            'Cancelar Operação', 'Deseja mesmo cancelar a inclusão do volume ?',
            'small',
            '<i class="fa fa-close margR5"></i>Não',
            'btn-primary',
            '<i class="fa fa-check margR5"></i>Sim',
            'btn-danger',
            function () {
                limpar();
                $('#modalDetalhe').modal('hide');
            },
            function () {
                $('#modalDetalhe').modal('show');
            });
    }

    function bindTipoPesquisaProcesso() {
        $("input[name=TipoPesquisaProcesso]").change(function () {
            $('#form-detalhe #NumeroProcessoProtocolo').val('');
            definirProtocoloProcesso();
        });
    }

    function definirProtocoloProcesso() {
        var ehProcesso = $('input[name=TipoPesquisaProcesso]:checked').val();

        if (ehProcesso === "True") {
            $('#form-detalhe #NumeroProcessoProtocolo').FormatarProtocoloProcesso({
                'mask': '000000/0000.0',
                'maxlength': 13,
                'placeholder': '______/____._'
            });
        }
        else {
            $('#form-detalhe #NumeroProcessoProtocolo').FormatarProtocoloProcesso();
        }
    }

    function limpar() {
        var form = $("#form-detalhe");
        $(':input', form).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase(); // normalize case
            if (type == 'text' || tag == 'textarea')
                this.value = "";
            else if (type == 'checkbox' || type == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = 0;
        });
    }

    function carregaComboBoxCaixa() {
        CONTROLES.DropDown.Preencher('#IdCaixaArquivo', 'ArquivoCaixa', 'ObterCaixaComboBox', null, true, null, null, function () {
            console.log($('#IdCaixaArquivo').val());
        });
    }

    function carregarVolumePorProtocoloProcesso() {
        bindMascara();
        $('#form-detalhe').off('change', '#NumeroProcessoProtocolo');
        $('#form-detalhe').on('change', '#NumeroProcessoProtocolo', function () {
            var ehProcesso = $('input[name=TipoPesquisaProcesso]:checked').val();

            if (ehProcesso == "True") {
                if ($(this).val().length == 13) {
                    pesquisarDocumento($(this).val());
                }
            }
            else {
                if (ehProcesso == "False") {
                    if ($(this).val().length == 11) {
                        pesquisarDocumento($(this).val());
                    }
                }
            }

            return false;
        });

        var codigoCaixa = $("#frmFiltroArquivarDesarquivar #IdCaixaArquivo option:selected").val();
        var descricaoCaixa = $("#frmFiltroArquivarDesarquivar #IdCaixaArquivo option:selected").text();
        var descricao = $("#frmFiltroArquivarDesarquivar #Descricao").val();

        $("#form-detalhe #IdCaixaArquivo").val($("#IdCaixaArquivo").val());
        $("#form-detalhe #CodigoCaixa").text(descricaoCaixa);
        $("#form-detalhe #DescricaoCaixa").text(descricao);

        var arquivo = $("#IdArquivamento").val();

        if (arquivo > 0) {
            $(".operacao-incluir").hide();
        }
        else {
            $(".operacao-editar").hide();
        }
    }

    function bindFiltrar() {
        $('.frm-filtro').off('change', '#IdCaixaArquivo');
        $('.frm-filtro').on('change', '#IdCaixaArquivo', function () {
            CRUDFILTRO.Filtrar();
            pesquisarLocalizacaoCaixa($(this).val());

            var combo = $('#IdCaixaArquivo').val();

            if (combo == '')
                $('.elemento-descricao').hide();
            else
                $('.elemento-descricao').show();

            return false;
        });
    }

    function pesquisarLocalizacaoCaixa(idCaixa) {
        $.ajax({
            url: '/ArquivoCaixa/ObterLocalizacaoCaixaArquivo',
            type: 'POST',
            data: { idCaixa: idCaixa },
            cache: false,
            success: function (response, status, xhr) {
                if (response == "" || response == null) {
                    $("#divLocalizacao").hide();
                    $('#btnNovo').prop('disabled', true);
                }

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    $('#IdCaixaArquivo').val(response.CaixaArquivo.Id);
                    $("#divLocalizacao").show();
                    $("#Descricao").val(response.CaixaArquivo.Descricao);


                    if (response.CaixaArquivo.NomeUA != null && response.CaixaArquivo.NomeUA != "") {
                        $("#NomeUA").text(response.CaixaArquivo.NomeUA);
                    }
                    else {
                        $("#NomeUA").text('');
                    }

                    if (response.CaixaArquivo.SerieDocumental != null && response.CaixaArquivo.SerieDocumental != "")
                        {
                        $("#SerieDocumental").text(response.CaixaArquivo.SerieDocumental);
                    }
                    else {
                        $("#SerieDocumental").text('');
                    }

                    if (response.CaixaArquivo.PeriodoDescricao != null && response.CaixaArquivo.PeriodoDescricao != ""){
                        $("#PeriodoDescricao").text(response.CaixaArquivo.PeriodoDescricao);
                    }                        
                    else {
                        $("#PeriodoDescricao").text('');
                    }


                    if (response.CaixaArquivo.IdMovelDivisao != 0) {
                        $("#LocalArquivoDescricao").text(response.LocalArquivo.Descricao);
                        $("#MovelArquivoCodigoCorredor").text(response.MovelArquivo.CodigoCorredor);
                        $("#MovelArquivoCodigo").text(response.MovelArquivo.Codigo);
                        $("#MovelArquivoDescricao").text(response.MovelArquivo.Descricao);
                        $("#MovelDivisaoCodigo").text(response.MovelDivisao.Codigo);
                        $("#MovelDivisaoDescricao").text(response.MovelDivisao.Descricao);
                    }
                    else {
                        $("#LocalArquivoDescricao").text('');
                        $("#MovelArquivoCodigoCorredor").text('');
                        $("#MovelArquivoCodigo").text('');
                        $("#MovelArquivoDescricao").text('');
                        $("#MovelDivisaoCodigo").text('');
                        $("#MovelDivisaoDescricao").text('');
                    }

                    $('#btnNovo').prop('disabled', false);
                }
            },
            error: function () {
                BASE.Debug("Erro ao pesquisar documento", DebugAction.Error);
            }
        });
    }

    function pesquisarDocumento(valor) {
        var seletor = '#form-detalhe #IdDocumentoVolume'
        var objeto = {};
        var ehProcesso = $('input[name=TipoPesquisaProcesso]:checked').val();

        if (ehProcesso == "True")
            objeto.NrProcessoFormatado = valor;
        else
            objeto.NrProtocoloFormatado = valor;

        if (objeto.NrProcessoFormatado !== "" || objeto.NrProtocoloFormatado !== "") {
            CONTROLES.DropDown.Preencher(seletor, 'DocumentoVolume', 'ObterVolumeComboBox', objeto, true, null, null, function () {
                $(seletor).focus();
            });

            $('#form-detalhe').off('change', '.controle-ddl-volume');
            $('#form-detalhe').on('change', '.controle-ddl-volume', function () {
                $('.controle-volume').val($(this).val());
            });
        } else {
            BASE.Mensagem.Mostrar("Informe o Número de Processo ou Número de Protocolo", TipoMensagem.Alerta, "Alerta");
        }
    }

    return {
        Init: function () {
            init();
        },
        IncluirDivisao: incluirDivisao
    };
}());

$(function () {
    CRUDFILTRO.Carregar();

    CRUDFILTRO.Filtrar();

    ARQUIVOARQUIVAMENTO.Init();
});