using crudbase.Models;
using crudbase.Models.Prototipo;
using System;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class PrototipoController : CRUDBaseProtController<PrototipoViewModel, PrototipoFiltroModel>
    {
        public PrototipoController()
        {
            ViewBag.FiltroAvancadoAberto = true;
        }
        public override ActionResult Detalhar(int id)
        {
            throw new NotImplementedException();
        }

        public override ActionResult Editar(int id)
        {
            throw new NotImplementedException();
        }

        public override JsonResult Excluir(int id)
        {
            throw new NotImplementedException();
        }

        public override ActionResult Listar(PrototipoFiltroModel filtro)
        {
            throw new NotImplementedException();
        }

        public override JsonResult Salvar(PrototipoViewModel model)
        {
            throw new NotImplementedException();
        }
    }
}