using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public abstract class FornecedorAuditoriaBaseController<TEntidade, TFiltro> : BaseProtController
        where TFiltro : new()
        where TEntidade : new()
    {
        public FornecedorAuditoriaBaseController()
        {
           ViewBag.ViewDirectory = string.Empty;
           ViewBag.ActionFiltro = "Filtro";
           ViewBag.ActionListar = "Listar";
           ViewBag.ActionBarraInferior = "BarraInferior";
           ViewBag.CarregarLista = false;
           ViewBag.BarraInferior = false;

        }

        #region Implementacao de Operacoes
        public virtual ViewResult Index()
        {
            return View("FornecedorAuditoriaIndex");
        }

        public virtual ActionResult ListaVazia(TFiltro filtro)
        {
            return Listar(filtro);
        }

        public virtual ViewResult Filtro()
        {
            var model = new TFiltro();

            return ViewEspecifica("_Filtro", model);
        }
        #endregion

        #region Metodos privados e herdados de forma generica nao devolve a view Tipada
        protected ViewResult ViewEspecifica(string viewName)
        {
            return View(String.Format("{0}{1}", ViewBag.ViewDirectory, viewName));
        }

        protected ViewResult ViewEspecifica(string viewName, object model)
        {
            return View(String.Format("{0}{1}", ViewBag.ViewDirectory, viewName), model);
        }
        #endregion

        [HttpGet]
        public abstract ActionResult Listar(TFiltro filtro);

    }
}