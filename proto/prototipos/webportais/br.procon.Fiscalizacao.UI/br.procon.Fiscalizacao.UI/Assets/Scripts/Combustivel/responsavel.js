RESPONSAVEL = (function () {

    function init() {
        var validator = $('#frmAutoDeslacracao').validate();

        if (validator !== undefined) {
            validator.resetForm();
            validator.reset();
        }
    }

    function removerObrigatoriedade() {
        $('.div-responsavel-obrigatorio-condicional .obrigatorio-condicional').each(function () {
            var self = $(this);
            self.valid();
            self.rules('remove', 'required');
            self.removeClass('input-validation-error');
        });

        $('.div-responsavel-obrigatorio-condicional .field-validation-error').hide();
    }

    function adicionarObrigatoriedade() {
        jQuery(".div-responsavel-obrigatorio-condicional .obrigatorio-condicional").each(function () {
            var self = $(this);
            self.rules("add", {
                required: true,
                messages: {
                    required: "Este campo deve ser preenchido"
                }
            });
            self.valid();
        });
        $('.div-responsavel-obrigatorio-condicional .field-validation-error').show();
    }

    return {
        Init: init,
        RemoverObrigatoriedade: removerObrigatoriedade,
        AdicionarObrigatoriedade: adicionarObrigatoriedade
    }
}());