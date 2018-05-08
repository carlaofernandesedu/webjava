using crudbase.Models.Auditoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class FornecedorAtendimentoDuplicadoController : FornecedorAuditoriaBaseController<FornecedorEliminadoViewModel, FornecedorEliminadoFiltro>
    {
        public FornecedorAtendimentoDuplicadoController() : base()
        {
            ViewBag.Title = "Eliminar Fornecedor";
        }
        
        public override ActionResult Listar(FornecedorEliminadoFiltro filtro)
        {
            var result = new List<FornecedorEliminadoViewModel>();
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 1, CPFCNPJ = "24567890832", FornecedorPadrao="Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 2, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 3, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 4, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 5, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 6, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            return View("_Listar", result);
        }

        public ActionResult Eliminar()
        {
            throw new NotImplementedException();
        }
    }
}