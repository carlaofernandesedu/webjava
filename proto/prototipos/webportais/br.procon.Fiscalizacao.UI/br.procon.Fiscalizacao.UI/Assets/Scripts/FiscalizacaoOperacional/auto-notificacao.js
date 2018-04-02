AUTONOTIFICACAO = (function () {

    var tbItensNotificacao = "tbItensNotificacao_907SDFGDF2345AS"
    arrayCidade = undefined;

    function init() {
        $('#divLocalFiscalizadoRaf').hide();

        bindAll();
    }

    function bindAll() {
        //bindCheckBox();
        binHideItens();
        bindEditarItemApreendidoNotif();
        bindModalIncluirItemCancelar();
        bindModalIncluirItemConfirmar();
        bindModalIncluirItemEditar();
        formatarMascara();
        formatarMascaras($('.tipo-documento-responsavel:checked').val());
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $('#DataCumprimentoNotificacao').datetimepicker({
            format: "dd/mm/yyyy hh:ii",
            minView: 2,
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $('.blocosItem input:radio').change(function () {
            var naocheck = $('.blocosItem').find('input').not(':checked');
            $(this).parent().addClass('btn-primary');
            $(naocheck).parent().removeClass('btn-primary');
        });

        $('.tipo-documento-responsavel').change(function () {
            formatarMascaras($(this).val());
        });

        $('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="checkbox"], select').on('change', function () {
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #tipoAutuacao');
        });

        MENUAUTO.BindControlesTela();

        carregarComboLocal();

        bindComboCidadeLocalCumprimento();

        verificarDataCumprimento();
    }

    function carregarComboLocal() {
        CONTROLES.DropDown.Preencher('#EnderecoLocalCumprimento', 'AutoFiscalizacao', 'SelectList', null, true, null, null, function () {
            var listaOptions = $('#EnderecoLocalCumprimento option');

            arrayCidade = [];

            $.each(listaOptions, function (index, op) {

                var objOption = {};

                objOption.Index = index;
                objOption.Regional = op.text;
                objOption.Endereco = op.value.split('|')[0];
                objOption.Cidade = op.value.split('|')[1];

                $(this).val(objOption.Endereco);

                arrayCidade.push(objOption);
            });
        });
    }

    function bindComboCidadeLocalCumprimento() {
        $('#EnderecoLocalCumprimento').off('change');
        $('#EnderecoLocalCumprimento').on('change', function () {       

            var diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

            var tipoAuto = $('.btn-primary').find('input[name=TipoAuto]').val();

            if (tipoAuto = "1" && diligencia.CepEndereco == null) {

                var regional = $(this).find('option:selected').text().trim();

                var obj = arrayCidade.filter(function (end) { return end.Regional == regional })[0];

                if (obj != null && obj.Cidade != undefined && obj.Cidade != null) {
                    diligencia.CidadeLocalCumprimento = obj.Cidade;
                    DILIGENCIA.AtualizarDiligencia(diligencia);

                }
                else {
                    diligencia.CidadeLocalCumprimento = null;
                    DILIGENCIA.AtualizarDiligencia(diligencia);
                }
            }
        });

    }

    function verificarDataCumprimento() {
        $('#DataCumprimentoNotificacao').change(function () {
            var dataDigitada = new Date();
            var dataHoraLocal = dataDigitada;
            moment.locale('pt-br');

            if (moment($('#DataCumprimentoNotificacao').val(), "DD/MM/YYYY HH:mm")._isValid) {
                dataDigitada = moment($('#DataCumprimentoNotificacao').val(), "DD/MM/YYYY HH:mm").toDate();
                if (dataDigitada.toString() === 'Invalid Date' || dataDigitada < dataHoraLocal) {
                    $('#DataCumprimentoNotificacao').val(dataHoraLocal.toLocaleString('pt-BR').substring(0, 25));
                } else {
                    $('#DataCumprimentoNotificacao').val(dataDigitada.toLocaleString('pt-BR').substring(0, 25));
                }
            } else {
                $('#DataCumprimentoNotificacao').val(dataHoraLocal.toLocaleString('pt-BR').substring(0, 25));
            }
        });
    }

    function formatarMascara() {
        formatarMascaras($('.tipo-documento-responsavel:checked').val());
        $('.tipo-documento-responsavel').change(function () {
            formatarMascaras($(this).val());
        });
        $('#DataCumprimentoNotificacao').mask('00/00/0000 00:00');
    }

    function formatarMascaras(object) {
        $('#NumeroDocumentoResponsavelFornecedor').removeAttr('placeholder');
        $("#NumeroDocumentoResponsavelFornecedor").attr('maxlength', '14');

        if (object === "CPF") {
            $("#NumeroDocumentoResponsavelFornecedor").mask('000.000.000-00', { placeholder: '___.___.___-__' });
        }
        else {

            $("#NumeroDocumentoResponsavelFornecedor").unmask();

        }
    }

    function loadTbAuto() {
        var tbAuto = [];
        return tbAuto;
    }

    function loadObjetoCompleto() {
        var tbObjeto = [];
        return tbObjeto;
    }

    /*-------------------- ITENS DE APREENSÃO (AUTO NOTIFICAÇÃO) ---------------------*/
    function binHideItens() {
        $('#incluiApreensaoNotif').prop('checked', false);
        $('#itensApreensaoNotif').hide();
        //$('#itensApreensaoNotif table').hide();
    }
    /*--- INCLUI / EDITA ITEM APREENSÃO ---*/
    function bindIncluirItemApreensaoNotif() {
        var incluirItemApreensaoNotif = function () {
            $('#modalIncluirItemApreendidoNotif').modal();
            $('#modalIncluirItemApreendidoNotif textarea').val('');
        };
    }
    function bindEditarItemApreendidoNotif() {
        var editarItemApreendidoNotif = function () {
            $('#modalEditarItemApreendidoNotif').modal();
        };
    }

    function bindModalIncluirItemCancelar() {
        $('#modalIncluirItemApreendidoNotif .btn-danger').click(function () {
            if ($('#modalIncluirItemApreendidoNotif input').val() == '') {
                $('#incluiApreensaoNotif').prop('checked', false);
            }
        });
    }

    function bindModalIncluirItemConfirmar() {
        $('#modalIncluirItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
        });
    }

    function bindModalIncluirItemEditar() {
        $('#modalEditarItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
        });
    }

    return {
        Init: function () {
            init();
        },
        TblLocalStorageItensNotificacao: tbItensNotificacao,
    };

}());
