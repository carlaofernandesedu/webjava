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
        $("#txtEditor").Editor();
        $("#txtEditor2").Editor();
    }

    function bindBotoes() {
        $("#adicionareditor").on("click", function () {
            let texto = $("#origem").val();
            let estaSelecionado = false;
            var object;
            if (window.getSelection) {
                object = window.getSelection();
                let classeEditor = object.anchorNode.parentElement.className;
                if (classeEditor == "row-fluid Editor-container" || classeEditor == "Editor-editor"
                    || object.anchorNode.parentElement == "div.Editor-editor" || classeEditor=="manualadd-editor") {
                    estaSelecionado = true;
                }
            }
            if (estaSelecionado) {
                $("#txtEditor").Editor("insertTextAtSelection", texto);
            }
            else {
                let textoeditor = $("#txtEditor").Editor("getText");
                //let linha = (textoeditor != "") ? "<br>" : "";
                texto = textoeditor + "<div class='manualadd-editor'>" + texto + "</div>";
                $("#txtEditor").Editor("setText", texto);
            }
        });
        $("#adicionareditor2").on("click", function () {
            let texto = $("#origem").val();
            let estaSelecionado = false;
            var object;
            if (window.getSelection) {
                object = window.getSelection();
                let classeEditor = object.anchorNode.parentElement.className;
                if (classeEditor == "row-fluid Editor-container" || classeEditor == "Editor-editor"
                    || object.anchorNode.parentElement == "div.Editor-editor" || classeEditor=="manualadd-editor") {
                    estaSelecionado = true;
                }
            }
            if (estaSelecionado) {
                $("#txtEditor2").Editor("insertTextAtSelection", texto);
            }
            else {
                let textoeditor = $("#txtEditor2").Editor("getText");
                //let linha = (textoeditor != "") ? "<br>" : "";
                texto = textoeditor + "<div class='manualadd-editor'>" + texto + "</div>";
                $("#txtEditor2").Editor("setText", texto);
            }
        });
        $("#contadoreditor").on("click", function () {
            let caracteres = $("#txtEditor").Editor("getCharCount");
            alert(caracteres);
        });
        $("#contadoreditor2").on("click", function () {
            let caracteres = $("#txtEditor2").Editor("getCharCount");
            alert(caracteres);
        });
    }

    return {
        Init:init
    }

}());
$(function () {
    VALIDAEDITOR.Init();
});