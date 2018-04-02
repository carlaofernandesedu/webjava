function CarregarAplicacoes(sender) {
    $('.ddlAplicacao').html("").append($('<option value>--Selecione--</option>'))
    $('.ddlRecurso').html("").append($('<option value>--Selecione--</option>'))
    if (jQuery(sender).val() == "")
        return;

    $.ajax({
        url: "/Noticia/CarregarAplicacoes",
        data: { idEmpresa: jQuery(sender).val() },
        method: "POST",
        cache: false,
        success: function (result) {

            $.each(result, function (i, field) {
                $('.ddlAplicacao').append($('<option>', {
                    value: field.Codigo,
                    text: field.Descricao
                }));
            });
        }

    });
}

function CarregarRecursos(sender) {
    $.ajax({
        url: "/Noticia/CarregarRecursos",
        data: { id_aplicacao: sender.value },
        method: "POST",
        success: function (result) {
            $('.ddlRecurso').html("").append($('<option value>--Selecione--</option>'))
            $.each(result, function (i, field) {
                $('.ddlRecurso').append($('<option>', {
                    value: field.Codigo,
                    text: field.URL
                }));
            });
        }

    });
}

$(function () {
    CONTROLES.Plugins.WYSIWYG();

    jQuery("form").submit(function () {
        if (jQuery("#Corpo").val() == "<br>") {
            //IE Hack
            jQuery("#Corpo").val("");
        }
    });
});