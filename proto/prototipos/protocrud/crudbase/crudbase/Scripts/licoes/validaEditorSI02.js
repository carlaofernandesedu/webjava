'use strict';
var VALIDAEDITOR = (function () {

    function init()
    {
        bindAll();
    }

    function bindAll()
    {
            bindEditores();
            bindBotoes();
    }

    function bindEditores()
    {
        $('[name="Resposta"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": false,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": false,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $('[name="Resposta"]').Editor("setText", "CABECALHO<BR>insiraTextoPadrao<br>RODAPE");
    }

    function bindBotoes() {
        $("#habilitarcheckbox").off("click");
        $("#habilitarcheckbox").on("click", function(){
            $('input[type="checkbox"]').prop('disabled', false);
        }
         );

        $("#confirmarRespostaPadrao").off("click");
        $("#confirmarRespostaPadrao").on("click", function () {
            //versaoAtual();
            versaoRevisada();
            //let texto = $("#origem").val();
            //let estaSelecionado = false;
            //var object;
            //if (window.getSelection) {
            //    object = window.getSelection();
            //    let classeEditor = object.anchorNode.parentElement.className;
            //    if (classeEditor == "row-fluid Editor-container" || classeEditor == "Editor-editor"
            //        || object.anchorNode.parentElement == "div.Editor-editor" || classeEditor=="manualadd-editor") {
            //        estaSelecionado = true;
            //    }
            //}
            //if (estaSelecionado) {
            //    $("#txtEditor").Editor("insertTextAtSelection", texto);
            //}
            //else {
            //    let textoeditor = $("#txtEditor").Editor("getText");
            //    //let linha = (textoeditor != "") ? "<br>" : "";
            //    texto = textoeditor + "<div class='manualadd-editor'>" + texto + "</div>";
            //    $("#txtEditor").Editor("setText", texto);
            //}
        });
    }

    function versaoRevisada() 
    {
        let estaSelecionado = false;
        var object;
        //if (window.getSelection) {
        //    object = window.getSelection();
        //    let classeEditor = object.anchorNode.parentElement.className;
        //    if (classeEditor == "row-fluid Editor-container" || classeEditor == "Editor-editor"
        //        || object.anchorNode.parentElement == "div.Editor-editor" || classeEditor=="manualadd-editor") {
        //        estaSelecionado = true;
        //    }
        //}
        //if (estaSelecionado) {
        //    $("#txtEditor").Editor("insertTextAtSelection", texto);
        //}
        if ($('input[name=selectedResposta]:checked').length == 0)
            return;

        var textoeditor = $('[name="Resposta"]').Editor("getText");
        
        //var txtaResposta = $(" .Editor-editor #span_mensagem_padrao");

        //if (txtaResposta.length === 0) {
        //    txtaResposta = $(" .Editor-editor");
        //}


        var chechtexto = "";
        $('input[name=selectedResposta]:checked').each(function () {
            chechtexto = chechtexto + "<div class='manualadd-editor'>" + $(this).closest("div[class=row]").find('#span_descricao').html() + "</div>";
            //$('input[type="checkbox"]').prop('disabled', true);
        });
        $('input[name=selectedResposta]:checked').each(function () {
            $(this).prop('checked', false);
        });
        //var texto = textoeditor + "<div class='manualadd-editor'>" + chechtexto + "</div>";
        var texto = textoeditor.search(/insiratextopadrao/i) == -1 ? textoeditor + chechtexto : textoeditor.replace(/insiratextopadrao/i, chechtexto);
        //var texto = chechtexto;
        //txtaResposta.html(txtaResposta.html() + texto);
        //txtaResposta.val(texto);
        //var controles = ;
        //controles.val(texto);

        //if (controles.hasClass('editorwysiwyg') || controles.next('.Editor-container').length === 1) {
        //    controles.Editor('setText', texto);
        //}

        $('[name="Resposta"]').Editor("setText", texto);
        
    }

    function versaoAtual()
    {
        var txtaResposta = $(" .Editor-editor #Editor-editor");
        txtaResposta.focus();
        if (txtaResposta.length === 0) {
            txtaResposta = $(" .Editor-editor");
        }
        var texto = '<p>' + $('textarea[name="Resposta"]').val() + '</p>';
        var chechtexto = "";
        //txtaResposta = $(" .Editor-editor");
        $('input[name=selectedResposta]:checked').each(function () {
            chechtexto = chechtexto + $(this).closest("div[class=row]").find('#span_descricao').html() + "<br/>";
            $('input[type="checkbox"]').prop('disabled', true);
        });
        txtaResposta.html(texto + '<br>' + chechtexto);
    }

    return {
        Init:init
    }

}());
$(function () {
    VALIDAEDITOR.Init();
});