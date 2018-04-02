CONSUMIDORANEXOS = (function () {

    function init() {
        bindAll();
    }
    function bindAll() {
        anexar();
        preview();
        preVisualizacao();
        bindLimpar();
        salvarReclamacaoAnexos();
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

    function preVisualizacao() {
        // Cria o preview
        $(".image-preview-input input:file").off('change');
        $(".image-preview-input input:file").on('change', function () {

            var arquivo = $("#uploadImage").get(0).files;
            if (!validarExtensoes(arquivo)) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao anexar arquivo, extensão não permitida.", TipoMensagem.Error);
                $('#uploadImage').val('');
                return false;
            }
            if (!validarTamanho(arquivo)) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao anexar arquivo, arquivo é maior que o permitido 2MB.", TipoMensagem.Error);
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
    
    function validarExtensoes(file) {
        var extensoesPermitidas = new Array(".png", ".jpeg", ".jpg", ".gif", ".bmp", ".pdf");
        var extensao = (file[0].name.substring(file[0].name.lastIndexOf("."))).toLowerCase();
        var permitida = false;
        for (var i = 0; i < extensoesPermitidas.length; i++) {
            if (extensoesPermitidas[i] === extensao) {
                permitida = true;
                break;
            }
        }
        if (!permitida) {
            return false;
        }
        return true;
    };

    function validarTamanho(file) {
        if (file.item(0).size > (1048576 * 2)) {
            return false;
        }
        return true;
    };

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

    function salvarReclamacaoAnexos() {
        $("#anexarArquivo").off('click');
        $("#anexarArquivo").on('click', function () {

            $("#anexarArquivo").addClass('disabled');
            $("#anexarArquivo").click(function () { return false; });

            var file = $("#uploadImage").get(0).files;
            if (!validarExtensoes(file)) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao anexar arquivo, extensão não permitida.", TipoMensagem.Error);
                return false;
            }
            if (!validarTamanho(file)) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao anexar arquivo, arquivo é maior que o permitido 2MB.", TipoMensagem.Error);
                return false;
            }

            if (file.length > 0) {
                var data = new FormData();
                if (file.length > 0) {
                    data.append("HelpSectionImages", file[0]);
                    data.append("IdAquisicao", $('#IdAquisicao').val());
                    data.append("NomeArquivo", $('#NomeArquivo').val());
                }
                $.ajax({
                    url: "/AtendimentoConsumidor/SalvarArquivo/",
                    type: "post",
                    processData: false,
                    contentType: false,
                    data: data,
                    success: function (data) {
                        if (data.Valido !== undefined && data.Valido === false) {
                            BASE.Mensagem.Mostrar("Aviso", data.Mensagem, TipoMensagem.Error);
                            return;
                        }
                        obterAnexosPorIdReclamacao(data);
                        $("#anexarArquivo").removeClass('disabled');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitacao.", TipoMensagem.Error);
                        console.log(XMLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }

                });
            } else {
                BASE.Mensagem.Mostrar("Aviso", "Favor anexar um arquivo.", TipoMensagem.Error);
            }
        });
    }

    function obterAnexosPorIdReclamacao(data) {
        $("#tabArquivos tbody").empty();
        var quantidadeAnexos;
        $(data).each(function (i) {
            $("#tabArquivos tbody").append("<tr> <td>" +
                data[i].NomeArquivo + "</td> <td>" +
                converterDataJsonParaDataBr(data[i].DataEnvio) +
                "</td> </tr>");
            quantidadeAnexos = i + 1;
        });
        limparUpload();

        verificarQuantidadeUpload(quantidadeAnexos);
    }

    function converterDataJsonParaDataBr(value) {
        var padrao = /Date\(([^)]+)\)/;
        var resultado = padrao.exec(value);
        var dt = new Date(parseFloat(resultado[1]));
        return (dt.getDate()) + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + "  " + dt.getHours() + ":" + dt.getMinutes();
    }

    function verificarQuantidadeUpload(quantidadeAnexos) {

        if (quantidadeAnexos >= 3) {
            $('#uploadImage').prop('disabled', true);
            $('#form-arquivo').hide();
        } else {
            $('#form-arquivo').show();
        }
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    CONSUMIDORANEXOS.Init();
});

