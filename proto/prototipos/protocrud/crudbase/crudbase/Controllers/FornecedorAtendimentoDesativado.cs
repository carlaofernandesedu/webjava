using crudbase.Models.Auditoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class FornecedorAtendimentoDesativadoController : FornecedorAuditoriaBaseController<FornecedorAtivoViewModel, FornecedorEliminadoFiltro>
    {
        public FornecedorAtendimentoDesativadoController() : base()
        {
            ViewBag.Title = "Fornecedores Desativados";
        }
        
        public override ActionResult Listar(FornecedorEliminadoFiltro filtro)
        {
            var result = new List<FornecedorAtivoViewModel>();
            result.Add(new FornecedorAtivoViewModel() {NomeFornecedor="Claro S.A", Endereco = "Rua dos Goiabas 704", Id=1, CNPJ="12345678901234",FornecedorOficial="Fornecedor Padrao"});
            result.Add(new FornecedorAtivoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 2, CNPJ = "12345678901234", FornecedorOficial = "Fornecedor Padrao" });
            result.Add(new FornecedorAtivoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 3, CNPJ = "12345678901234", FornecedorOficial = "Fornecedor Padrao" });
            result.Add(new FornecedorAtivoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704" ,Id = 4, CNPJ = "12345678901234", FornecedorOficial = "Fornecedor Padrao" });
            result.Add(new FornecedorAtivoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 5, CNPJ = "12345678901234", FornecedorOficial = "Fornecedor Padrao" });
            result.Add(new FornecedorAtivoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 6, CNPJ = "12345678901234", FornecedorOficial = "Fornecedor Padrao" });
            return View("_Listar", result);
        }

        public ActionResult Eliminar()
        {
            throw new NotImplementedException();
        }
    }
}