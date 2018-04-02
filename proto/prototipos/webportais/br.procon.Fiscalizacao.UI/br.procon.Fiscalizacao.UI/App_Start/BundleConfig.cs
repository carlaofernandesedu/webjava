using System.Web.Optimization;

namespace br.procon.Fiscalizacao.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            "~/Assets/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/Visualizar").Include(
            "~/Assets/Scripts/Documento/VisualizarDocumento.js")
            );

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            "~/Assets/Scripts/jquery.validate*",
            "~/Assets/Scripts/methods_pt.js",
            "~/Scripts/Base/custom.validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/offlinejs").Include(
            "~/Scripts/offline.js"));

            bundles.Add(new ScriptBundle("~/bundles/base").Include(
            "~/Scripts/Base/enums.js",
            "~/Scripts/Base/base.js"));

            bundles.Add(new ScriptBundle("~/bundles/empresa").Include(
            "~/Assets/Scripts/Seguranca/empresa.js"));

            bundles.Add(new ScriptBundle("~/bundles/controles").Include(
             "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js",
            "~/Scripts/Base/controles.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
            "~/Assets/Scripts/date.js",
            "~/Assets/Scripts/scripts.js",
            //"~/Scripts/smalot-datetimepicker/bootstrap-datetimepicker.js",
            "~/Assets/Scripts/bootstrap.js",
            "~/Assets/Scripts/global.js",
            "~/Assets/Scripts/jquery.dataTables.min.js",
            "~/Assets/Scripts/dataTables.responsive.js",
            "~/Assets/Scripts/jquery.bootstrap-duallistbox.js",
            "~/Assets/Scripts/editor.js",
            "~/Assets/Scripts/jquery-ui.js",
            "~/Assets/Scripts/bootstrap-tagsinput.min.js",
            "~/Assets/Scripts/bootstrap-modal-master/js/bootstrap-modal.js",
            "~/Assets/Scripts/bootstrap-modal-master/js/bootstrap-modalmanager.js",
            "~/Assets/megamenu/megamenu.js",
            "~/Assets/Scripts/moment-with-locales.js",
            "~/Scripts/smalot-datetimepicker/bootstrap-datetimepicker.js",
            "~/Scripts/bootbox.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/notify").Include(
            "~/Scripts/notifyjs-master/dist/notify.js",
            "~/Scripts/notifyjs-master/dist/styles/metro/notify-metro.js",
            "~/Scripts/notify_execucao.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/jquerymask").Include(
            "~/Assets/Scripts/jquery.mask.js",
            "~/Assets/Scripts/mask.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstraptypeahead").Include("~/Assets/Scripts/bootstrap-typeahead.js", "~/Assets/Scripts/bootstrap-typeahead-ci.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/cep").Include(
            "~/Assets/Scripts/jscep.js"));

            bundles.Add(new ScriptBundle("~/bundles/manter-consumidor").Include(
           "~/Assets/Scripts/Atendimento/consumidor.js"));

            bundles.Add(new ScriptBundle("~/bundles/administrativo-fornecedor").Include(
            "~/Assets/Scripts/Administrativo/administrativo-fornecedor.js"));

            bundles.Add(new ScriptBundle("~/bundles/Fornecedor").Include(
            "~/Assets/Scripts/Administrativo/Fornecedor.js", "~/Assets/Scripts/jspessoafisica.js", "~/Assets/Scripts/jspessoajuridica.js"));

            bundles.Add(new ScriptBundle("~/bundles/helpers").Include(
            "~/Assets/Scripts/jslistbox.js"));

            bundles.Add(new ScriptBundle("~/bundles/CepEspecial").Include(
            "~/Assets/Scripts/Administrativo/jscepespecial.js"));

            bundles.Add(new ScriptBundle("~/bundles/Noticias").Include(
            "~/Assets/Scripts/jsnoticias.js"));

            bundles.Add(new ScriptBundle("~/bundles/grupo-fornecedor").Include(
              "~/Assets/Scripts/Atendimento/GrupoFornecedor/grupo.fornecedor.js"));

            bundles.Add(new ScriptBundle("~/bundles/manutencao-grupo-fornecedor").Include(
              "~/Assets/Scripts/Atendimento/GrupoFornecedor/manutencao.grupo.fornecedor.js"));

            bundles.Add(new ScriptBundle("~/bundles/CadastroDocumento").Include(
            "~/Assets/Scripts/vertical-responsive-menu.min.js",
            "~/Assets/Scripts/Documento/Base.js",
            "~/Assets/Scripts/Documento/ClassificarDocumento.js",
            "~/Assets/Scripts/Documento/IdentificarParteInteressada.js",
            "~/Assets/Scripts/Documento/IdentificarSolicitante.js",
            "~/Assets/Scripts/Documento/ConcluirCadastro.js"));

            bundles.Add(new ScriptBundle("~/bundles/Remessa").Include(
            "~/Assets/Scripts/Remessa/ReceberRemessa.js"));

            bundles.Add(new StyleBundle("~/bundles/offlinecss").Include(
            "~/Content/css/offline-mensagens.css",
            "~/Content/css/offline-theme.css"));

            bundles.Add(new StyleBundle("~/bundles/fiscalizacaooperacionalcss").Include(
            "~/Assets/Css/normalize.css",
            "~/Assets/Css/vertical-responsive-menu.min.css",
            "~/Assets/Css/sidebar_nav.css",
            "~/Assets/Css/cabecalho_fiscalizacao.css"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
            "~/Assets/Css/bootstrap.css",
            "~/Assets/Css/bootstrap-custom.css",
            "~/Assets/Css/estilo_interno.css",
            "~/Assets/Css/SourceSansPro.css",
            "~/Assets/Css/RobotoCondensed.css",
            "~/Assets/Css/loader.css",
            "~/Assets/Css/responsivo_interno.css",
            "~/Assets/css/bootstrap-duallistbox.css",
            "~/Assets/Css/dataTables.css",
            //"~/Content/smalot-datetimepicker/bootstrap-datepicker.css",
            "~/Content/smalot-datetimepicker/bootstrap-datetimepicker.css",
            //"~/Assets/Css/bootstrap-datetimepicker.css",
            "~/Assets/Css/jquery-ui.css",
            "~/Assets/Css/bootstrap-tagsinput.css",
            "~/Assets/css/jquery-ui.css",
            "~/Assets/Css/dataTables.responsive.css",
            "~/Content/css/md-font.css",
            "~/Assets/Css/editor.css",
            "~/Assets/megamenu/megamenu.css",
            "~/Assets/Css/crud_interno.css",
            "~/Assets/Css/processo.css",
            "~/Assets/Css/FiscalizacaoOperacional/autuacao.css",
            "~/Assets/Scripts/bootstrap-modal-master/css/bootstrap-modal.css",
            "~/Assets/Scripts/bootstrap-modal-master/css/bootstrap-modal-bs3patch.css").Include("~/Assets/font-awesome/css/font-awesome.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/paper").Include("~/Assets/Css/paper.css"));
            bundles.Add(new StyleBundle("~/bundles/timbre").Include("~/Assets/Css/timbre.css"));

            #region Base

            bundles.Add(new ScriptBundle("~/bundles/crudbase").Include(
            "~/Scripts/Base/crudbase.js",
            "~/Scripts/Base/crudfiltro.js"));

            bundles.Add(new ScriptBundle("~/bundles/clientstorage").Include(
                "~/Scripts/Base/clientstorage.js"));

            #endregion Base

            #region Atendimento

            bundles.Add(new ScriptBundle("~/bundles/orientacao").Include(
                "~/Assets/Scripts/Atendimento/orientacao.js",
                "~/Assets/Scripts/Atendimento/tag.js"));

            bundles.Add(new ScriptBundle("~/bundles/classificacao").Include(
                "~/Assets/Scripts/Atendimento/classificacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/tag").Include(
                "~/Assets/Scripts/Atendimento/tag.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentobase").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/Reclamacao").Include(
                "~/Assets/Scripts/Atendimento/AtendimentoTecnico/AtendimentoGerarReclamacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentosupervisor").Include(
                "~/Assets/Scripts/Atendimento/AtendimentoSupervisor/atendimento.supervisor.js",
                "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/pesquisaratendimentos").Include(
                "~/Assets/Scripts/Atendimento/PesquisarAtendimentos/pesquisaratendimentos.js",
                "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimento-andamento").Include(
                "~/Assets/Scripts/Atendimento/AtendimentoAndamento/atendimento.andamento.js",
                "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/manteralertadaoc").Include(
                "~/Assets/Scripts/Atendimento/ManterAlertaDaoc/manteralertadaoc.js"));

            bundles.Add(new ScriptBundle("~/bundles/manteralertadaoccriareditar").Include(
                "~/Assets/Scripts/Atendimento/ManterAlertaDaoc/manteralertadaoccriareditar.js"));

            bundles.Add(new ScriptBundle("~/bundles/tipoentrega").Include(
                "~/Assets/Scripts/Atendimento/tipo-entrega.js"));

            bundles.Add(new ScriptBundle("~/bundles/monitoraralerta").Include(
                "~/Assets/Scripts/Atendimento/MonitorarAlerta/monitoraralerta.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentofiscalizacao").Include(
                "~/Assets/Scripts/Atendimento/AtendimentoFiscalizacao/atendimentofiscalizacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentofiscalizacaoencaminhamento").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoFiscalizacao/atendimentofiscalizacaoencaminhamento.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentoanexo").Include(
                "~/Assets/Scripts/Atendimento/AtendimentoTecnico/anexos.js",
                "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/finalizarcip").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/finalizar-cip.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentosolicitacoesrealizaranalise").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/atendimento-solicitacoes-realizar-analise.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimentosolicitacoes").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/atendimento-solicitacoes.js",
                "~/Assets/Scripts/Atendimento/AtendimentoBase/atendimentobase.js"));

            bundles.Add(new ScriptBundle("~/bundles/AtendimentoTecnico/consumidor").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/consumidor.js"));

            bundles.Add(new ScriptBundle("~/bundles/AtendimentoTecnico").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/atendimento-tecnico.js"));

            bundles.Add(new ScriptBundle("~/bundles/AtendimentoTecnico/TextoPadrao").Include(
               "~/Assets/Scripts/Atendimento/AtendimentoTecnico/respostaPadrao.js"));

            bundles.Add(new ScriptBundle("~/bundles/Atendimento/atendimentosituacao").Include(
               "~/Assets/Scripts/Atendimento/atendimento.situacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/Atendimento/Interacao").Include(
                "~/Assets/Scripts/Atendimento/Interacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/Atendimento/classificacao").Include(
                "~/Assets/Scripts/Base/classificacao-cascade-ddl.js"));

            #endregion Atendimento

            #region Combustiveis

            bundles.Add(new ScriptBundle("~/bundles/combustivel").Include(
            "~/Assets/Scripts/Combustivel/jscombustivel.js",
            "~/Assets/Scripts/Combustivel/jsregistro.js",
            "~/Assets/Scripts/Combustivel/responsavel.js",
            "~/Assets/Scripts/Combustivel/retirada.js"));

            bundles.Add(new ScriptBundle("~/bundles/autodeslacracao").Include(
            "~/Assets/Scripts/Combustivel/jsautodeslacracao.js"));

            bundles.Add(new ScriptBundle("~/bundles/lacre-unico").Include(
            "~/Assets/Scripts/Combustivel/lacre-unico-validator.js"));

            bundles.Add(new ScriptBundle("~/bundles/jsfiltrocombustivel").Include(
            "~/Assets/Scripts/Combustivel/jsfiltrocombustivel.js",
            "~/Assets/Scripts/jspessoajuridica.js"));

            #endregion Combustiveis

            #region Processo

            // Todo: Rever scripts criados
            bundles.Add(new ScriptBundle("~/bundles/processo").Include(
            "~/Assets/Scripts/Processo/processo.js"));

            bundles.Add(new ScriptBundle("~/bundles/processoDocumento").Include(
            "~/Assets/Scripts/Processo/ProcessoDocumento.js"));

            bundles.Add(new ScriptBundle("~/bundles/registrarprocesso").Include(
            "~/Assets/Scripts/RegistrarProcesso/registrarProcesso.js"));

            bundles.Add(new ScriptBundle("~/bundles/dadosprocesso").Include(
            "~/Assets/Scripts/RegistrarProcesso/dadosProcesso.js"));

            bundles.Add(new ScriptBundle("~/bundles/dadosprocesso_partes").Include(
            "~/Assets/Scripts/RegistrarProcesso/interessado.js"));

            bundles.Add(new ScriptBundle("~/bundles/dadosprocesso_solicitante").Include(
            "~/Assets/Scripts/RegistrarProcesso/solicitante.js"));

            bundles.Add(new ScriptBundle("~/bundles/documentojuntada").Include(
            "~/Assets/Scripts/RegistrarProcesso/documentojuntada.js"));

            bundles.Add(new ScriptBundle("~/bundles/movimentacao").Include(
            "~/Assets/Scripts/RegistrarProcesso/documentoMovimentacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/volume").Include(
            "~/Assets/Scripts/RegistrarProcesso/volume.js"));

            bundles.Add(new ScriptBundle("~/bundles/documentoincorporacao").Include(
            "~/Assets/Scripts/RegistrarProcesso/documentoIncorporado.js"));

            bundles.Add(new ScriptBundle("~/bundles/apensamento").Include(
            "~/Assets/Scripts/RegistrarProcesso/apensamento.js"));

            bundles.Add(new ScriptBundle("~/bundles/documentoprocessoprazo").Include(
          "~/Assets/Scripts/Processo/documentoprocessoprazo.js"));

            bundles.Add(new ScriptBundle("~/bundles/processoprazo").Include(
           "~/Assets/Scripts/Processo/processoprazo.js"));

            bundles.Add(new ScriptBundle("~/bundles/solicitacaoAutuacao").Include(
            "~/Assets/Scripts/SolicitacaoAutuacao/solicitacaoAutuacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/solicitacaoProcedimento").Include(
            "~/Assets/Scripts/SolicitacaoProcedimento/solicitacaoProcedimento.js"));

            bundles.Add(new ScriptBundle("~/bundles/prazo.cumprimento").Include(
            "~/Assets/Scripts/Processo/prazo.cumprimento.js"));

            #endregion Processo

            #region Administrativo

            bundles.Add(new ScriptBundle("~/bundles/setorfiscalizacao").Include(
            "~/Assets/Scripts/Administrativo/jssetorfiscalizacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/evento").Include(
            "~/Assets/Scripts/Administrativo/evento.js"));

            bundles.Add(new ScriptBundle("~/bundles/SolicitacaoAlterarFornecedor").Include(
            "~/Assets/Scripts/Administrativo/solicitacaoAlterarFornecedor.js"));

            bundles.Add(new ScriptBundle("~/bundles/validarSolicitacaoAlteracaoFornecedor").Include(
            "~/Assets/Scripts/Administrativo/validarSolicitacaoAlteracaoFornecedor.js"));

            #endregion Administrativo

            #region Fiscalizacao Operacional

            bundles.Add(new ScriptBundle("~/bundles/fiscalizacaooperacional").Include(
            "~/Assets/Scripts/FiscalizacaoOperacional/fiscalizacao-operacional.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/diligencia.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/enderecofiscalizacao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/fornecedor-fiscalizacao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-notificacao.js",
            //"~/Assets/Scripts/FiscalizacaoOperacional/visualizacaonotificacao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-constatacao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/menu-auto.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-apreensao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-infracao.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-raf.js",
            "~/Assets/Scripts/FiscalizacaoOperacional/autobase.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/pesquisaauto").Include(
            "~/Assets/Scripts/FiscalizacaoOperacional/pesquisa-auto.js"));

            bundles.Add(new ScriptBundle("~/bundles/associarauto").Include(
            "~/Assets/Scripts/FiscalizacaoOperacional/auto-autosassociados.js"));

            bundles.Add(new ScriptBundle("~/bundles/detalheauto").Include(
            "~/Assets/Scripts/FiscalizacaoOperacional/detalhe-auto.js"));

            #endregion Fiscalizacao Operacional

            #region Registrar Auto

            bundles.Add(new ScriptBundle("~/bundles/menuregistrarauto").Include(
                "~/Assets/Scripts/FiscalizacaoOperacional/menu-registrar-auto.js",
                "~/Assets/Scripts/FiscalizacaoOperacional/tipo-auto.js",
                "~/Assets/Scripts/FiscalizacaoOperacional/dados-fornecedor.js",
                "~/Assets/Scripts/FiscalizacaoOperacional/origem-auto.js",
                "~/Assets/Scripts/FiscalizacaoOperacional/informacao-auto.js",
                "~/Assets/Scripts/FiscalizacaoOperacional/previsualizar-auto.js"
            ));

            #endregion Registrar Auto

            #region Cadastrar Fiscal

            bundles.Add(new ScriptBundle("~/bundles/cadastrarfiscal").Include(
            "~/Assets/Scripts/Fiscal/fiscal-cadastro.js"
            ));

            #endregion Cadastrar Fiscal

            #region Arquivamento

            bundles.Add(new ScriptBundle("~/bundles/Arquivamento").Include(
               "~/Assets/Scripts/Arquivamento/Arquivamento.js"));

            bundles.Add(new ScriptBundle("~/bundles/arquivo-movel").Include(
               "~/Assets/Scripts/Arquivamento/arquivo.movel.js",
               "~/Scripts/Base/crud.modal.grid.js"));

            bundles.Add(new ScriptBundle("~/bundles/arquivo-caixa").Include(
              "~/Assets/Scripts/Arquivamento/arquivo.caixa.js"));

            bundles.Add(new ScriptBundle("~/bundles/arquivamento-documento").Include(
             "~/Scripts/plugin/jquery.FormatarProtocoloProcesso.js",
             "~/Assets/Scripts/Arquivamento/arquivo.arquivamento.js"));

            bundles.Add(new ScriptBundle("~/bundles/arquivo-pesquisa").Include(
            "~/Assets/Scripts/Arquivamento/arquivo.pesquisa.js"));

            #region Temporalidade

            bundles.Add(new ScriptBundle("~/bundles/candidata-eliminacao").Include(
            "~/Assets/Scripts/Arquivamento/Temporalidade/candidata.eliminacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/proposta-eliminacao").Include(
           "~/Assets/Scripts/Arquivamento/Temporalidade/proposta.eliminacao.js"));

            bundles.Add(new ScriptBundle("~/bundles/proposta-cada").Include(
            "~/Assets/Scripts/Arquivamento/Temporalidade/proposta.cada.js"));

            #endregion Temporalidade

            #region modelo documento

            bundles.Add(new ScriptBundle("~/bundles/modelodocumento").Include(
            "~/Assets/Scripts/Documento/Modelo/modelo.documento.js"));

            bundles.Add(new ScriptBundle("~/bundles/documentosimples").Include(
            "~/Assets/Scripts/Documento/Modelo/documento.simples.js"));

            #endregion modelo documento

            #endregion Arquivamento

            #region Caixa Arquivo

            bundles.Add(new ScriptBundle("~/bundles/CaixaArquivo").Include(
               "~/Assets/Scripts/CaixaArquivo/caixaArquivo.js"));

            #endregion Caixa Arquivo

            #region Commun

            bundles.Add(new ScriptBundle("~/bundles/cpf-cnpj").Include(
                        "~/Assets/Scripts/jspessoafisica.js",
                        "~/Assets/Scripts/jspessoajuridica.js"));

            bundles.Add(new ScriptBundle("~/bundles/maskmoney").Include(
                        "~/Scripts/mask-money/jquery.maskMoney.js"));

            bundles.Add(new ScriptBundle("~/bundles/cnae-autocomplete").Include(
                        "~/Assets/Scripts/Base/cnae-autocomplete.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimento-consumidor").Include(
                        "~/Assets/Scripts/Atendimento/AtendimentoConsumidor/atendimento-consumidor.js",
                        "~/Assets/Scripts/Atendimento/AtendimentoTecnico/finalizar-cip.js"));

            bundles.Add(new ScriptBundle("~/bundles/pesquisa-remessa").Include(
                        "~/Scripts/plugin/jquery.FormatarProtocoloProcesso.js",
                        "~/Assets/Scripts/Remessa/PesquisarRemessa.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimento-tecnico-fornecedor").Include(
                        "~/Assets/Scripts/Atendimento/AtendimentoTecnico/fornecedor.js"));

            bundles.Add(new ScriptBundle("~/bundles/atendimento/estatistica").Include(
                        "~/Assets/Scripts/Atendimento/Estatistica/estatistica.js"));

            bundles.Add(new ScriptBundle("~/bundles/loginjs").Include(
                        "~/Assets/Scripts/Login/Login.js"));

            // HACK toda a infrainstrutura de fornecedor foi removida deste projeto.
            //bundles.Add(new ScriptBundle("~/bundles/atendimento-fornecedor").Include(
            //            "~/Assets/Scripts/Atendimento/AtendimentoFornecedor/atendimento-fornecedor-analise.js",
            //            "~/Assets/Scripts/Atendimento/AtendimentoFornecedor/atendimento-fornecedor-anexos.js"
            //));

            bundles.Add(new ScriptBundle("~/bundles/PesquisarDocumento").Include(
                        "~/Assets/Scripts/Documento/PesquisarDocumento.js"));

            #endregion Commun

            #region Seguranca

            bundles.Add(new ScriptBundle("~/bundles/seguranca-usuario").Include(
                        "~/Assets/Scripts/seguranca/seguranca-usuario.js"));

            #endregion Seguranca

            #region Protocolo

            bundles.Add(new ScriptBundle("~/bundles/DetalheRemessa").Include(
                        "~/Assets/Scripts/Remessa/DetalheRemessa.js"));

            bundles.Add(new ScriptBundle("~/bundles/DocumentoDestino").Include(
                        "~/Assets/Scripts/DocumentoDestino/DocumentoDestino.js"));

            #endregion Protocolo

            #region Atendimento

            bundles.Add(new ScriptBundle("~/bundles/AtendimentoParametros").Include(
                        "~/Assets/Scripts/Atendimento/_parametros.js"));

            #endregion Atendimento

            #region BloqueioProtocolo

            bundles.Add(new ScriptBundle("~/bundles/Documento").Include(
                       "~/Assets/Scripts/Documento/EmitirProtocolo.js"));

            bundles.Add(new ScriptBundle("~/bundles/BloqueioProtocolo").Include(
                       "~/Assets/Scripts/Protocolo/Protocolo.js"));

            bundles.Add(new StyleBundle("~/bundles/Protocolo").Include("~/Assets/Css/Protocolo/Protocolo.css"));

            #endregion BloqueioProtocolo

            //BundleTable.EnableOptimizations = false;

            #region Denuncia
            bundles.Add(new ScriptBundle("~/bundles/pesquisarremessa").Include("~/Assets/Scripts/Denuncia/pesquisardenuncia.js"));
            #endregion
        }
    }
}