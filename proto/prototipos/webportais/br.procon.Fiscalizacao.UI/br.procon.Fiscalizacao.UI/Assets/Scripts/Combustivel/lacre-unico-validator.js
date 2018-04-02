jQuery(document).ready(function () {
    jQuery.validator.addMethod("lacreunico", function (value, element, params) {
        return $.ajax({
            url: '/Lacre/ValidarDuplicidade',
            data: { lacre: value, id: $(element).attr('data-id-lacre') },
            async: false
        }).responseText === "true";
    });
    $.validator.unobtrusive.adapters.add("lacreunico", function (options) {
        options.onkeyup = false;
        options.rules["lacreunico"] = true;
        options.messages["lacreunico"] = options.message;
    });
});