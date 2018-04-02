$(function () {
    $('#txtDrt').val('');

    $('#Bairro').attr('readonly', false);
    $('#Municipio').attr('readonly', false);

    if ($('#Codigo').val() == 0) {
        $('#Drt').val('');
    }
});


