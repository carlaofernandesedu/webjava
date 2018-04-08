using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult ObterListaSimples()
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem() { Text = "Item 1", Value = "1" },
                new SelectListItem() { Text = "Item 2", Value = "2"},
                new SelectListItem() { Text = "Item 3", Value = "3" }
            };
            var objetoResult = new { Resultado = lista, Mensagem = "carregado com sucesso" , Sucesso= true};
            var jsonResultado = new JsonResult() { Data = objetoResult , JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return jsonResultado;
        }
    }
}