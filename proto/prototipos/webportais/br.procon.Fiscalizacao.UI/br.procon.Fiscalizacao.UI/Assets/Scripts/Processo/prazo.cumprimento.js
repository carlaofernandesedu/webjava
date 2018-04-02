PRAZOCUMPRIMENTO = (function () {
	function init() {
		bindAll();
	}

	function bindAll() {	    
	    $('#btnFiltroAvancado').hide();	   
	    CRUDBASE.Eventos.PosCarregarEditar = carregarMovimento;
	}

	function carregarMovimento() {
	    var elemento = $('#form-detalhe #CodigoMovimento');
	    CONTROLES.DropDown.Preencher(elemento, 'DocumentoMovimentacao', 'ComboMovimento', null, true, false, false, null);

	    if ($('#Codigo').val() == '0')
	        $(".modal-title").text('Inserir Prazo Cumprimento');
	    else
	        $(".modal-title").text('Alterar Prazo Cumprimento');

	}

	return {
		Init: function () {
			init();
		}	
	};

}());


$(function () {
	PRAZOCUMPRIMENTO.Init();
	CRUDFILTRO.Carregar();
	CRUDFILTRO.Filtrar();
});