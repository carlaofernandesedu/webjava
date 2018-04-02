DETALHEAUTO = (function () {

    var hierarquiaSeletores = '#FormArquCan',
        idFiscalResponavel = null;

    function init() {
        bindAll();
    };

    function bindAll() {
        bindArquivarAuto();
        bindCancellarAuto();
        bindConfirmar();
        bindImprimirPDF();
        bindbtnRecusarAssinatura();
        marcaDaguaCancelado();
        retornarFiscalResponsavel();
        $('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="checkbox"], select').on('change', function () {
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #tipoAutuacao');
        });
    }

    function bindArquivarAuto() {
        $("#btnArquivar").off('click');
        $("#btnArquivar").on('click', function () {
            abrirModal("#modalArquivarCancelar", "Arquivamento do Auto", "Motivo do Arquivamento", "Arquivar");
            var idMotivoAuto = $(this).data("idmotivo");
            limparCampoNumSerie();
            carregarComboMotivo(idMotivoAuto);
        });
    }

    function bindCancellarAuto() {
        $("#btnCancelar").off('click');
        $("#btnCancelar").on('click', function () {

            var referenciaApreencao = $('#ReferenciaApreencao').val();

            if (referenciaApreencao != '') {
                BASE.Modal.ExibirModalConfirmacao(
                    'Cancelar Operação',
                    'O cancelamento deste Auto irá cancelar também o Auto de Apreensão associado <br>(' + referenciaApreencao + '). Deseja continuar o cancelamento ?',
                    'small',
                    'Sim',
                    'btn-primary',
                    'Não',
                    'btn-danger', null, function () {
                        abrirModal("#modalArquivarCancelar", "Cancelamento do Auto", "Motivo do Cancelamento", "Cancelar");
                    });
            }
            else {
                abrirModal("#modalArquivarCancelar", "Cancelamento do Auto", "Motivo do Cancelamento", "Cancelar");


            }

            var idMotivoAuto = $(this).data("idmotivo");

            $('#divDescricaoMotivo').show();

            limparCampoNumSerie();
            $('#modalArquivarCancelar #NumeroAutoSubstituto').mask('00000');
            carregarComboMotivo(idMotivoAuto);
        });
    }

    function bindbtnRecusarAssinatura() {
        $("#btnRecusarAssinatura").off('click');
        $("#btnRecusarAssinatura").on('click', function () {
            var
                _idAuto = $(this).data('idauto'),
                _idFiscalAuto = $(this).data('idfiscal');

            abrirModal("#recusaAssinatura", null, null, null);
            bindConfirmarRecusaModal(_idAuto, _idFiscalAuto);
            return false
        });
    }

    function bindConfirmarRecusaModal(_idAuto, _idFiscalAuto) {
        $('#btnConfirmRecusa').off('click');
        $('#btnConfirmRecusa').on('click', function () {
            salvarRecusaAssinatura(_idAuto, _idFiscalAuto);
        });
    }

    function bindConfirmar() {
        $("#btnConfirma").off('click');
        $("#btnConfirma").on('click', function () {            

            var _form = $(this).parents('form:first'),
                _situacao = $(this).data('situacao'),
                _idFiscalResponsavel = retornarFiscalResponsavel();

            var motivo = $('#DescricaoMotivo').val();
            var numAuto = $('#NumeroAutoSubstituto').val();          

            if ($('#IdMotivo').val() == '') {
                BASE.MostrarMensagem('Selecione um motivo', TipoMensagem.Alerta);
                $('#IdMotivo').focus();
                return false;
            }

            if (numAuto == '' && motivo == '' && _situacao == "Cancelado") {
                BASE.MostrarMensagem('O campo Descrição é obrigatório', TipoMensagem.Alerta);
                $('#DescricaoMotivo').focus();
                return false;
            }

            salvar(_form, _situacao, _idFiscalResponsavel, motivo);
        });
    }

    function bindImprimirPDF() {
        $('#btnImprimir').off('click');
        $('#btnImprimir').on('click', function () {
            var _idAuto = $(this).data('idauto');
            imprimirPDF(_idAuto);

        });
    }

    function retornarFiscalResponsavel() {

        var _ficalResponsavel = $("#IdFiscalResponsavel").val();

        return idFiscalResponavel = _ficalResponsavel;
    }

    function salvar(_form, situacao, idFiscalResponsavel, motivo) {

        var obj = _form.serializeObject();
        obj.Situacao = situacao,
        obj.IdFiscalResponsavel = idFiscalResponsavel;
        obj.DescricaoMotivo = motivo;

        $.ajax({
            url: "/SituacaoAuto/SalvarSituacaoAuto",
            type: "POST",
            data: { model: obj },
            cache: false,
            success: function (result) {
                if (result.Sucesso === true) {
                    BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Sucesso);

                    setTimeout(function () {
                        window.location = '/AutoFiscalizacao/FiltroPesquisa';
                    }, 3000);
                }
                else {
                    if (result.Mensagem.indexOf('não localizado') > -1) {
                        BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Alerta);
                    }
                    else {
                        BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                    }
                }

            },
            error: function (result) {
                BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
            }
        });
    }


    function imprimirPDF(_idAuto) {
        //window.open('/AutoFiscalizacao/Imprimir?idAuto=' + _idAuto, '_blank');
        $.ajax({
            url: '/AutoFiscalizacao/Imprimir',
            type: 'GET',
            data: { idAuto: _idAuto },
            success: function (data) {
                if (data) {
                    window.open('/AutoFiscalizacao/Imprimir?idAuto=' + _idAuto, '_blank');
                } else {
                    BASE.Mensagem.Mostrar("Erro ao gerar PDF. Contate o administrador!", TipoMensagem.Error);
                }
            },
            error: function (data) {
                BASE.Mensagem.Mostrar("Erro ao gerar PDF. Contate o administrador!", TipoMensagem.Error);
            }
        });
    }

    function salvarRecusaAssinatura(_idAuto, _idFiscalAuto) {
        $.ajax({
            url: "/AutoFiscalizacao/RecusarAssinatura",
            type: "GET",
            data: { idAuto: _idAuto, fiscalAutoCodPessoa: _idFiscalAuto },
            success: function (data) {
                if (data.Sucesso === true) {

                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Sucesso);

                    setTimeout(function () {
                        window.location = '/AutoFiscalizacao/FiltroPesquisa';
                    }, 3000);
                }
                else {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);
                }
            },
            error: function (data) {
                BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);
            }
        });
    }

    function limparCampoNumSerie() {
        $("#NumeroAutoSubstituto").val("");
        $("#IdSerie").val("");
    }

    function marcaDaguaCancelado() {
        var _situacao = $(".marca-cancelado").data('situacao');

        if (_situacao == "Cancelado") {
            $(".marca-cancelado").css({
                'background': 'url(../Assets/Img/marca-dagua-auto-cancelado.jpg) no-repeat 50%',
                'background-size': 'contain',
                'height': '100%',
                'width': '100%',
                'display': 'block',
                'position': 'absolute',
                'opacity': '0.4'
            })
        }
    }

    function abrirModal(id, tituloModal, tituloMotivo, tipo) {
        $(id).modal("show");
        $("#TituloModalArqCan").text(tituloModal);
        $("#TituloMotivo").text(tituloMotivo);


        if (tipo === "Cancelar") {
            $("#NumeroSerie").attr('style', 'display:block');
            $("#btnConfirma").data("situacao", "Cancelado");

        } else if (tipo === "Arquivar") {
            $("#NumeroSerie").attr('style', 'display:none');
            $("#btnConfirma").data("situacao", "Arquivado");
        }
    }

    function carregarComboMotivo(idMotivoAuto) {
        CONTROLES.DropDown.PreencherPorId(hierarquiaSeletores + ' #IdMotivo', 'AutoFiscalizacao', 'ListarMotivoPorSituacaoAuto', idMotivoAuto, "Selecione", null);
    }

    // SERIALIZA E CRIA UM OBJETO A PARTIR DO FORM
    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    return {
        Init: init
    };

}());

$(function () {
    DETALHEAUTO.Init();
});