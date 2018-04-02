$(document).ready(function () {   

    $("#DocAnoMovimentacao").val($("#Ano").val());
    $("#IdDocumentoMov").val($("#Numero").val());

    if($("#Situacao").val() == 'Cadastrado')
    {
        $("#btnConcluir").prop("disabled", true);
    }

});

function LimpaCamposConcluir() {
    $("#DsMovimentacao").val("");
}

function MostraHistorico() {
    $('#divTabelaHistorico').slideToggle();
}

function ConcluirCadastro()
{
    $("#formConcluirCadastro").submit();
}

var CancelarOperacaoConcluir = function () {
    window.location.href = "/";
    BASE.MostrarMensagem("Operação cancelada com sucesso!", TipoMensagem.Sucesso);
}
