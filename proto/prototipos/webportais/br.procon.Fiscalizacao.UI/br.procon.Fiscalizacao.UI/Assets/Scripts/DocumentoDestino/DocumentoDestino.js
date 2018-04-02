DocumentoDestino = (function () {
    function bindAll() {
        bindReady();
        bindMascara();
        bindCarregarDadosUaDestino();
        bindRegistrarEncaminhamento();
        bindGerarRemessa();
    }

    function bindReady() {
        $('#grupo_lista_relacionar_filter, #grupo_lista_relacionar_length, #grupo_lista_relacionar_info, #grupo_lista_relacionar_paginate').toggle(false);

        populaComboUnidadeAdm();
        bindDataTable();
    }

    function bindCarregarDadosUaDestino() {
        $('#formRegistrarEncaminhamentoDocumento').off('change', "#comboUnidadeAdm");
        $('#formRegistrarEncaminhamentoDocumento').on('change', '#comboUnidadeAdm', function () {
            carregarDados($(this).val());
        });
    }

    function bindRegistrarEncaminhamento() {
        $('#formRegistrarEncaminhamentoDocumento').off('click', "#btnAdicionaRemessa");
        $('#formRegistrarEncaminhamentoDocumento').on('click', '#btnAdicionaRemessa', function () {
            var object = {
                NumeroProtocoloRemessa: $("#NrProtocoloFormatado").val(),
                NumeroProcessoRemessa: $("#NrProcessoFormatado").val(),
                UnidadeDestino: $("#comboUnidadeAdm").val()
            }

            salvarDocumentoDestino(object);
        });

        $('#formRegistrarEncaminhamentoDocumento input').keypress(function (e) {
            if (e.keyCode === 13) {
                return false;
            }
        });
    }

    function bindExcluirEncaminhamnto(element) {
        excluirDocumentoDestino(element);
    }

    function bindDataTable() {
        $('#grupo_lista_relacionar').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [{ "bSortable": false, "aTargets": [] }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],
            "bDestroy": true,
            /*Resposividade da tabela*/
            responsive: true
        });
    }

    function bindGerarRemessa() {
        $('#geraRemessa').off('click');
        $('#geraRemessa').on('click', function () {
            var idUa = $("#comboUnidadeAdm").val();
            gerarRemessa(idUa);
        });
    }

    function populaComboUnidadeAdm() {
        $.ajax({
            url: '/DocumentoDestino/PopulaComboUnidadeAdm',
            type: 'GET',
            cache: false,
            success: function (data) {
                $("#comboUnidadeAdm").empty();
                $("#comboUnidadeAdm").append($("<option value='0'>Todos</option>"));

                $.each(data, function (index, value) {
                    $("#comboUnidadeAdm").append($("<option value='" + value.Codigo + "'>" + value.Nome + "</option>"));
                });

                $("#geraRemessa").css("display", "none");
                $("#btnAdicionaRemessa").css("display", "none");
            }
        });
    };

    function gerarRemessa(idUaDestino) {
        if (idUaDestino !== null && idUaDestino !== undefined && idUaDestino !== "") {
            $.ajax({
                url: '/DocumentoDestino/GerarRemessa',
                type: 'GET',
                cache: false,
                data: { idUaDestino: idUaDestino },
                success: function (data) {
                    if (data != "Error") {
                        $("#comboUnidadeAdm").val("0").trigger("change");
                        window.open('/DocumentoDestino/EmitirRelacaoRemessa?idRemessa=' + data.CodigoRemessa);
                        BASE.Mensagem.Mostrar("Remessa gerada e emitida com sucesso!", TipoMensagem.Sucesso);
                    }
                    else
                        window.location = '/DocumentoDestino/Index';
                }
            });
        }
    }

    function excluirDocumentoDestino(element) {
        var id = $(element).data("id");
        var idUaDestino = $("#comboUnidadeAdm").val();
        console.log(id);

        $.ajax({
            url: '/DocumentoDestino/DeletarDocumentoDestino',
            type: 'GET',
            cache: false,
            data: { idDocumentoDestino: id },
            success: function (data) {
                if (data.Sucesso === true) {
                    BASE.Mensagem.Mostrar(data.Msg, TipoMensagem.Sucesso);
                    carregarDados(idUaDestino);
                }
                else {
                    BASE.Mensagem.Mostrar(data.Msg, TipoMensagem.Error);
                }
            }
        });
    }

    function carregarDados(id) {
        var form = $('#formRegistrarEncaminhamentoDocumento');

        if (id !== null && id !== undefined && id !== "0") {
            $("#geraRemessa").css("display", "inline-block");
            $("#btnAdicionaRemessa").css("display", "inline-block");
        }
        else {
            $("#geraRemessa").css("display", "none");
            $("#btnAdicionaRemessa").css("display", "none");
        }

        $.ajax({
            type: 'GET',
            url: '/DocumentoDestino/CarregaDocumentoDestino',
            data: { idUaDestino: id },
            cache: false,
            success: function (data) {
                $('#divListaDocumentoDestino').html(data);
                bindDataTable();
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
                return false;
            }
        });
    }

    function salvarDocumentoDestino(documentoDestino) {
        if (documentoDestino.NumeroProtocoloRemessa == "" && documentoDestino.NumeroProcessoRemessa == "") {
            BASE.Mensagem.Mostrar('Nenhum Nº de Processo ou Protocolo Informado!', TipoMensagem.Error);
        }
        else if (documentoDestino.NumeroProtocoloRemessa != "" && documentoDestino.NumeroProcessoRemessa != "") {
            BASE.Mensagem.Mostrar('Informe somente o Nº do Protocolo ou Nº do Processo!', TipoMensagem.Error);
        }
        else if (documentoDestino.UnidadeDestino == 0) {
            BASE.Mensagem.Mostrar('Nenhuma Unidade de Destino Informada!', TipoMensagem.Error);
        }
        else {
            $.ajax({
                type: 'POST',
                url: '/DocumentoDestino/RegistrarEncaminhamento',
                data: { documentoDestino: documentoDestino },
                success: function (data) {
                    if (data.Sucesso === true) {
                        BASE.Mensagem.Mostrar(data.Msg, TipoMensagem.Sucesso);
                        limparDados();
                        carregarDados(data.idUaDestino);
                    }
                    else {
                        limparDados();
                        BASE.Mensagem.Mostrar(data.Msg, TipoMensagem.Alerta);
                    }
                },
                error: function (e) {
                    BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
                    return false;
                }
            });
        }
    }

    function bindMascara() {
        $('#NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $("#NrProcessoFormatado").mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $('#NrProtocoloFormatado').change(function () {
            $('#NrProtocoloFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($('#NrProtocoloFormatado').val(), 11, 0));
            if ($('#NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#NrProtocoloFormatado').val('');
            }
        });

        $('#NrProcessoFormatado').change(function () {
            $('#NrProcessoFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($('#NrProcessoFormatado').val(), 13, 0));
            if ($('#NrProcessoFormatado').val().indexOf('000000') >= 0) {
                $('#NrProcessoFormatado').val('');
            }
        });
    }

    function limparDados() {
        $("#NrProtocoloFormatado").val("");
        $("#NrProcessoFormatado").val("");
    }

    function init() {
        bindAll();
    }

    return {
        Init: init,
        ExcluirDocumentoDestino: bindExcluirEncaminhamnto
    }
})();

$(function () {
    DocumentoDestino.Init();
});