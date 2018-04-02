PREVISUALIZARAUTO = (function () {

    var form = null;

    function init() {

        REGISTRARAUTO.PreCarregar = function () { return false };
        REGISTRARAUTO.TratamentosEspecificos = function () { return false };
        bindAll();
    }

    function bindAll() {
        bindSalvar();
        bindClickVoltar();
        previsualizarInformacoes();

    }

    function bindSalvar() {
        $("#btnSalvar").off('click');
        $("#btnSalvar").on('click', function () {
            salvar();

        });
    }

    function bindClickVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {

            var indice = $(this).data('indice');
            REGISTRARAUTO.AbreFrame(indice);

            REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #previaAuto');
            REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #infAuto');
        });
    }

    function previsualizarInformacoes() {

        campos = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

        $.each(campos, function (index, value) {
            $('#' + index).html(value);

        });

        $('#FiscalAutuante').html(campos.NomeFiscalResponsavel.substr(8));
        $('#DocumentoFiscalAutuante').html(campos.NomeFiscalResponsavel.substr(0, 5));
        $('#TipoAutoLabel').html(REGISTRARAUTO.EnumTipoAuto(campos.TipoAuto));

        var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        //EXIBIR CABECALHO CIDADE ENDERECO FISCALIZACAO
        if (diligencia != null && diligencia.MunicipioEndereco != undefined) {
            $('#MunicipioData').html(diligencia.MunicipioEndereco);

        }
        else {
            $('#MunicipioData').html(campos.NomeMunicipio);

        }

        $('#Cnae').html(campos.CNAE_Descricao);

        if (campos.TipoAuto != 2 &&  // Constatação
            campos.TipoAuto != 3 &&  // Apreensão
            campos.TipoAuto != 5) {
            $('#EnviadoAR').html('▢ ENVIADO POR A.R.');
        }

        marcaEDesmarcarRecusaAssinatura(campos.RecusaAssinatura);
    }

    function marcaEDesmarcarRecusaAssinatura(recusou) {

        if (recusou === 'true') {
            $('#checkRecusaAss').removeClass('fa fa-square-o');
            $('#checkRecusaAss').addClass('fa fa-check-square-o');
        }
        else {
            $('#checkRecusaAss').removeClass('fa fa-check-square-o');
            $('#checkRecusaAss').addClass('fa fa-square-o');
        }
    }

    function salvar() {

        var _autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

        if (_autoManual === null || _autoManual === undefined)
            return;

        _autoManual.Componentes = REGISTRARAUTO.CriaListaFiscais(_autoManual);        

        REGISTRARAUTO.PersistirAutoMAnual(_autoManual);

    }

    return {
        Init: init
    }
}());