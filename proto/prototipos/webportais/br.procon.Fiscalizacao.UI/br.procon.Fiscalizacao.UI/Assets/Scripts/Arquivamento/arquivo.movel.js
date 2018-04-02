ARQUIVOMOVEL = (function () {
    function init() {
        CRUDFILTRO.Carregar();
        CRUDFILTRO.Filtrar();
        CRUDMODALGRID.Init();
        CRUDFILTRO.Evento.PosListar = posListar;
        CRUDBASE.Eventos.PosCarregarEditar = posCarregar;

        editarMenssagensJquery();
        bindAll();
    }

    function bindAll() {
        resetEventoModal();
        fechaModal();
        bindAdicionarItem();
        bindLimparDetalhe();
        bindCancelar();
        bindSalvar();
        bindExcluir();
    }

    function posListar() {
        $('[data-toggle="tooltip"]').tooltip();
        bindPaginacao();
    }

    function bindPaginacao() {
        $('#moveis-arquivo').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"],
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"],
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true,
            bAutoWidth: false,
        });
    }

    function resetEventoModal() {
        $('#modalDetalhe').off('click');
    }

    function fechaModal() {
        $('#modalDetalhe').on('click', 'div[class=modal-header] button[class=close]', function () {
            cancelarCadastro();
            return false;
        });
    }

    function posCarregar() {
        if (parseInt($('#Id').val()) > 0) {
            $('#incluirMovelArquivo-label').text($('#incluirMovelArquivo-label').text().replace($('#incluirMovelArquivo-label').text(), 'Editar Móvel de Arquivo'));
        }
        else {
            $('#incluirMovelArquivo-label').text($('#incluirMovelArquivo-label').text().replace($('#incluirMovelArquivo-label').text(), 'Incluir Móvel de Arquivo'));
            $('#Ativo').val(1);
        }

        bindPaginacao();
    }

    function bindLimparDetalhe() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnLimpar', function () {
            $('#form-detalhe')[0].reset();
        });
    }

    function bindSalvar() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnSalvar', function () {
            var inputs = [$('#modalDetalhe #CodigoDivisao'), $('#modalDetalhe #DescricaoDivisao')];

            for (var i = 0; i < inputs.length; i++) {
                var input = $(inputs[i]);
                input.removeAttr('required');
            }

            var form = $('#form-detalhe');
            var valido = validarDados(form);

            if (valido) {
                var obj = form.serialize();

                $.ajax({
                    type: "POST",
                    url: form.attr('action'),
                    data: obj,
                    success: function (response) {
                        if (response.Sucesso === false) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                        }
                        else if (response.Sucesso === true) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);

                            $('#modalDetalhe').modal('hide');
                            CRUDFILTRO.Filtrar();
                        }
                    },
                    error: function (e) {
                        BASE.Mensagem.Mostrar(e.responseText, TipoMensagem.Error);
                    }
                });
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Por favor preencha os campos obrigatórios", TipoMensagem.Alerta);
            }
        });
    }

    function bindAdicionarItem() {
        $('#modalDetalhe').on('click.detalhe', ' .btn-grid-modal-adicionar', function () {
            var inputs = [$('#modalDetalhe #CodigoDivisao'), $('#modalDetalhe #DescricaoDivisao')];

            for (var i = 0; i < inputs.length; i++) {
                var input = $(inputs[i]);
                input.attr('required', 'required');
            }

            var uniqueInput = $('#modalDetalhe #CodigoDivisao');

            var table = $('#moveis-arquivo');
            var tbody = table.find('tbody');
            var rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');
            var qtdRows = rows.length;

            for (var i = 0; i < rows.length; i++) {
                var currentInput = $('#Divisoes_' + i + '__Codigo');

                if (currentInput.val() == uniqueInput.val()) {
                    BASE.Mensagem.Mostrar("Código da divisão duplicado", TipoMensagem.Alerta);
                    return;
                }
            }

            var form = $('#form-detalhe');
            var valido = validarDados(form);

            if (valido) {
                var obj = form.serialize();

                var table = $('#moveis-arquivo');
                //var linha = table.first('tr');
                //var template = table.find('tr.grid-modal-template');
                //var prefixo = table.data('grid-modal-prefixo');

                var inputs = [$('#modalDetalhe #CodigoDivisao'), $('#modalDetalhe #DescricaoDivisao')];

                incluirRegistro(table, inputs);
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Por favor preencha os campos obrigatórios", TipoMensagem.Alerta);
            }
        });
    }

    function bindExcluir() {
        $('#modalDetalhe').on('click.detalhe', 'table.grid-modal .btn-grid-modal-excluir', function () {
            var btn = $(this);
            var url = btn.data('url');
            var idItem = btn.data('id');

            var that = $(this);
            var linha = that.closest('tr');
            var table = linha.closest('table.grid-modal');
            var template = table.find('tr.grid-modal-template');
            var prefixo = table.data('grid-modal-prefixo');

            BASE.MostrarModalConfirmacao('Exclusão de Registro', 'Deseja realmente excluir o registro?', function () {
                if (idItem == "0") {
                    excluirRegistro(table, template, linha, prefixo);
                    CRUDFILTRO.Filtrar();
                    return;
                }

                //Tenta excluir do banco
                $.ajax({
                    type: "POST",
                    url: url,
                    data: { id: idItem },
                    dataType: "json",
                    success: function (response) {
                        //Exclui o registro do HTML
                        if (response.Sucesso === true) {
                            ExcluirDivisao(idItem);
                            excluirRegistro(table, template, linha, prefixo);
                        } else if (response.Sucesso === false) {
                            if (response.Mensagem.length > 0)
                                BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);

                            BASE.Util.TratarRespostaJson(response);
                        }
                    },
                    error: function (xhr) {
                        BASE.Util.TratarErroAjax(xhr);
                    }
                });

                var inputs = [$('#modalDetalhe #CodigoDivisao'), $('#modalDetalhe #DescricaoDivisao')];

                for (var i = 0; i < inputs.length; i++) {
                    var input = $(inputs[i]);
                    input.val('');
                }
            },
            cancelar(), '.btn-excluir');

            return false;
        });
    }

    function ExcluirDivisao(idItem) {
        //Exclui o registro
        $.ajax({
            type: "POST",
            url: '/ArquivoMovel/ExcluirDivisao',
            data: { id: idItem },
            dataType: "json",
            success: function (response) {
                //Exclui o registro do HTML
                if (response.Sucesso === true) {
                    //CRUDFILTRO.Filtrar();
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                } else if (response.Sucesso === false) {
                    if (response.Mensagem.length > 0)
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);

                    BASE.Util.TratarRespostaJson(response);
                }
            },
            error: function (xhr) {
                BASE.Util.TratarErroAjax(xhr);
            }
        });
    }

    function cancelar() {
        CRUDBASE.Eventos.Cancelar();
    }

    function bindCancelar() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnCancelar', function () {
            cancelarCadastro();
        });
    }

    function cancelarCadastro() {
        BASE.Modal.ExibirModalConfirmacao(
            'Cancelar Operação', 'Deseja mesmo cancelar a inclusão/alteração do móvel?',
            'small',
            '<i class="fa fa-close margR5"></i>Não',
            'btn-primary',
            '<i class="fa fa-check margR5"></i>Sim',
            'btn-danger',
            function () {
                $('#form-detalhe')[0].reset();
                $('#modalDetalhe').modal('hide');
            },
            function () {
                $('#modalDetalhe').modal('show');
            });
    }

    function incluirRegistro(table, inputs) {
        var dt = $(table).DataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"],
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"],
                    "className": "acoes text-center", "targets": [2]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true,
            bAutoWidth: false,
        });

        var tbody = table.find('tbody');
        var rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');

        dt.row.add([
             '<input data-grid-modal-name="Id" id="Divisoes[' + rows.length + '].Id" name="Divisoes[' + rows.length + '].Id" type="hidden" value="0">' +
             '<input data-grid-modal-name="Descricao" id="Divisoes[' + rows.length + '].Codigo" name="Divisoes[' + rows.length + '].Codigo" type="hidden" value="' + $(inputs[0]).val() + '"></input>' +
             '<span id="Codigo">' + $(inputs[0]).val() + '</span>',
             '<input data-grid-modal-name="Descricao" id="Divisoes[' + rows.length + '].Descricao" name="Divisoes[' + rows.length + '].Descricao" type="hidden" value="' + $(inputs[1]).val() + '"></input>' +
             '<span id="Descricao">' + $(inputs[1]).val() + '</span>',
             '<button  type="button" class="btn btn-xs btn-danger btn-grid-modal-excluir" title="Excluir" data-id="0" data-url="@Url.Action("ValidarExclusaoDivisao")"><i class="fa fa-trash"></i></button>'
        ]).draw(false);

        for (var i = 0; i < inputs.length; i++) {
            var input = $(inputs[i]);
            input.val('');
        }

        rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');
        $('#moveis-arquivo_info').html('Total de Registros salvos: ' + (rows.length));
    }

    function excluirRegistro(table, template, tr, prefixo) {
        var dt = $(table).DataTable();
        dt.row($(tr)).remove().draw();

        var tbody = table.find('tbody');
        var rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');

        $('#moveis-arquivo_info').html('Total de Registros salvos: ' + (rows.length));
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
            CRUDBASE.Validator.RegrasEspecificas();
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function editarMenssagensJquery() {
        jQuery.extend(jQuery.validator.messages, {
            required: "Campo Obrigatório."
        });
    }

   

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ARQUIVOMOVEL.Init();
});