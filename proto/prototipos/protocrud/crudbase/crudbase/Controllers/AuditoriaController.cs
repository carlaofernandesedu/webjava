using crudbase.Models.Auditoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class AuditoriaController : Controller
    {
        // GET: Auditoria
        public ActionResult Index()
        {
            ViewBag.ActionFiltro = "FiltroEliminado";
            return View();
        }

        public ViewResult FiltroEliminado()
        {
            var model = new AuditoriaFiltroModel();

            return View("_FiltroEliminado", model);
        }
    }
}