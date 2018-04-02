FILTROCOMBUSTIVEL = (function () {

    function Init() {
        bindAll();
    }

    function bindAll() {
        console.log('bindAll');
        bindValidarAP();
        bindValidarCNPJ();
        bindInicializarTabela();
    }


    function bindValidarAP() {
        $(".validaAP").blur(function () {
            if (validarAP() === false) {
                BASE.MostrarMensagemErro("Digito verificador de AP inválido.")
            }
        });
    }

    function bindValidarCNPJ() {
        $(".data-validarCNPJ").blur(function () {
            checarCNPJ();
        });
    }
    
    function validarDados() {
        var retorno = null;

        var apValido = validarAP();
        if (apValido === false) {
            return false;
        } else if (apValido === true) {
            retorno = true;
        }

        var cnpjValido = checarCNPJ();
        if (cnpjValido == false) {
            return false;
        } else if (cnpjValido === true) {
            retorno = true;
        }
        return retorno;
    }

    function validarAP() {
        if ($(".validaAP").val() != "") {
            var digito = $(".validaAP").val().substring(11, 12);
            var valido = validarVerificador($(".validaAP").val().replace('.', '').replace('.', ''));
            if (digito != valido) {
                return false;
            } else {
                return true;
            }
        }
        return null;
    }

    function checarCNPJ() {
        var cnpj = $(".cnpj").val();
        if ($(".cnpj").val() != "") {
            if (!validarCNPJ(cnpj)) {
                BASE.MostrarMensagemErro('CNPJ inválido.');
                return false;
            } else {
                return true;
            }
        } else {
            return null;
        }
    }

    function validarVerificador(apuracao) {
        var coef = "23456789";
        var k = 0;
        var r = 0;
        var T = 0;

        apuracao = apuracao.substring(0, 2) + parseInt(apuracao.substring(2, 8));

        for (k = 1; k <= 8; k++) {
            T = T + apuracao.substr(k - 1, 1) * coef.substr(k - 1, 1);
        }
        r = T % 11
        if (r < 2) {
            return 0;
        }
        else {
            return 11 - r;
        }
    }

    function bindValidarDados() {
        $(".data-validardados").off("click");
        $(".data-validardados").on("click", function () {
            if (validarDados() != true) {
                return false;
            }
        });
    }

    function bindInicializarTabela() {
        $('#tblRFC').dataTable({

            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [{ "bSortable": false, "aTargets": ["no-sort"] },
                             { "word-wrap": "break-word", "aTargets": ["col-wrap"] },
                             { "sType": "ordemData", "aTargets": [0] }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "desc"]],

            /*Resposividade da tabela*/
            responsive: false,
        });
    }

    return {
        Init: function () {
            Init();
        },
        ChecarCNPJ: checarCNPJ
    }

}());

$(function () {
    FILTROCOMBUSTIVEL.Init();
});