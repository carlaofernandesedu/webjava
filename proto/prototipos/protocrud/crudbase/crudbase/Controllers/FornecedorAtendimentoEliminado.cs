using crudbase.Models.Auditoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class FornecedorAtendimentoEliminadoController : FornecedorAuditoriaBaseController<FornecedorEliminadoViewModel, FornecedorEliminadoFiltro>
    {
        public FornecedorAtendimentoEliminadoController() : base()
        {
            ViewBag.Title = "Fornecedores Duplicado Eliminados";
            ViewBag.BarraInferior = true;
            ViewBag.tituloBotaoBarraInferior = "Recuperar Eliminados";
            ViewBag.acaoBotaoBarraInferior = "recuperareliminados";
        }
        
        public override ActionResult Listar(FornecedorEliminadoFiltro filtro)
        {
            var result = new List<FornecedorEliminadoViewModel>();
            result.Add(new FornecedorEliminadoViewModel() {NomeFornecedor="Claro S.A", Endereco = "Rua dos Goiabas 704", Id=1});
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 2 });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 3 });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704" ,Id = 4 });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 5 });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 6 });
            return View("_Listar", result);
        }

        public ActionResult Eliminar(ParametrosAcao parametros)
        {
            throw new NotImplementedException();
        }
    }
}