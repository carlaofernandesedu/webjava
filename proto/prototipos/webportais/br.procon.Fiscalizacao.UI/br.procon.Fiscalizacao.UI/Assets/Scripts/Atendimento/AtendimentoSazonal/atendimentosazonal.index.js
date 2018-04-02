ATENDIMENTOSAZONAL = (function () {
	var init = function () {
	};

	var atendimentoExcluir = function (Id) {

		bootbox.confirm({
			title: "Excluir Tipo de Atendimento Sazonal?",
			message: "Deseja realmente excluir o Tipo de Atendimento Sazonal selecionado?",
			buttons: {
				cancel: {
					label: '<i class="fa fa-times"></i> Cancelar'
				},
				confirm: {
					label: '<i class="fa fa-check"></i> OK'
				}
			},
			callback: function (result) {
				if (result) {
					$.ajax({
						type: "POST",
						url: "/AtendimentoSazonal/Excluir",
						data: { "Id": Id },
						success: function (response) {
							window.location = "/AtendimentoSazonal/";
						}
					});
				}
			}
		});
	};

	return {
		Init: init, 
		AtendimentoExcluir: atendimentoExcluir,
	}

}());

$(function () {
	ATENDIMENTOSAZONAL.Init();
});