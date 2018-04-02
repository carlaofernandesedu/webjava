var GRUPOATENDIMENTO = (function () {

    var validate = {};

    var init = function ()
    {
        bindDetalhes();
    };


    var bindDetalhes = function () {
        $('button[name="detalhes"]').unbind('click').bind('click', function () { 

            var obj = $(this).data('object');

            $('#tbl-detalhes #td-id_grupo_atendimento').html(obj.id_grupo_atendimento);
            $('#tbl-detalhes #td-no_grupo_atendimento').html(obj.no_grupo_atendimento);
            $('#tbl-detalhes #td-ds_grupo_atendimento').html(obj.ds_grupo_atendimento);
            $('#tbl-detalhes #td-id_tipo_atendimento').html(obj.id_tipo_atendimento == 1 ? 'Consulta' : 'Atendimento');
            $('#tbl-detalhes #td-bl_atendimento_preferencial').html(obj.bl_atendimento_preferencial ? 'SIM' : 'NÃO');
            $('#tbl-detalhes #td-bl_ativo').html(obj.bl_ativo ? 'SIM' : 'NÃO');
            $('#tbl-detalhes #td-classificacao-NomeCompleto').html(obj.classificacao.NomeCompleto);
            $('#tbl-detalhes #td-fornecedor-Nome').html(obj.fornecedor.Nome);
            $('#tbl-detalhes #td-cnae-Descricao').html(obj.cnae.Descricao);

            $('#modal-detalhes').modal('show');

        });
    };

    return {
        Init: function () {
            init();
        }
    };

}());


$(function () {
    GRUPOATENDIMENTO.Init();
});