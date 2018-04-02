CRUDMODALGRID = (function () {

    function init() {
        BASE.Debug("CRUDMODALGRID.Init()");
        bindAll();
    }

    function bindAll() {
        bindAdicionarItem();
        bindExcluirItem();
    }

    function bindAdicionarItem() {
        BASE.Debug('bindAdicionarItem', DebugAction.Info);
        $('#modalDetalhe').on('click.detalhe', 'table.grid-modal .btn-grid-modal-adicionar', function () {
            BASE.Debug('clickAdicionarItem', DebugAction.Info);
            var that = $(this);
            var tr = that.closest('tr');
            var table = tr.closest('table.grid-modal');
            var template = table.find('tr.grid-modal-template');
            var prefixo = table.data('grid-modal-prefixo');

            var inputs = tr.find("input:not(:hidden)");

            var vazios = inputs.filter(function () {
                return !this.value;
            });

            vazios.addClass('error');

            if (vazios.length === 0) {
                inputs.removeClass('error');
                incluirRegistro(table, template, tr, prefixo);
            }

            return false;
        });
    }

    function bindExcluirItem() {
        BASE.Debug('bindExcluirItem', DebugAction.Info);
        $('#modalDetalhe').on('click.detalhe', 'table.grid-modal .btn-grid-modal-excluir', function () {
            var that = $(this);
            var tr = that.closest('tr');
            var id = tr.data('id');
            var table = tr.closest('table.grid-modal');
            var template = table.find('tr.grid-modal-template');
            var prefixo = table.data('grid-modal-prefixo');

            var urlValidacao = that.data('grid-modal-url-validar-exclusao');

            if (urlValidacao !== undefined && id !== 0) {
                $.post(urlValidacao, { id: id })
                .done(function (response) {
                    if (response.Sucesso) {
                        excluirRegistro(table, template, tr, prefixo);
                    }
                    else {
                        BASE.MostrarMensagem(response.Mensagem, TipoMensagem.Alerta);
                    }
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) { BASE.MostrarMensagem(errorThrown, TipoMensagem.Error); });
            }
            else {
                excluirRegistro(table, template, tr, prefixo);
            }

            return false;
        });
    }

    function incluirRegistro(table, template, tr, prefixo) {
        BASE.Debug('incluirRegistro', DebugAction.Info);
        var inputs = tr.find('input');
        var novaLinha = template.clone().removeClass('grid-modal-template');
        var tbody = table.find('tbody');
        var rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');
        var qtdRows = rows.length;

        for (var i = 0; i < inputs.length; i++) {
            var input = $(inputs[i]);
            var valor = input.val();
            var name = input.data('grid-modal-name');

            var celulaDestino = novaLinha.find('[data-grid-modal-name=' + name + ']').closest('td');
            var spanDestino = celulaDestino.find('span');


            var inputDestino = $('<input>').attr({
                type: 'hidden',
                id: prefixo + '_' + qtdRows + '__' + name,
                name: prefixo + '[' + qtdRows + '].' + name
            });

            inputDestino.data('grid-modal-name', name);
            inputDestino.appendTo(celulaDestino);

            spanDestino.text(valor);
            inputDestino.val(valor);
        }

        tr.find('input:not(:hidden)').each(function (i, e) {
            e.value = '';
        });

        table.find('tr:last').before(novaLinha);
        novaLinha.css('visibility', 'visible').hide().fadeIn().removeClass('hidden');

        tr.find('input:not(:hidden):first').focus();
    }

    function excluirRegistro(table, template, tr, prefixo) {
        var tbody = table.find('tbody');

        tr.remove();

        var rows = tbody.find('tr').not('.grid-modal-template, .grid-modal-inclusao');
        var qtdRows = rows.length;


        for (var i = 0; i < rows.length; i++) {
            var currentRow = $(rows[i]);
            var inputs = currentRow.find('input');


            for (var j = 0; j < inputs.length; j++) {
                var currentInput = $(inputs[j]);
                var name = currentInput.data('grid-modal-name');

                currentInput.prop('name', prefixo + '[' + i + '].' + name);
            }
        }
    }

    return {
        Init: function () {
            init();
        }
    };
}());