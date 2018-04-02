var REGISTRARPROCESSO = (function () {

    var idDocumento = undefined;
    var form = null;

    function init() {
        abreFrame();
        REGISTRARPROCESSO.Poscarregar = posCarregar();
        bindAll();
    }

    function bindAll() {
        bindPesquisarProtocoloProcesso();
        bindItemMenu();
        bindMascara();
        bindCamposPesquisa();     


    }

    function bindCamposPesquisa() {
        $("#NrProcessoFormatado").val($("#hiddenProcesso").val());
        $("#NrProtocoloFormatado").val($("#hiddenProtocolo").val());
    }

    function bindPesquisarProtocoloProcesso() {
        $("#form-filtro-processo #btn-filtrar").off("click");
        $("#form-filtro-processo #btn-filtrar").on("click", function () {
            pesquisarProtocoloProcesso();
        });
    }

    function bindItemMenu() {
        $(".item-menu-processo").off("click");
        $(".item-menu-processo").on("click", function () {
            var _index = $(this).data("index");
            abreFrame(_index);
        });
    }

    function bindMascara() {

        $('#NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $('#NrProcessoFormatado').mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $('#NrProtocoloFormatado').change(function () {
            $('#NrProtocoloFormatado').val(adicionarQtdCaracterAEsquerda($('#NrProtocoloFormatado').val(), 11, 0));
            if ($('#NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#NrProtocoloFormatado').val('');
            }
        });

        $('#NrProcessoFormatado').change(function () {
            $('#NrProcessoFormatado').val(adicionarQtdCaracterAEsquerda($('#NrProcessoFormatado').val(), 13, 0));
            if ($('#NrProcessoFormatado').val().indexOf('000000') >= 0) {
                $('#NrProcessoFormatado').val('');
            }
        });

    }
    
    function adicionarQtdCaracterAEsquerda(num, qtdTotalCampo, caracterAdicionado) {
        var str = ("" + num);
        return (Array(Math.max((qtdTotalCampo + 1) - str.length, 0)).join(caracterAdicionado) + str);
    }

    function abreFrame(_index) {

        _idDocumento = $("#IdDocumento").val();

        console.log("Abrindo o frame " + _index);
        console.log("Buscando os dados do documento " + _idDocumento);

        $.ajax({
            url: "/RegistrarProcesso/AbreFrame",
            type: "GET",
            data: { index: _index, idDocumento: _idDocumento },
            cache: false,
            success: function (data) {
                renderizarConteudo(data);
                inicializarJs(_index);
                ativarMenuSelecionado(_index);
            },
            error: function () {

            }
        });
    }

    function inicializarJs(_index) {
        switch (_index) {
            case 1:
                DADOSPROCESSO.Init();
                break;
            case 2:
                INTERESSADO.Init();
                break;
            case 3:
                SOLICITANTE.Init();
                break;
            case 4:
                DOCUMENTOJUNTADA.Init();
                break;
            case 5:
                MOVIMENTACAO.Init();
                break;
            case 6:
                VOLUME.Init();
                break;
            case 7:
                APENSAMENTO.Init();
                break;
            case 8:
                DOCUMENTOINCORPORACAO.Init();
                break;
            case 9:

                break;
            default:
                DADOSPROCESSO.Init();
        }
    }

    function renderizarConteudo(html) {
        $("#conteudo-processo").html(html);
    }

    function renderizarConteudoMenu(html) {
        $("#menu-processo").html(html);
    }

    function posCarregar() {
        bindAll();
        abreFrame(1);
    }

    function pesquisarProtocoloProcesso() {
        form = $("#form-filtro-processo");
        var valido = validarDados(form);

        if (valido) {

            var obj = $(form).serializeObject();

            if (obj.NrProtocoloFormatado !== "" || obj.NrProcessoFormatado) {

                $.ajax({
                    url: "/RegistrarProcesso/FiltrarProcesso",
                    type: "POST",
                    data: { filtro: obj },
                    success: function(response, status, xhr) {

                        var isJson = BASE.Util.ResponseIsJson(xhr);
                        if (!isJson) {

                            var idDocumento = $(response).filter('#IdDocumentoFiltroProcesso').val();

                            console.log("IdDocumento pós filtrar processo " + idDocumento);

                            if (idDocumento !== undefined)
                                $("#IdDocumento").val(idDocumento);

                            renderizarConteudoMenu(response);
                            posCarregar();
                        } else {
                            BASE.Mensagem.Mostrar("Documento informado não foi encontado. Tente novamente.",
                                TipoMensagem.Alerta,
                                "Não Encontrado");
                        }
                    },
                    error: function() {
                    }
                });
            } else {
                BASE.Mensagem.Mostrar("Informe um Número de Protocolo ou Processo", TipoMensagem.Alerta, "Alerta");
            }
        } else {
            form.validate();
        }
    }

    function ativarMenuSelecionado(index) {
        if (index === undefined)
            return;

        var existeClasse = $(".item-menu-processo:eq(" + (index - 1) + ")").hasClass("ativo");
        if (!existeClasse) {
            $(".item-menu-processo").removeClass("ativo");
            $(".item-menu-processo:eq(" + (index - 1) + ")").addClass("ativo");
        }
    }   

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function monstrarMensagensAlerta(response) {
        $.each(response.MensagensCriticas, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }

    function monstrarMensagensErro(response) {
        $.each(response.Erro, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
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
        Init: function () {
            init();
        },
        Poscarregar: function () { return false; },
        AbreFrame: abreFrame,
        ValidarForm: validarDados,
        MostrarMensagensAlerta: monstrarMensagensAlerta,
        MostrarMensagensErro: monstrarMensagensErro,
        AdicionarQtdCaracterAEsquerda: adicionarQtdCaracterAEsquerda
    }

}());

$(function () {
    REGISTRARPROCESSO.Init();
});
