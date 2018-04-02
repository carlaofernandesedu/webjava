jQuery(document).ready(function () {
    jQuery(".chk24h").change(function () {
        if (jQuery(this).is(":checked")) {
            jQuery(this).parent().parent().parent().parent().find(".horainicio").val("00:00").attr("readonly", "readonly");
            jQuery(this).parent().parent().parent().parent().find(".horafim").val("23:59").attr("readonly", "readonly");
        }
        else {
            jQuery(this).parent().parent().parent().parent().find(".horainicio").val("00:00").removeAttr("readonly");
            jQuery(this).parent().parent().parent().parent().find(".horafim").val("23:59").removeAttr("readonly");
        }
    });


    jQuery('#chkSegunda').change(function () {
        jQuery('#divSegunda').toggle(jQuery('#chkSegunda').attr('checked'));
    })
    jQuery('#chkTerca').change(function () {
        jQuery('#divTerca').toggle(jQuery('#chkTerca').attr('checked'));
    })
    jQuery('#chkQuarta').change(function () {
        jQuery('#divQuarta').toggle(jQuery('#chkQuarta').attr('checked'));
    })
    jQuery('#chkQuinta').change(function () {
        jQuery('#divQuinta').toggle(jQuery('#chkQuinta').attr('checked'));
    })
    jQuery('#chkSexta').change(function () {
        jQuery('#divSexta').toggle(jQuery('#chkSexta').attr('checked'));
    })
    jQuery('#chkSabado').change(function () {
        jQuery('#divSabado').toggle(jQuery('#chkSabado').attr('checked'));
    })
    jQuery('#chkDomingo').change(function () {
        jQuery('#divDomingo').toggle(jQuery('#chkDomingo').attr('checked'));
    })

});

function GetModulosRecursos(sender) {
    $.ajax({
        url: "/Parada/GetModulosRecursos",
        data: { modulos: jQuery(sender).val() },
        method: "POST",
        success: function (result) {
            $('#lstRecurso').html("");
            $.each(result, function (i, field) {
                $('#lstRecurso').append($('<option>', {
                    value: field.Codigo,
                    text: (field.AplicacaoRecurso)
                }));
            });
        }

    });
}

function SelecionaTipoParada(sender) {
    if (jQuery(sender).val() == "0") {
        //modulo
        jQuery("#lstRecurso").attr("disabled", "disabled");
        jQuery("#lstRecurso").val("");
    }
    else {
        //recurso
        jQuery("#lstRecurso").removeAttr("disabled");
    }
}

function Validar() {
    //field-validation-error
    if (jQuery("#Ocorrencia").val() == 0) {
        if (jQuery("#DataInicio").val() == "")
            jQuery("#DataInicio").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Data Inicio é de preenchimento obrigatório.");
        else
            jQuery("#DataInicio").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");

        if (jQuery("#HoraInicio").val() == "")
            jQuery("#HoraInicio").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Hora Inicio é de preenchimento obrigatório.");
        else
            jQuery("#HoraInicio").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");

        if (jQuery("#DataFim").val() == "")
            jQuery("#DataFim").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Data Fim é de preenchimento obrigatório.");
        else
            jQuery("#DataFim").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");

        if (jQuery("#HoraFim").val() == "")
            jQuery("#HoraFim").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Hora Fim é de preenchimento obrigatório.");
        else
            jQuery("#HoraFim").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
    }
    else {
        jQuery("#DataInicio").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
        jQuery("#HoraInicio").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
        jQuery("#DataFim").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
        jQuery("#HoraFim").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
    }

    if (jQuery("#TipoParada").val() == 1) {
        if (jQuery("#lstRecurso").val() == null) {
            jQuery("#lstRecurso").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Recurso é de preenchimento obrigatório.");
        }
        else {
            jQuery("#lstRecurso").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
        }
    }
    else {
        jQuery("#lstRecurso").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
    }

    if (jQuery("#lstModulo").val() == null) {
        jQuery("#lstModulo").next().removeClass("field-validation-valid").addClass("field-validation-error").html("O campo Módulo é de preenchimento obrigatório.");
    }
    else {
        jQuery("#lstModulo").next().removeClass("field-validation-error").addClass("field-validation-valid").html("");
    }

    if (jQuery(".panel-body form .field-validation-error").length > 0) {
        return false;
    }
    else {
        return true;
    }
}