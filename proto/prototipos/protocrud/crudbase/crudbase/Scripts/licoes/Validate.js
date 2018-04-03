'use strict';
//https://jqueryvalidation.org/validate/
$.validator.addMethod("campoigual", function (value,element,param) {
    return value == param;
}
);


$(function () {
    $("form[name='registration']").validate({
        rules: {
            firstname: "required",
            lastname: {
                required: true,
                campoigual: "Fernandes"
            },
            password: {
                minlength: 5,
                required: true
            }
        },
        messages: {
            firstname: "Informe o primeiro nome",
            lastname: {
                required: "Informe o ultimo nome",
                campoigual: "O valor dele ser Fernandes"
            },
            password : "Informe o password"
        },
        submitHandler(form) {
            form.submit();
        }
    });
});