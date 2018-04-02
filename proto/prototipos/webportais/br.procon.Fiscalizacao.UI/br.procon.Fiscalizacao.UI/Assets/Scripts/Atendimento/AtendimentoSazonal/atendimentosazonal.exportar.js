ATENDIMENTOSAZONAL = (function () {
    var init = function ()
    {
        pesquisar();
        bindPesquisar();
    };

    var bindPesquisar = function(){
        $('#btnFiltrar').off('click');
        $('#btnFiltrar').on('click', function () {
            pesquisar();
        });
    };

    var pesquisar = function () {
        
        $.ajax({
            type: "POST",
            url: "/AtendimentoSazonal/PesquisarFornecedor",
            data: $('#form-pesquisar-fornecedor').serialize(),
            success: function (response) {
                console.log('sucesso');
                $('#lista-dados').html(response);
                $('#lista-dados table').dataTable();
            },
            error: function (textStatus, errorThrown) {
                console.log('error');
            }
        });
    };
    
    return {
        Init: init
    }

}());

$(function () {
    ATENDIMENTOSAZONAL.Init();
});