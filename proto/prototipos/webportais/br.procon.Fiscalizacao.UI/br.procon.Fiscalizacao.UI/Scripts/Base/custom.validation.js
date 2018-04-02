$.validator.addMethod('requiredif', function (value, element, parameters) {
    var desiredvalue = parameters.desiredvalue;
    var operation = parameters.operation;
    desiredvalue = (desiredvalue == null ? '' : desiredvalue).toString();
    var id = parameters.dependentproperty;
    var controle = $(element).closest('.row').find("[id$='" + id + "']");

    var controlType = controle.is('select') ? "select" : controle.attr('type');
    var actualvalue = {}
    if (controlType == "checkbox" || controlType == "radio") {
        var control = $(id + ":checked");
        actualvalue = control.val();
    } else {
        actualvalue = controle.val();
    }

    switch (operation) {
        case "Equals":
            if ($.trim(desiredvalue).toLowerCase() === $.trim(actualvalue).toLocaleLowerCase()) {
                var isValid = $.validator.methods.required.call(this, value, element, parameters);
                return isValid;
            }
            break;
        case "Different":
            if ($.trim(desiredvalue).toLowerCase() !== $.trim(actualvalue).toLocaleLowerCase()) {
                var isValid = $.validator.methods.required.call(this, value, element, parameters);
                return isValid;
            }
            break;
        case "HasValue":
            if (actualvalue !== undefined && actualvalue !== null && actualvalue !== false && actualvalue.length > 0) {
                var isValid = $.validator.methods.required.call(this, value, element, parameters);
                return isValid;
            }
            break;
        default:
            break;
    }
    return true;
});

$.validator.unobtrusive.adapters.add('requiredif', ['dependentproperty', 'desiredvalue', 'operation'], function (options) {
    options.rules['requiredif'] = options.params;
    options.messages['requiredif'] = options.message;
});

$.validator.addMethod("dateBR", function (value, element) {
    
    if (value.length != 10) return false;
    // verificando data
    var data = value;
    var dia = data.substr(0, 2);
    var barra1 = data.substr(2, 1);
    var mes = data.substr(3, 2);
    var barra2 = data.substr(5, 1);
    var ano = data.substr(6, 4);

    if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return false;

    if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return false;
    if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return false;

    if (ano < 1900) return false;  

    if ((parseInt(dia) > new Date($.now()).getDate())
        && (parseInt(mes) >= new Date($.now()).getMonth() + 1)
        && (parseInt(ano) >= new Date($.now()).getFullYear()))
        return false;

    return true;
}, "Informe uma data válida");

$.validator.addMethod("horaValida", function (value, element) {
    if (value.length != 5) return false;
    // verificando hora
    var hora = value;
    var hrs = hora.substring(0, 2);
    var min = hora.substring(3, 5);
    if ((hrs < 00) || (hrs > 23) || (min < 00) || (min > 59)) return false;
    if (hora.value == "") return false;
    return true;
}, "Informe uma hora válida");

$.validator.addMethod("serieValida", function (value, element) {
    if (value.length < 2) return false;
    //verifica se contem 1 letra e 1 numero
    //var regExp = /[A-Z]{1}\d{1}/g;
    var regExp = / [a-zA-Z]{1}\d{1}/g;
    if (regExp.test(value)) return false;
    return true;
}, "Informe uma série válida");

jQuery.validator.addMethod('celular', function (value, element) {

    value = value.replace("(", "");
    value = value.replace(")", "");
    value = value.replace("-", "");
    value = value.replace(" ", "").trim();
    if (value == '0000000000') {
        return (this.optional(element) || false);
    } else if (value == '00000000000') {
        return (this.optional(element) || false);
    }
    if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
        return (this.optional(element) || false);
    }
    if (value.length < 10 || value.length > 11) {
        return (this.optional(element) || false);
    }
    if (["6", "7", "8", "9"].indexOf(value.substring(2, 3)) == -1) {
        return (this.optional(element) || false);
    }
    return (this.optional(element) || true);
}, 'Informe um celular válido');

//Telefone fixo
jQuery.validator.addMethod('telefone', function (value, element) {
    value = value.replace("(", "");
    value = value.replace(")", "");
    value = value.replace("-", "");
    value = value.replace(" ", "").trim();
    if (value == '0000000000') {
        return (this.optional(element) || false);
    } else if (value == '00000000000') {
        return (this.optional(element) || false);
    }
    if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
        return (this.optional(element) || false);
    }
    if (value.length < 10 || value.length > 11) {
        return (this.optional(element) || false);
    }
    if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
        return (this.optional(element) || false);
    }
    return (this.optional(element) || true);
}, 'Informe um telefone válido');

//Fax
jQuery.validator.addMethod('fax', function (value, element) {
    value = value.replace("(", "");
    value = value.replace(")", "");
    value = value.replace("-", "");
    value = value.replace(" ", "").trim();
    if (value == '0000000000') {
        return (this.optional(element) || false);
    } else if (value == '00000000000') {
        return (this.optional(element) || false);
    }
    if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
        return (this.optional(element) || false);
    }
    if (value.length < 10 || value.length > 11) {
        return (this.optional(element) || false);
    }
    if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
        return (this.optional(element) || false);
    }
    return (this.optional(element) || true);
}, 'Informe um fax válido');

$.validator.addMethod('required', function (value, element, parameters) {

    if (value == null || value == undefined) {
        return false;
    }
    return ("" + value).trim().length > 0;
});

//$.validator.addMethod('data', function (value, element, parameters) {

//    if (value == null || value == undefined) {
//        return false;
//    }
//    return ("" + value).trim().length > 0;
//});

jQuery.validator.addMethod("datemustbeequalorgreaterthancurrentdate", function (value, element, param) {
    var d = value.split('/');
    var someDate = new Date(d[2], d[1]-1, d[0]);
    var currentDate = new Date();

    if (someDate < currentDate) {
        return false;
    }
    return true;
});

jQuery.validator.unobtrusive.adapters.addBool("datemustbeequalorgreaterthancurrentdate");