FINALIZARATENDIMENTO = (function () {

    function init() {
        bindAll();
    }
    function bindAll() {
        salvar();
    }


    function salvar() {
        $("#btn-salvar").off('click');
        $("#btn-salvar").on('click', function () {

            var form = $("#descricao-reclamacao"),
                valido = validarDados(form);
            
            if (valido) {

                if ($("input[name=tipoatendimento]:checked").val() == 1) {
                    if (validarSalvarConsulta()) {
                        $.ajax({
                            url: '/atendimentoconsumidor/salvarconsulta',
                            data: {
                                idClassificacao: $('#IdClassificacao').val(),
                                idTipoAtendimento: $('#TipoAtendimento').val(),
                                descricao: $('#DescricaoReclamacao').val(),
                                idConsumidor: $('#IdConsumidor').val()
                            },
                            type: 'post',
                            dataType: "json",
                            success: function(data) {
                                if (data) {
                                    BASE.Mensagem.Mostrar(
                                        data.Mensagem,
                                        TipoMensagem.Sucesso,data.Titulo);
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitação.", TipoMensagem.Error);
                            }
                        });
                    }
                }
                else {
                    form = $("#descricao-reclamacao");
                    valido = validarDados(form);

                    var formReclamacao = $("#form-reclamacao"),
                        validarReclamacao = validarDados(formReclamacao);

                    if (valido && validarReclamacao) {
                        $.ajax({
                            url: '/atendimentoconsumidor/salvarreclamacao',
                            data: $(formReclamacao).serialize() + '&' + $.param({ 'DescricaoReclamacao': $('#DescricaoReclamacao').val(), 'IdClassificacao': $('#IdClassificacao').val(), 'IdConsumidor': $('#IdConsumidor').val(), 'IdTipoaAtendimento': $('#TipoAtendimento').val() }),
                            type: 'post',
                            dataType: "json",
                            success: function (data) {
                                if (data) {
                                    BASE.Mensagem.Mostrar(
                                        data.Mensagem,
                                        TipoMensagem.Sucesso, data.Titulo);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                BASE.Mensagem.Mostrar("Erro ao enviar solicitação.", TipoMensagem.Error, "Aviso");
                            }
                        });
                    }

                }
            } 
        });
    }

    function validarSalvarConsulta() {
        if ($('#IdClassificacao').val() == "" || $('#IdClassificacao').val() == undefined || $('#IdClassificacao').val() == 0) {
            BASE.MostrarMensagem("Favor selecionar uma Classificação", TipoMensagem.Alerta, "Aviso");
            return false;
        }
        if ($('#TipoAtendimento').val() == "" || $('#TipoAtendimento').val() == undefined) {
            BASE.MostrarMensagem("Favor selecionar o tipo de atendimento.", TipoMensagem.Alerta, "Aviso");
            return false;
        }
        if ($('#DescricaoReclamacao').val() == '') {
            BASE.MostrarMensagem("Favor informar os detalhes da Consulta.", TipoMensagem.Alerta, "Aviso");
            return false;
        }
        return true;
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

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    FINALIZARATENDIMENTO.Init();
});

