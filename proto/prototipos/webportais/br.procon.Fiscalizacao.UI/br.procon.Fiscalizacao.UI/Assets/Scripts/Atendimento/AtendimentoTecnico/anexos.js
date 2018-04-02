ANEXOS = (function () {

    function init() {
        bindAll();        
    }

    function bindAll() {
        anexar();
        preview();
        preVisualizacao();
        salvarReclamacaoAnexos();
        salvarAssociacaoDeProtocolo();
        bindLimpar();
        bindIdAnexo();

        //habilitarBotoaProtocoloKeyUp();

        //$('#NrProtocoloReferenciado').mask('999999/9999', { reverse: true });
    }

    function anexar() {
        $(document).off('click', '#close-preview');
        $(document).on('click', '#close-preview', function () {
            $('.image-preview').popover('hide');
            // Hover befor close the preview
            $('.image-preview').hover(
                function () {
                    $('.image-preview').popover('show');
                },
                 function () {
                     $('.image-preview').popover('hide');
                 }
            );
        });
    }

    function preview() {
        // Cria um botao fechar(X)
        var closebtn = $('<button/>', {
            type: "button",
            text: 'x',
            id: 'close-preview',
            style: 'font-size: initial;'
        });
        closebtn.attr("class", "close pull-right");
        // Setar o popover(bootstrap) padrao
        $('.image-preview').popover({
            trigger: 'manual',
            html: true,
            title: "<strong>Pré-Visualização</strong>" + $(closebtn)[0].outerHTML,
            content: "Não há imagem",
            placement: 'bottom'
        });
    }

    function bindLimpar() {
        // Limpar evento
        $('.image-preview-clear').off('click');
        $('.image-preview-clear').on('click', function () {
            limparUpload();
        });
    }

    function limparUpload() {
        $('#anexarArquivo').hide();
        $('.image-preview').attr("data-content", "").popover('hide');
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
        $(".image-preview-input-title").text("Procurar");
        $('#NomeArquivo').val('');
    }

    function preVisualizacao() {
        // Cria o preview
        $(".image-preview-input input:file").off('change');
        $(".image-preview-input input:file").on('change', function () {

            var arquivo = $("#uploadImage").get(0).files;
            if (!validarExtensoes(arquivo)) {
                BASE.MostrarMensagem("Erro ao anexar arquivo, extensão não permitida.", TipoMensagem.Error);
                $('#uploadImage').val('');
                return false;
            }
            if (!validarTamanho(arquivo)) {
                BASE.MostrarMensagem("Erro ao anexar arquivo, arquivo é maior que o permitido 2MB.", TipoMensagem.Error);
                $('#uploadImage').val('');
                return false;
            }

            $('#anexarArquivo').show();

            var img = $('<img/>', {
                id: 'dynamic',
                width: 250,
                height: 200
            });

            var file = this.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $(".image-preview-input-title").text(" Alterar");
                $(".image-preview-clear").show();
                $(".image-preview-filename").val(file.name);
                img.attr('src', e.target.result);

                if (file.name.indexOf('.pdf') === -1) {
                    $(".image-preview").attr("data-content", $(img)[0].outerHTML).popover("show");
                }

            }

            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = "";
            }
        });
    }

    function salvarReclamacaoAnexos() {
        $("#anexarArquivo").off('click');
        $("#anexarArquivo").on('click', function () {

            var file = $("#uploadImage").get(0).files;
            if (!validarExtensoes(file)) {
                BASE.MostrarMensagem("Erro ao anexar arquivo, extensão não permitida.", TipoMensagem.Error);
                return false;
            }
            if (!validarTamanho(file)) {
                BASE.MostrarMensagem("Erro ao anexar arquivo, arquivo é maior que o permitido 2MB.", TipoMensagem.Error);
                return false;
            }
            //if ($('#NomeArquivo').val() === "" || $('#NomeArquivo').val() === null || $('#NomeArquivo').val() === undefined) {
            //    BASE.MostrarMensagem("Erro ao anexar arquivo, Informe o nome do Arquivo.", TipoMensagem.Error);
            //    return false;
            //}

            if (file.length > 0) {
                var data = new FormData();
                if (file.length > 0) {
                    data.append("HelpSectionImages", file[0]);
                    data.append("IdAquisicao", $('#IdAquisicao').val());
                    data.append("NomeArquivo", $('#NomeArquivo').val());
                }
                $.ajax({
                    url: "/AtendimentoTecnico/SalvarArquivo/",
                    type: "post",
                    processData: false,
                    contentType: false,
                    data: data,
                    beforeSend: function () {
                        $("#anexarArquivo").prop('disabled', true);                        
                    },
                    success: function (data) {
                        if (data.Valido !== undefined && data.Valido === false) {
                            BASE.MostrarMensagem(data.Mensagem, TipoMensagem.Error);
                            return;
                        }
                        obterAnexosPorIdReclamacao(data);
                        $("#anexarArquivo").prop('disabled', false);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem("Erro ao enviar solicitacao.", TipoMensagem.Error);
                        console.log(XMLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                    complete: function () {
                       // $("#anexarArquivo").prop('disabled', false);
                    }
                });
            } else {
                BASE.MostrarMensagem("Favor anexar um arquivo.", TipoMensagem.Error);
            }
        });
    }

    function salvarAssociacaoDeProtocolo() {
        $("#associarAtendimento").off('click');
        $("#associarAtendimento").on('click', function () {

            $("#associarAtendimento").prop('disabled', true);
            //$("#associarAtendimento").click(function () { return false; });

            var numeroProtocolo = $("#NrProtocoloReferenciado");
            if (numeroProtocolo != undefined && numeroProtocolo.length > 0) {
                $.ajax({
                    url: "/AtendimentoTecnico/AssociarAtendimento/",
                    type: "POST",
                    data: { IdFichaAtendimento: $('#IdFichaAtendimento').val(), NrProtocoloAssociado: $('#NrProtocoloReferenciado').val() },
                    beforeSend: function () {
                        $("#associarAtendimento").prop('disabled', true);
                    },
                    success: function (response) {
                        if (response !== null && response !== undefined) {
                            if (response.msg !== null && response.msg !== undefined && response.msg.length > 0) {
                                $.each(response.msg, function (index, value) {
                                    switch (value.TipoMensagem) {
                                        case 2: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo); break;
                                        case 3: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Error, value.Titulo); break;
                                        default: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Sucesso, value.Titulo); break;
                                    }
                                });
                            }
                            else {
                                if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                                    obterProtocolosPorFichaAtendimento(response.data);
                                }
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem(XMLHttpRequest.responseText, TipoMensagem.Error, errorThrown);
                    },
                    complete: function () {
                        $('#NrProtocoloReferenciado').val("");
                        $("#associarAtendimento").prop('disabled', false);
                    }
                });
            } else {
                BASE.MostrarMensagem("Favor associar um protocolo.", TipoMensagem.Informativa);
            }
        });
    }

    function bindIdAnexo() {
        $("#tabArquivos button.btnExcluir, #tabArquivosFornecedor button.btnExcluir").off('click');
        $("#tabArquivos button.btnExcluir, #tabArquivosFornecedor button.btnExcluir").on('click', function () {
            $('#IdAnexo').val($(this).data('idanexo'));
            $('#excluirAnexo').modal('show');
            excluirAnexo();
        });
    }

    //TODO: VERIFICAR A POSSIBILIDADE DE COLOCAR EM UM ARQUIVO EM OUTRO NÍVEL PARA SER COMPARTILHADA
    function excluirAnexo() {
        $("#excluirAnexo #confirmar-Exclusao").off('click');
        $("#excluirAnexo #confirmar-Exclusao").on('click', function () {
            $.ajax({
                url: "/AtendimentoTecnico/ExcluirAnexo/",
                type: "post",
                dataType: "json",
                data: { idAquisicao: $('#IdAquisicao').val(), idAnexo: $('#IdAnexo').val() },
                success: function (data) {
                    if (validaExistencia(data, parseInt($('#IdAnexo').val()), parseInt($('#IdAquisicao').val()))) {
                        BASE.MostrarMensagem("Usuário não tem permissão!", TipoMensagem.Alerta);                        
                    }
                    else {
                        BASE.MostrarMensagem("Anexo excluído com sucesso!", TipoMensagem.Sucesso);
                    }
                    obterAnexosPorIdReclamacao(data);
                    $('#excluirAnexo').modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitacao.", TipoMensagem.Error);
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        });
    }

    //TODO: VERIFICAR A POSSIBILIDADE DE COLOCAR EM UM ARQUIVO EM OUTRO NÍVEL PARA SER COMPARTILHADA
    function validaExistencia(dataP, idAnexoP, idAquisicaoP) {
        var retorno = false;

        if (dataP.AquisicaoAnexo.length === 0) {
            retorno = false;
        }
        else {
            for (var t = 0; t < dataP.AquisicaoAnexo.length; t++) {
                if ((dataP.AquisicaoAnexo[t].IdAnexo === idAnexoP) && (dataP.AquisicaoAnexo[t].IdAquisicao === idAquisicaoP)) {
                    retorno = true;
                }
            }
        }        

        return retorno;
    }

    function obterAnexosPorIdReclamacao(data) {
        $("#tabArquivos tbody").empty();
        $(data.AquisicaoAnexo).each(function (i) {
            $("#tabArquivos tbody").append("<tr> <td>" +
                data.AquisicaoAnexo[i].NomeArquivo + "</td> <td>" +
                converterDataJsonParaDataBr(data.AquisicaoAnexo[i].DataEnvio) +
                "</td> " +
                '<td class="acoes text-center">' +
                    $.validator.format('<a class="btn btn-success btn-xs" href="/AtendimentoTecnico/DownloadArquivo?idAquisicao={0}&idAnexo={1}" target="_blank"><i class="fa fa-download"></i></a> ', data.AquisicaoAnexo[i].IdAquisicao, data.AquisicaoAnexo[i].IdAnexo) +
                    $.validator.format('<button class="btn btn-danger btn-xs btnExcluir" data-toggle="tooltip" data-placement="top" title="Excluir" data-idaquisicao="{0}" data-idanexo="{1}"><i class="fa fa-trash"></i></button>', data.AquisicaoAnexo[i].IdAquisicao, data.AquisicaoAnexo[i].IdAnexo) +
                "</td></tr>");

        });
        bindIdAnexo();
        limparUpload();

    }

    function obterProtocolosPorFichaAtendimento(data) {
        $("#tabAtendimentoFichaAssociacao tbody").empty();
        $(data).each(function (i) {
            $("#tabAtendimentoFichaAssociacao tbody").append(
                "<tr>" +
                    "<td>" + data[i].NrProtocoloAssociado + "</td>" +
                    "<td>" + data[i].NomeConsumidorAssociado + "</td>" +
                    "<td>" + data[i].DescricaoSituacaoAtendimentoAssociado + "</td>" +
                "</tr>"
            );
        });
    }

    function converterDataJsonParaDataBr(value) {
        var padrao = /Date\(([^)]+)\)/;
        var resultado = padrao.exec(value);
        var dt = new Date(parseFloat(resultado[1]));
        return (dt.getDate()) + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + "  " + dt.getHours() + ":" + dt.getMinutes();
    }

    function habilitarBotoaProtocoloKeyUp() {
        $("#NrProtocoloReferenciado").off('keyup');
        $("#NrProtocoloReferenciado").on('keyup', function () {
            if ($("#NrProtocoloReferenciado").val()) {
                $('#associarAtendimento:button').prop("disabled", false);
            } else {
                $('#associarAtendimento:button').prop("disabled", true);
            }
        });
    }

    function validarExtensoes(file) {       
        return true;
    };

    function validarTamanho(file) {
        if (file.item(0).size > (1048576 * 2)) {
            return false;
        }
        return true;
    };

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ANEXOS.Init();
});

