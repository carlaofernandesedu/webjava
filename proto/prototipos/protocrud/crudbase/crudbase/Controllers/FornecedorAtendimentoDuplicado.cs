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
            ViewBag.Title = "Fornecedores Duplicados";
        }
        
        public override ActionResult Listar(FornecedorEliminadoFiltro filtro)
        {
            throw new NotImplementedException();
        }

        public ActionResult Eliminar()
        {
            throw new NotImplementedException();
        }
    }
}