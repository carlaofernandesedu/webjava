var PARAMETROS = (function () {
    var init = function () {
        $('input[data-id_tipo_objeto_dado]').removeProp('checked');
        $('input[data-id_tipo_objeto_dado]').removeProp('idobjetodados');
        $('input[data-istypeahead!="true"][type!="hidden"]').prop('disabled', 'disabled');

        var idClassificacao = $('input[name="IdClassificacao"]').val();

        if (idClassificacao != "" && idClassificacao != "0") {
            $.ajax({
                type: "POST",
                url: "/Classificacao/ObterParametrosLista",
                data: "IdClassificacao=" + $('input[name="IdClassificacao"]').val(),
                dataType: "json",
                success: function (response) {
                    atualizarDados(response);
                    $('input[type="checkbox"]').removeProp('disabled');
                }
            });
        }

        $('input[name="IdClassificacao"]').off('change');
        $('input[name="IdClassificacao"]').on('change', function () {
            items = [];
            $('input').removeProp('disabled');

            $.ajax({
                type: "POST",
                url: "/Classificacao/ObterParametrosLista",
                data: "IdClassificacao=" + $(this).val(),
                dataType: "json",
                success: function (response) {
                    atualizarDados(response);
                }
            });
        });

        bindCheckBox();
        bindCheckBoxPedido();
        bindBtnSalvarRotulos();
        bindBtnSalvarPedidos();
        bindAtualizarPropLista();
    };

    function bindAtualizarPropLista() {
        $('input[name=listDynamic]').off('click');
        $('input[name=listDynamic]').on('click', function () {
            var objetoDado = $(this).parent().parent().parent().find('input[data-id_tipo_objeto_dado]');
            objetoDado.attr('TipoLista', $(this)[0].checked);

            if ($(this)[0].checked == true) {
                $(this).parent().parent().parent().find(' .btn-success').css('display', 'block');
            }
            else {
                $(this).parent().parent().parent().find(' .btn-success').css('display', 'none');
            }
        });
    }

    function bindCheckBox() {
        $('#conteudo_principal').on('change', 'input[data-id_tipo_objeto_dado]', function (index) {
            var tr = $(this).closest('tr');
            var label = tr.find('td input[type="text"]');
            var button = tr.find('td button');
            var inputCheckLista = $('tr input[name=listDynamic]');

            if ($(this).is(":checked")) {
                label.val(label.data('defaultlabel-value'));
                tr.css({ 'background-color': '#FFF' });
                label.removeProp('disabled');
                button.removeProp('disabled');

            } else {
                label.val('');
                tr.css({ 'background-color': '#EEE' });
                label.prop('disabled', 'disabled');
                button.prop('disabled', 'disabled');
                inputCheckLista.prop('checked', false);

                var id = $(this).attr('idobjetodados');

                if (id != undefined && id != "") {
                    $.ajax({
                        type: "POST",
                        url: "/Classificacao/InativarParametro",
                        data: { id: id },
                        dataType: "json",
                        success: function (response) {
                            atualizarDados(response);
                            window.history.back(-1);
                        },
                        error: function (response) {
                            console.log(response);
                        }
                    });
                }
            }

            if (inputCheckLista.prop('checked') == "true") {
                label.parent().parent().find(' .btn-success').css('display', 'block');
            }
            else {
                label.parent().parent().find(' .btn-success').css('display', 'none');
            }
        });
    }

    function bindCheckBoxPedido() {
        $('#conteudo_principal').on('change', 'input[data-id_tipo_pedido_consumidor]', function (index) {
            var tr = $(this).closest('tr');

            if ($(this).is(":checked")) {
                tr.css({ 'background-color': '#FFF' });
            } else {
                tr.css({ 'background-color': '#EEE' });
            }
        });
    }

    function bindBtnSalvarRotulos() {
        $('#conteudo_principal').on('click', '#btnSalvarRotulos', function (index) {
            salvarRotulos();
        });
    }

    function bindBtnSalvarPedidos() {
        $('#conteudo_principal').on('click', '#btnSalvarPedidos', function (index) {
            salvarPedidos();
        });
    }

    function salvarRotulos() {
        var todos = [];

        var itensSelecionados = $('input[data-id_tipo_objeto_dado]:checked');
        var idClassificacao = $('[name="IdClassificacao"]').val();

        if (idClassificacao === undefined || idClassificacao === null || idClassificacao === "") {
            return;
        }

        itensSelecionados.each(function (index, element) {
            var ck = $(this);
            var label = ck.parent().parent().find('input[type="text"]');

            var data = {
                Id: ck.prop('idobjetodados') == undefined ? 0 : ck.prop('idobjetodados'),
                idobjetodados: ck.attr('idobjetodados') === undefined || ck.attr('idobjetodados') === '' ? 0 : parseInt(ck.attr('idobjetodados')),
                IdObjetoTipoDados: ck.data('id_tipo_objeto_dado'),
                IdClassificacao: idClassificacao,
                DescricaoObjeto: label.val() == "" ? label.data('defaultlabel-value') : label.val(),
                TipoLista: ck.attr('TipoLista') == undefined || ck.attr('TipoLista') == null ? "false" : ck.attr('TipoLista'),
                DataCriacao: null,
                IdUsuarioCriacao: 1,
                DataAlteracao: null,
                IdUsuarioAlteracao: null,
                ObjetoDadosAtivo: ck.is(":checked")
            }

            todos.push(data);
        });

        $.ajax({
            type: "POST",
            url: "/Classificacao/ParametrosSalvarTodos",
            data: { idClassificacao: idClassificacao, parametros: todos },
            dataType: "json",
            success: function (response) {
                atualizarDados(response);
                window.history.back(-1);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    function salvarPedidos() {
        var todos = [];
        var checks = $('input[data-id_tipo_pedido_consumidor]:checked');
        var idClassificacao = $('[name="IdClassificacao"]').val();

        if (idClassificacao === undefined || idClassificacao === null || idClassificacao === "") {
            return;
        }

        checks.each(function (index, element) {
            var ck = $(this);

            var data = {
                id_tipo_pedido_consumidor_classificacao_atendimento: ck.prop('IdTipoPedidoDado') == undefined ? 0 : ck.prop('IdTipoPedidoDado'),
                id_tipo_pedido_consumidor: ck.data('id_tipo_pedido_consumidor'),
                ds_tipo_pedido_consumidor: "",
                id_classificacao_atendimento: idClassificacao,
                dt_criacao: null,
                id_usuario_criacao: 0,
                dt_alteracao: null,
                id_usuario_alteracao: 0,
                bl_ativo_tipo_pedido_consumidor: ck.is(":checked")
            }

            todos.push(data);
        });

        $.ajax({
            type: "POST",
            url: "/Classificacao/ParametroSalvarTipoPedidoTodos",
            data: { idClassificacao: idClassificacao, parametros: todos },
            dataType: "json",
            success: function (response) {
                atualizarDados(response);
                window.history.back(-1);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    var atualizarDados = function (response) {
        items = response;

        $('input[data-id_tipo_objeto_dado]').removeProp('checked');
        $('input[data-id_tipo_objeto_dado]').removeProp('idobjetodados');
        $('div.lstItens').empty();

        $.each(response.Labels, function (item) {
            var elm = $('input[data-id_tipo_objeto_dado="' + response.Labels[item].IdObjetoTipoDados + '"]');
            var label = elm.parent().parent().find('input[type="text"]');
            var labelItens = elm.parent().parent().find('div.lstItens');
            var inputCheckLista = elm.parent().parent().find('div.chkListaAtiva').find('input[name=listDynamic]');

            elm.attr('idobjetodados', response.Labels[item].IdObjetoDados);
            elm.attr('TipoLista', response.Labels[item].TipoLista);

            if (response.Labels[item].ObjetoDadosAtivo == true) {
                elm.prop('checked', 'checked');
                inputCheckLista.prop('checked', 'checked');
            }

            label.val(response.Labels[item].DescricaoObjeto);

            if (elm.attr('TipoLista') == "true") {
                //label.parent().removeAttr('colspan');
                label.parent().parent().find('div.lstItens').parent().show();

                var lista = response.Labels[item].ListaParametroAtendimentoLista;
                labelItens.append('<ul class="list-group"></ul>');

                for (var i = 0; i < lista.length; i++) {
                    labelItens.find('ul').append('<li class="list-group-item">' + lista[i].DescricaoObjetoDadoLista + '</li>');
                }

                labelItens.show();

                label.parent().parent().find(' .btn-success').css('display', 'block');

                inputCheckLista.prop('checked', true);
            } else {
                label.parent().parent().find(' .btn-success').css('display', 'none');
                inputCheckLista.prop('checked', false);
            }
        });

        $('input[data-id_tipo_pedido_consumidor]').removeProp('checked');
        $.each(response.TiposPedido, function (item) {
            var elm = $('input[data-id_tipo_pedido_consumidor="' + response.TiposPedido[item].id_tipo_pedido_consumidor + '"]');
            elm.prop('IdTipoPedidoDado', response.TiposPedido[item].id_tipo_pedido_consumidor_classificacao_atendimento);

            if (response.TiposPedido[item].bl_ativo_tipo_pedido_consumidor == true) {
                elm.prop('checked', 'checked');
            }
        });

        $('table tbody tr').each(function (index, elm) {
            elm = $(elm);

            var checkbox = elm.find('td input[type="checkbox"]');
            var label = elm.find('td input[type="text"]');
            var button = elm.find('td button');

            if (checkbox.length > 0) {
                if (!checkbox.prop('checked')) {
                    elm.css({ 'background-color': '#EEE' });
                    label.prop('disabled', 'disabled');
                    button.prop('disabled', 'disabled');
                } else {
                    elm.css({ 'background-color': '#FFF' });
                    label.removeProp('disabled');
                    button.removeProp('disabled');
                }
            }
        });

        $('div.tipo-dado button').off('click');
        $('div.tipo-dado button').on('click', function (index) {
            var idobjetodados = $(this).parent().parent().find('input[type="checkbox"]').attr('idobjetodados');
            var item = getItem(idobjetodados);
            var inpuCheckLista = $(this).parent().parent().find('div.chkListaAtiva').find('input[name=listDynamic]:checked');

            if ((item != undefined && item.TipoLista) || (inpuCheckLista.length > 0)) {
                $('input#descricao, select#ParametroLista, button#btn-adicionar, button#btn-excluir').removeAttr('disabled');
            } else {
                $('input#descricao, select#ParametroLista, button#btn-adicionar, button#btn-excluir').attr('disabled', 'disabled');
            }

            $('#modal-dlg-itens input[name="idobjetodados"]').val(idobjetodados);

            updateParametrosLista(items);

            $('#modal-dlg-itens h4.modal-title').html('Itens de: <strong>' + $(this).parent().parent().find('input[type="text"]').val() + '</strong>');
            $('#modal-dlg-itens').modal('show').on('hidden.bs.modal', function (e) {
                atualizarDados(items);
            });
        });

        $('#modal-dlg-itens input[type="checkbox"]').off('change');
        $('#modal-dlg-itens input[type="checkbox"]').on('change', function () {
            var idobjetodados = $('#modal-dlg-itens input[name="idobjetodados"]').val();
            var ck = $('input[type="checkbox"][idobjetodados="' + idobjetodados + '"]');
            ck.attr('TipoLista', $(this).is(":checked") ? "true" : "false");
        });

        $('#modal-dlg-itens #btn-excluir').off('click');
        $('#modal-dlg-itens #btn-excluir').on('click', function () {
            var data = {
                Id: $("select#ParametroLista option:selected").val() == undefined ? 0 : $("select#ParametroLista option:selected").val(),
                IdClassificacao: $('[name="IdClassificacao"]').val()
            };

            $.ajax({
                type: "POST",
                url: "/Classificacao/ParametrosExcluirLista",
                data: data,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    $('input[name="descricao"]').val('');
                    $("select#ParametroLista option:selected").removeAttr("selected");

                    items = response;
                    updateParametrosLista(response);
                }
            });
        });

        $('#modal-dlg-itens #btn-adicionar').off('click');
        $('#modal-dlg-itens #btn-adicionar').on('click', function () {
            if ($('input[name="descricao"]').val() != '') {
                var data = {
                    IdObjtoDadoLista: $("select#ParametroLista option:selected").val() == undefined ? 0 : $("select#ParametroLista option:selected").val(),
                    IdObjetoDado: $('#modal-dlg-itens input[name="idobjetodados"]').val(),
                    IdClassificacao: $('[name="IdClassificacao"]').val(),
                    DescricaoObjetoDadoLista: $('input[name="descricao"]').val(),
                    DataCriacao: null,
                    IdUsuarioCriacao: 0,
                    DataAlteracao: null,
                    IdUsuarioAlteracao: 0
                };

                $.ajax({
                    type: "POST",
                    url: "/Classificacao/ParametrosSalvarLista",
                    data: data,
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        $('input[name="descricao"]').val('');
                        $("select#ParametroLista option:selected").removeAttr("selected");
                        items = response;
                        updateParametrosLista(response);
                    }
                });
            }

            $('#modal-dlg-itens select#ParametroLista').on('change', function () {
                $('input[name="descricao"]').val($(this).find('option:selected').text());
            });
        });
    };

    var updateParametrosLista = function (response) {
        var idobjetodados = $('#modal-dlg-itens input[name="idobjetodados"]').val();

        $('#modal-dlg-itens select').html('');
        for (var i = 0; i < response.Labels.length; i++) {
            if (response.Labels[i].IdObjetoDados == idobjetodados) {
                $('#ckTipoLista').prop("checked", response.Labels[i].TipoLista);
                for (var j = 0; j < response.Labels[i].ListaParametroAtendimentoLista.length; j++) {
                    var item = response.Labels[i].ListaParametroAtendimentoLista[j];
                    $('#modal-dlg-itens select').append('<option value="' + item.IdObjtoDadoLista + '">' + item.DescricaoObjetoDadoLista + '</option>');
                }
            }
        }
    };

    var items;

    var updateTipoDado = function (ck) {
        if ($('[name="IdClassificacao"]').val() == undefined || $('[name="IdClassificacao"]').val() == null || $('[name="IdClassificacao"]').val() == "") {
            return;
        }

        var label = ck.parent().parent().find('input[type="text"]');
        var button = ck.parent().parent().find('button');
        var tr = ck.parent().parent();
        var inputCheckLista = ck.parent().parent().find('input[name=listDynamic]:checked');

        var data = {
            Id: ck.prop('idobjetodados') == undefined ? 0 : ck.prop('idobjetodados'),
            idobjetodados: ck.attr('idobjetodados') == undefined ? 0 : ck.attr('idobjetodados'),
            IdObjetoTipoDados: ck.data('id_tipo_objeto_dado'),
            IdClassificacao: $('[name="IdClassificacao"]').val(),
            DescricaoObjeto: label.val() == "" ? label.data('defaultlabel-value') : label.val(),
            TipoLista: (inputCheckLista == undefined ? 0 : 1), // ck.attr('TipoLista') == undefined || ck.attr('TipoLista') == null ? "false" : ck.attr('TipoLista'),
            DataCriacao: null,
            IdUsuarioCriacao: 1,
            DataAlteracao: null,
            IdUsuarioAlteracao: null,
            ObjetoDadosAtivo: ck.is(":checked")
        }

        if (data.TipoLista == "true") {
            $('input#descricao, select#ParametroLista, button#btn-adicionar, button#btn-excluir').removeAttr('disabled');
        } else {
            $('input#descricao, select#ParametroLista, button#btn-adicionar, button#btn-excluir').attr('disabled', 'disabled');
        }

        if (ck.is(":checked")) {
            console.log(data);
            $.ajax({
                type: "POST",
                url: "/Classificacao/ParametrosSalvar",
                data: data,
                dataType: "json",
                success: function (response) {
                    atualizarDados(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });

            tr.css({ 'background-color': '#FFF' });
            label.removeProp('disabled');
            button.removeProp('disabled');
        } else {
            console.log(data);

            $.ajax({
                type: "POST",
                url: "/Classificacao/ParametrosSalvar",
                data: data,
                dataType: "json",
                success: function (response) {
                    atualizarDados(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });

            tr.css({ 'background-color': '#EEE' });
            label.prop('disabled', 'disabled');
            button.prop('disabled', 'disabled');
        }
    }

    var getItem = function (idobjetodados) {
        for (var i = 0; i < items.Labels.length; i++) {
            if (items.Labels[i].IdObjetoDados == idobjetodados) {
                return items.Labels[i];
            }
        }
    };

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PARAMETROS.Init();
});