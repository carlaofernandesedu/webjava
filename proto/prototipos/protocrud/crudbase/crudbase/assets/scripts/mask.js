$(document).ready(function () {
    AplicarMascaras();
    jQuery.extend(jQuery.validator.messages, {
        email: "Digite um email válido."
    });
});

var maskBehaviorTel = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},
    options = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskBehaviorTel.apply({}, arguments), options);
        }
    };

var maskBehaviorTelSemDDD = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(99) 00000-0000' : '(99) 0000-00009';
},
    optionsSemDDD = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskBehaviorTelSemDDD.apply({}, arguments), options);
        }
    };

function AplicarMascaras() {
    $('.rg').mask('00.000.000-AAA');
    $('.cep').mask('00000-000', { placeholder: '_____-___' });
    $('.cpf').mask('000.000.000-00', { placeholder: '___.___.___-__' });
    $('.cnpj').mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
    $('.tel').mask(maskBehaviorTel, options);
    $('.cel').mask(maskBehaviorTel, optionsSemDDD);
    $('.tel_sem_ddd').mask(maskBehaviorTelSemDDD, optionsSemDDD);
    $('.real').mask('R$ 000.000.000.000.000,00', { reverse: true });
    $('.number').mask('0000000000', { placeholder: '0000000000' });
    $('.protocolo_ano').mask('000000/0000', { reverse: true, placeholder: '______/____', maxlength: 11 });
    $('.protocolo').mask('0000000', { placeholder: '0000000' });
    $('.serie_documental').mask('00.00.00.00', { placeholder: '__.__.__.__' });
    $('.numeroVolume').mask('00000', { placeholder: '00000' });
    $('.inteiro').mask('0000000000000');
    $('.inteiro_curto').mask('00000');
    $('.data').mask('00/00/0000', { placeholder: '__/__/____', minDate: new Date(1999, 12, 31), maxDate: '+50Y' });
    $('.dataCuston').mask('00/00/0000', { placeholder: '__/__/____', minDate: new Date(1999, 12, 31), maxDate: '+50Y' });
    $(".hora").mask('00:00', { placeholder: '__:__' });
    $('.ano').mask('0000', { placeholder: '____', minDate: new Date(1999), maxDate: '+50Y' });
    $('.ap').mask('00.000.000-0', { placeholder: '__.___.___-_' });
    $('.placaCarro').mask('SSS-0000', { placeholder: '___-____' });
    $('.cnae').mask('0000-0/00', { placeholder: '____-_/__' });
    $('.ie').mask('000.000.000.000', { placeholder: '___.___.___.___' });
    $('.massaespecifica').mask('9,0000', { placeholder: '_,____' });
    $(".temperatura").mask('9999,0');
    $('.percentual').mask('99,00', { placeholder: '__,__' });
    $(".decimal6-3").mask('999,999', { placeholder: '___,___' });
    $(".decimal10-3").mask('9999999,000');
    $(".decimal7-2").mask('9999999,00');
    $(".milhar").mask('###.###.###.##0', { reverse: true });
    $('.anp').mask('SS-000000000', { placeholder: '__-_________' });
    $(".lacre").mask('AAAAAAAAAA');
    $(".notafiscal").mask('AAA.AAA.AAA', { placeholder: '___.___.___' });
    $('.fonecel').mask(maskBehaviorTel, { optional: false });
    $('.numerorfc').mask('0000-00', { optional: false });

    $('.numeroTanque').mask('AAAAAAAAAA');
    $('.serie-bomba-bico').mask('AAAAAAAAAAA(00)', { placeholder: "Ex.: D5F165D1F65(48)" });
    $('.serie-bomba').mask('ZZZZZZZZZZA', { placeholder: "Ex.: D5F165D1F65", translation: { 'Z': { pattern: /[A-Za-z0-9]/, optional: true } } });
    $('.numero-bomba-bico').mask('00', { placeholder: "Ex.: 42" });
    $('.leituraEncerramentoBico').mask('0000000,00', { reverse: true });
    $('.numero-2').mask('00', { placeholder: "Ex.: 10" });

    $(".texto").keypress(function (event) {
        var regex = new RegExp("^[a-zA-Z\u00C0-\u00FF ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    $(".numero").keypress(function (event) {
        var regex = new RegExp("^[0-9 ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    jQuery(".tel").each(function () {
        $(this).rules("add", {
            minlength: 14,
            messages: {
                minlength: "Telefone inválido"
            }
        });
    });

    jQuery(".cel").each(function () {
        $(this).rules("add", {
            minlength: 14,
            messages: {
                minlength: "Telefone inválido"
            }
        });
    });

    $(".rg-ie").keypress(function () {
        if (this.value.length > 10) {
            $('#txtRGIE').mask('000.000.000.000', { placeholder: '___.___.___-__' });
        }
    });

    $(".cpf-cnpj").keypress(function () {
        if (this.value.length < 14) {
            $('#txtCPFCNPJ').mask('000.000.000-00', { placeholder: '___.___.___-__' });
        }
        else {
            $('#txtCPFCNPJ').mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
        }
    });
}

var MASCARAS = (function () {
    function cpfCnpj() {
        $(".cpf-cnpj2").keypress(function () {
            if (this.value.length < 14) {
                $(this).mask('000.000.000-00', { placeholder: '___.___.___-__' });
            }
            else {
                $(this).mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
            }
        });
    }

    return {
        CPFCPNJ: cpfCnpj
    }
}());