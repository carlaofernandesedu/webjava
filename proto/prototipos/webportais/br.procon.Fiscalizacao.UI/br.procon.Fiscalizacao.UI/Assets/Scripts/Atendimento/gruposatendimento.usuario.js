var GRUPOATENDIMENTO_USUARIO = (function () {

	var validate = {};

	var init = function () {
		BindAdicionarUsuario();
		BindPrioridades();
		BindExcluir();
		BindPesquisarUsuario();
	};
	var BindAdicionarUsuario = function () {

		/*
		public int Id { get; set; }
        public int IdGrupo { get; set; }
        public int IdUsuario { get; set; }
        public int Prioridade { get; set; }
        public GrupoAtendimentoViewModel Grupo { get; set; }
        public UsuarioSegurancaViewModel Usuario { get; set; }
		*/

		/*
		$('button[name="adicionarUsuario"]').unbind('click').bind('click', function () {

			var data = {
				"Id": 0,
				"IdGrupo": $('input[name="id_grupo_atendimento"]').val(),
				"IdUsuario": $('input[name="UsuarioSelecionadoId"]').val(),
				"Prioridade": 0
			};

			$.ajax({
				type: "POST",
				url: "/GruposAtendimento/GrupoIncluir",
				data: data,
				dataType: "json",
				success: function (response) {
					window.location.reload();
				}
			});

		});
        */

	    $('button[name="adicionar-usuario"]').unbind('click');
	    $('button[name="adicionar-usuario"]').bind('click', function () {

	        var usuarios = [];
	        $('input[name*="Usuarios"]:checked').each(function( index ) {
	            console.log($(this).val());
	            usuarios.push( $(this).val() );
	        });

	        //return;

            var data = {
	            "Usuarios": usuarios,
	            "id_grupo_atendimento": $('input[name="id_grupo_atendimento"]').val(),
	            "Prioridade": 0
	        };

	        $.ajax({
	            type: "POST",
	            url: "/GruposAtendimento/GrupoIncluir",
	            data: data,
	            dataType: "json",
	            success: function (response) {
	                window.location.reload();
	            }
	        });
	    });

	};

	var objdata = {};
	var idusuario = {};

	var BindPesquisarUsuario = function () {
	    $('button[name="btn-pesquisar-usuario"]').unbind('click').bind('click', function () {

	        var usuarios_selecionados = JSON.parse($('input[name="id_usuarios_selecionados"]').val());

	        $.ajax({
	            type: "GET",
	            url: "/Usuario/ListarUsuariosAtendimento",
	            data: $('#frm-usuarios').serialize(),
	            dataType: "json",
	            success: function (response)
	            {
	                //console.log(response);
	                $('#tbl-data-usuarios tbody').empty();
	                var html = "";

	                response = response.filter(function (item) {
	                    return usuarios_selecionados.indexOf(item.Codigo) == -1;
	                });

	                for (var i = 0; i < response.length; i++)
	                {
	                    html += "<tr>";
	                    html += "  <td class='text-center'> <input type='checkbox'  value='" + response[i].Codigo + "' name='Usuarios[" + i + "].Id'/> </td>";
	                    html += "  <td>" + response[i].NomeUsuario + "</td>";
	                    html += "  <td>" + response[i].ChaveDeAcesso + "</td>";
	                    html += "<tr>";
	                }

	                if (response.length == 0) {
	                    html += "<tr>";
	                    html += "  <td colspan='3'> Nenhum usuário encontrado.</td>";
	                    html += "<tr>";
	                }

	                $('#tbl-data-usuarios tbody').html(html);

	            },
	            error: function (XMLHttpRequest, textStatus, errorThrown) {
	                console.log(textStatus);
	            }
	        });
	    });
	};

	var BindPrioridades = function () {
	    $('button[name="btnPrioridade"]').unbind('click').bind('click', function () {

	        objdata = $(this).parent().parent().data('object');
	        idusuario = $(this).data('idusuario');

	        $('span#prioridade_usuario').html(objdata.Nome);
	        pesquisarGruposPorUsuarios(objdata, idusuario);

	        $('#modal-prioridades').modal('show');
	    });

	};

	var pesquisarGruposPorUsuarios = function (obj, idusuario) {
	    $.ajax({
	        type: "POST",
	        url: "/GruposAtendimento/GruposPorUsuario",
	        data: { "idusuario": idusuario },
	        dataType: "json",
	        success: function (response) {
	            console.log(response);

	            $('#modal-prioridades table tbody').empty();
	            if (Object.prototype.toString.call(response) === '[object Array]') {
	                $.each(response, function (index, item) {
	                    var linha = "";
	                    linha += "<tr>";
	                    linha += "  <td  style='display:none;'> {0} </td>";
	                    linha += "  <td class='text-center'>";
	                    linha += "      <button data-idusuario='{1}' data-idgrupo='{0}' name='GrupoPrioridadeAumentar' class='btn btn-default btn-xs up' data-toggle='tooltip' data-placement='top' title='' data-original-title='Para Cima'><i class='fa fa-arrow-up'></i></button>";
	                    linha += "      <button data-idusuario='{1}' data-idgrupo='{0}' name='GrupoPrioridadeDiminuir' class='btn btn-default btn-xs up' data-toggle='tooltip' data-placement='top' title='' data-original-title='Para Cima'><i class='fa fa-arrow-down'></i></button>";
	                    linha += "  </td>";
	                    linha += "  <td style='display:none;'> {2} </td>";
	                    linha += "  <td> {3} </td>";
	                    linha += "  <td style='display:none;' class='text-center'>";
	                    linha += "      <button class='btn btn-danger btn-xs up' data-idusuario='{1}' data-idgrupo='{0}' name='btnGrupoRemover' data-toggle='tooltip' data-placement='top' title='Excluir' data-original-title='Excluir Grupo de Atendimento'><i class='fa fa-trash'></i></button> </td>";
	                    linha += "  </td>";
	                    linha += "</tr>";
	                    //item.Grupo.ds_grupo_atendimento, idusuario, item.IdGrupo, item.Prioridade, item.IdGrupo
	                    $('#modal-prioridades table tbody').append($.validator.format(linha, item.IdGrupo, idusuario, item.Prioridade, item.Grupo.ds_grupo_atendimento));

	                    $('button[name="GrupoPrioridadeAumentar"]').unbind('click').bind('click', function () {
	                        var data = {
	                            "idgrupo": $(this).data('idgrupo'),
	                            "idusuario": $(this).data('idusuario')
	                        };

	                        $.ajax({
	                            type: "POST",
	                            url: "/GruposAtendimento/GrupoPrioridadeAumentar",
	                            data: data,
	                            dataType: "json",
	                            success: function (response) {
	                                pesquisarGruposPorUsuarios(objdata, idusuario);
	                            }
	                        });
	                    });
	                    $('button[name="GrupoPrioridadeDiminuir"]').unbind('click').bind('click', function () {
	                        var data = {
	                            "idgrupo": $(this).data('idgrupo'),
	                            "idusuario": $(this).data('idusuario')
	                        };

	                        $.ajax({
	                            type: "POST",
	                            url: "/GruposAtendimento/GrupoPrioridadeDiminuir",
	                            data: data,
	                            dataType: "json",
	                            success: function (response) {
	                                pesquisarGruposPorUsuarios(objdata, idusuario);
	                            }
	                        });
	                    });

	                });
	            }
	        }
	    });
	};

	var BindExcluir = function () {

		$('button[name="btnGrupoRemover"]').unbind('click').bind('click', function () {

			var data = {
				"idgrupo": $('input[name="id_grupo_atendimento"]').val(),
				"idusuario": $(this).data('idusuario')
			};
			
			bootbox.confirm({
				title: "Excluir o registro",
				message: "Deseja excluir o registro selecionado?", 
				buttons: {
					confirm: {
						label: 'Sim',
						className: 'btn-success'
					},
					cancel: {
						label: 'Não',
						className: 'btn-danger'
					}
				},
				callback: function (result) {
					if (result) {
						$.ajax({
							type: "POST",
							url: "/GruposAtendimento/GrupoRemover",
							data: data,
							dataType: "json",
							success: function (response) {
								window.location.reload();
							}
						});
					}
				}
			});

		});
	};
	return {
		Init: function () {
			init();
		}
	};

}());


$(function () {
	GRUPOATENDIMENTO_USUARIO.Init();
});