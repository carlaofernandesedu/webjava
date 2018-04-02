ATENDIMENTOSAZONAL = (function () {
    var init = function () {

        atualizaTabela($('#tbl-data-fornecedor').data('tbl'));
        atualizaMascara($('input[name="docfornecedor"]').val());

        bindAll();
    };

    function bindAll() {
        bindTiposDocumentos();
        bindAdicionarFornecedor();
        bindObterFornecedorAutoComplete();
    }

    var bindTiposDocumentos = function () {
        $('input[name="docfornecedor"]').unbind('change').bind('change', function () {
            atualizaMascara( $(this).val() );
        });
    };


    function bindObterFornecedorAutoComplete() {
        $("#txtFornecedorNome", "#form-atendimento-sazonal").typeahead({
            onSelect: function (item) {
                $("#txtFornecedorNome", "#form-atendimento-sazonal").val('');
                fornecedorIncluir(item.value);
            },
            ajax: {
                url: '/Fornecedor/ObterFornecedorAutoComplete/',
                triggerLength: 2,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        filtro: query
                    }
                },
                preProcess: function (data) {
                    return data;
                }
            }
        });
    }

    function bindAdicionarFornecedor() {
        $('#form-atendimento-sazonal').on('click', '#btnAdicionarFornecedor', function () {
            var id = document.getElementById('numero_documento').value;
            fornecedorLocalizar(id);
        });
    }

    var atualizaMascara = function ( value ) {
        $('input[name="numero_documento"]').unmask();
        if (value == "CNPJ") {
            $('input[name="numero_documento"]').mask('99.999.999/9999-99');
        } else {
            $('input[name="numero_documento"]').mask('999.999.999-99');
        }
    };

    var fornecedorLocalizar = function (documento) {
        $.ajax({
            type: "POST",
            url: "/Fornecedor/GetFornecedorPorDocumento",
            data: { "documento": documento },
            dataType: "json",
            success: function (response) {
                fornecedorIncluir(response.Codigo);
            },
            error: function (response) {
                bootbox.alert({ title: 'Fornecedor', message: 'Fornecedor não encontrado!', size: 'small' });
            }
        });
    };

    var fornecedorIncluir = function (Id) {
        $.ajax({
            type: "POST",
            url: "/AtendimentoSazonal/FornecedorIncluir",
            data: { "Id":0, "IdFornecedor": Id },
            dataType: "json",
            success: function (response) {
                atualizaTabela(response);
            }
        });
    };

    var fornecedorExcluir = function (Id) {
        $.ajax({
            type: "POST",
            url: "/AtendimentoSazonal/FornecedorExcluir",
            data: {"IdFornecedor": Id},
            dataType: "json",
            success: function (response) {
                atualizaTabela(response);
            }
        });
    };

    var atualizaTabela = function (response) {
        $('#tbl-data-fornecedor tbody').empty();
        var html = '';
        for (var i = 0; i < response.length; i++) {

            var classe = response[i].cnpj_fornecedor.length == 14 ? 'cnpj' : 'cpf';

            html += "<tr>";
            html += "   <td> <input type='hidden' value='" + response[i].id_fornecedor + "' name='Fornecedores[" + i + "].id_fornecedor'/> <span class='" + classe + "'>" + response[i].cnpj_fornecedor + "</span></td>";
            html += "   <td>" + response[i].no_fornecedor + "</td>";
            html += "   <td class='text-center'> " + '<button type="button" class="btn btn-danger btn-xs" onclick="ATENDIMENTOSAZONAL.FornecedorExcluir(' + response[i].id_fornecedor + ')" ><i class="fa fa-trash"></i></button>' + "</td>";
            html += "</tr>";
        }
        $('#tbl-data-fornecedor tbody').append(html);
    };

    
    var atendimentoSalvar = function ()
    {

        var $form = $('#form-atendimento-sazonal');

        $.validator.unobtrusive.parse();
        $form.validate();

        if ($form.valid())
        {

            $.ajax({
                type: "POST",
                url: "/AtendimentoSazonal/Salvar",
                data: $('#form-atendimento-sazonal').serialize(),
                success: function (response) {
                    window.location = "/AtendimentoSazonal/";
                }
            });
        }
    };

    

    var atendimentoCancelar = function ()
    {
        $.ajax({
            type: "POST",
            url: "/AtendimentoSazonal/Cancelar",
            data: $('#form-atendimento-sazonal').serialize(),
            success: function (response) {
                window.location = "/AtendimentoSazonal/";
            }
        });
    };

    return {
        Init: init,
        AtendimentoSalvar: atendimentoSalvar,
        AtendimentoCancelar: atendimentoCancelar,
        FornecedorIncluir: fornecedorIncluir,
        FornecedorExcluir: fornecedorExcluir,
        FornecedorLocalizar: fornecedorLocalizar
    }

}());

$(function () {
    ATENDIMENTOSAZONAL.Init();
});