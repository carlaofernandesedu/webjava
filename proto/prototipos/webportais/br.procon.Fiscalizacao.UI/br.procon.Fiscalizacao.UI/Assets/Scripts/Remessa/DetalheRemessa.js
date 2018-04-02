$(function () {
});

var RetornaFiltro = function () {

    var objRemessa =
        {
            NumeroAnoRemessa: localStorage.getItem('NumeroAnoRemessa'),
            idSituacaoRemessa: localStorage.getItem('idSituacaoRemessa'),
            IdUaDestino: localStorage.getItem('idUaDestino'),
            DataInicial: formattedDate(localStorage.getItem('DataInicial')),
            DataFinal: formattedDate(localStorage.getItem('DataFinal'))
        };

    console.log(objRemessa);

    window.location = '/Remessa/Filtro?NumeroAnoRemessa=' + objRemessa.NumeroAnoRemessa + '&idSituacaoRemessa=' + objRemessa.idSituacaoRemessa + '&IdUaDestino=' + objRemessa.IdUaDestino + '&DataInicial=' + objRemessa.DataInicial + '&DataFinal=' + objRemessa.DataFinal;

}

function formattedDate(date) {
    var d = date.split("/");

    if (d.length == 3) {
        return d[1].concat("/").concat(d[0]).concat("/").concat(d[2]);
    }
}

function DetalheDocumento(idRemessa, idDocumento) {

    $.ajax({
        url: "/Documento/DetalharDocumento",
        type: 'GET',
        cache: false,
        data: {
            idRemessa: idRemessa,
            idDocumento: idDocumento
        },
        success: function (data) {
            console.log(data);

            if (data.doc.Origem == 1) {
                $("#origemDoc").text("Interno");
                $("#nomeDoc").text(data.doc.SerieDocumental);
            }
            else {
                $("#origemDoc").text("Externo");
                $("#nomeDoc").text(data.doc.NomeDocumento);
            }

            if (data.doc.Suporte == 1) {
                $("#suporte").text("Físico");
            } else {
                $("#suporte").text("Eletronico");
            }
            if (data.doc.Situacao == 1) {
                $("#situacaoDoc").text("Protocolado");
            }
            else if (data.doc.Situacao == 2) {
                $("#situacaoDoc").text("Cadastrado");
            } else {
                $("#situacaoDoc").text("Cancelado");
            }

            if (data.orgao != null && data.orgao != undefined) {
                $("#comboOrigem").text(data.orgao.Nome);
            }
            else {
                $("#comboOrigem").text("N/D");
            }
            
            if (data.itemRemessa != null && data.itemRemessa != undefined)
            {
                if ( data.itemRemessa.IdSituacaoRemessaItem == 3) // Recebido com Ressalva
                {
                    $("#tdObservacao").text(data.itemRemessa.DsMotivoRecebimento);
                }
                else if (data.itemRemessa.IdSituacaoRemessaItem == 5) // Devolvido
                {
                    $("#tdObservacao").text(data.itemRemessa.DsMotivoDevolucao);
                }
                else
                {
                    $("#tdObservacao").text("N/D");
                }
            }

            console.log(data.doc.DataRecebimento);

            $("#nrDoc").text(padLeft(data.doc.Numero.toString()).concat("/").concat(data.doc.Ano.toString()));
            $("#dtHrProt").text(formatDate(data.doc.DataRecebimento));
            $("#sgUa").text(data.doc.SiglaUA);
            $("#QtdVol").text(data.doc.QtdeVolume);

            $("#tdDescricaoAssunto").text(data.doc.DescricaoAssunto);

            EscondeDadosInteressadoSolicitante();
            MontaInteressadoESolicitante(data.doc.Interessado, "Interessado");
            MontaInteressadoESolicitante(data.doc.Solicitante, "Solicitante");

            $("#modalDetalheDocumentoRemessa").modal();
        }

    });
}

var MontaInteressadoESolicitante = function (listaItem, item) {

    if (item == "Interessado") {

        if (listaItem.length > 1) {

            $("#nomeInteressado").text(listaItem[0].NomeRazaoSocial.concat(" e outros"));
            ExibeDadosInteressado(listaItem);
        }
        else if (listaItem.length == 1) {

            $("#nomeInteressado").text(listaItem[0].NomeRazaoSocial);
            ExibeDadosInteressado(listaItem);
        }
        else {
            $("#nomeInteressado").text("N/D");
            $("#rgCpfCnpjInteressado").text("N/D")
            $(".tdRgCpfCnpjInt").removeAttr('style');
        }
    }

    if (item == "Solicitante") {

        if (listaItem.length > 1) {

            $("#nomeSolicitante").text(listaItem[0].Nome.concat(" e outros"));
            ExibeDadosSolicitante(listaItem);
        }
        else if (listaItem.length == 1) {

            $("#nomeSolicitante").text(listaItem[0].Nome);
            ExibeDadosSolicitante(listaItem);
        }
        else {
            $("#nomeSolicitante").text("N/D");
            $("#rgCpfCnpjSol").text("N/D")
            $(".tdRgCpfCnpjSol").removeAttr('style');
        }
    }
}

var ExibeDadosInteressado = function (listaItem) {
    switch (listaItem[0].TipoDocumentoInteressado) {
        case 1:
            $("#rgInteressado").text(listaItem[0].DescricaoRGInteressado);
            $(".tdRgInt").removeAttr('style');
            break;
        case 2:
            $("#cpfInteressado").text(listaItem[0].DescricaoCPFInteressado);
            $(".tdCpfInt").removeAttr('style');
            break;
        case 3:
            $("#cnpjInteressado").text(listaItem[0].DescricaoCNPJInteressado);
            $(".tdCnpjInt").removeAttr('style');
            break;
        default:
            $("#rgCpfCnpjInteressado").text("N/D")
            $(".tdRgCpfCnpjInt").removeAttr('style');
            break;
    }
}

var ExibeDadosSolicitante = function (listaItem) {

    switch (listaItem[0].TipoDocumento) {
        case 1:
            $("#rgSol").text(listaItem[0].DescricaoRg);
            $(".tdRgSol").removeAttr('style');
            break;
        case 2:
            $("#cpfSol").text(listaItem[0].DescricaoCPF);
            $(".tdCpfSol").removeAttr('style');
            break;
        case 3:
            $("#cnpjSol").text(listaItem[0].DescricaoCNPJ);
            $(".tdCnpjSol").removeAttr('style');
            break;
        default:
            $("#rgCpfCnpjSol").text("N/D")
            $(".tdRgCpfCnpjSol").removeAttr('style');
            break;
    }
}

var EscondeDadosInteressadoSolicitante = function () {
    //Interessado
    $(".tdRgInt").css("display", "none");
    $(".tdCpfInt").css("display", "none");
    $(".tdCnpjInt").css("display", "none");
    $(".tdRgCpfCnpjInt").css("display", "none");

    //Solicitante
    $(".tdRgSol").css("display", "none");
    $(".tdCpfSol").css("display", "none");
    $(".tdCnpjSol").css("display", "none");
    $(".tdRgCpfCnpjSol").css("display", "none");
}

function formatDate(date) {

    var hora, minuto, segundo;

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hh = d.getHours(),
        mm = d.getMinutes(),
        ss = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (String(hh).length < 2) hh = '0' + hh;
    if (String(mm).length < 2) mm = '0' + mm;
    if (String(ss).length < 2) ss = '0' + ss;

    return [day, month, year].join('-').toString().concat(" ", [hh, mm, ss].join(':'));
}

var RegexDate = function (str) {

    var result = str.match(/[0-9]/g);
    var retorno = "";

    $.each(result, function (index, value) {
        retorno += value;
    })
    console.log(parseInt(retorno));

    return formatDate(parseInt(retorno));
};

var CancelarRemessa = function (element) {
    
    var id = $(element).data("id");
    console.log(id);

    $.ajax({
        url: "/Remessa/CancelarEnvioRemessa",
        type: 'GET',
        cache: false,
        data: { idRemessa: id },
        success: function (data) {

            if (data.idRemessa != null && data.idRemessa != undefined) {
                window.location = '/Remessa/DetalheRemessa?idRemessa=' + data.idRemessa;
            }
        },
        error: function (data) {
            console.log(data);
            window.location.reload();
        }
    });
};

function ImprimirRemessa(idRemessa) {
    setTimeout(function () {
        window.open('/DocumentoDestino/EmitirRelacaoRemessa?idRemessa=' + idRemessa, "_blank").print();
    }, 1000);

};

function FechaModal() {
    $("html").css("overflow", "scroll");
    $("#modalDetalheDocumentoRemessa").modal('hide');
    return false;
}
