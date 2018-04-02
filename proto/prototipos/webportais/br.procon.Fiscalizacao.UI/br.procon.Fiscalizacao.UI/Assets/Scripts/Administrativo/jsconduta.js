$(function () {
    $('#txtCodigo').val('');
    $('#txtLei').val('');
    $('#txtAno').val('');
    $('#txtNumeroArtigo').val('');

    if ($('#Codigo').val() == 0) {
        $('#CodigoConduta').val('');
        $('#Lei').val('');
        $('#Ano').val('');
        $('#Artigo').val('');
    }
});


