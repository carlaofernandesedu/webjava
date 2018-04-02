CONDUTA = (function () {

    function Init() {
        bindAll();
    }

    function bindAll() {
        //limparCampos();
        removerPlaceHolderDeInteiro();
        selecionarLei($('#Lei').val());
        selecionarGrupo($('#Grupo').val());

        $("#ComboLei").change(function () {
            $('#Lei').val($('#ComboLei').val());
        });
        $("#ComboGrupo").change(function () {
            $('#Grupo').val($('#ComboGrupo').val());
        });
    }

    function limparCampos() {
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
    }


    function removerPlaceHolderDeInteiro() {
        $(".inteiro").removeAttr('placeholder');
    }

    function selecionarLei(valor) {
        $('#ComboLei option[value="' + valor+ '"]').attr('selected', 'selected');
    }
    function selecionarGrupo(valor) {
        $('#ComboGrupo option[value="' + valor + '"]').attr('selected', 'selected');
    }
    return {
        Init: function () {
            Init();
        },
        LimparCampos:  limparCampos
    }

}());

$(function () {
    CONDUTA.Init();
});



//$(function () {
//    $('#txtCodigo').val('');
//    $('#txtLei').val('');
//    $('#txtAno').val('');
//    $('#txtNumeroArtigo').val('');

//    if ($('#Codigo').val() == 0) {
//        $('#CodigoConduta').val('');
//        $('#Lei').val('');
//        $('#Ano').val('');
//        $('#Artigo').val('');
//    }
//});


