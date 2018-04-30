using System;
using System.Collections.Generic;
using System.Reflection;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using crudbase.Enums;

namespace crudbase.Controllers
{
    public abstract class CRUDBaseProtController<TEntidade, TFiltro> : BaseProtController
        where TFiltro : new() 
        where TEntidade : new() 
    {
        public CRUDBaseProtController() : base()
        {
            // Propriedades comuns a todos os controllers para controle das funcionalidades
            ViewBag.CrudOperations = CrudOperation.CrudBasic;
            ViewBag.ViewDirectory = string.Empty;
            ViewBag.FiltroAvancadoAberto = false;
            ViewBag.CarregarLista = false;
            ViewBag.ExibirBarraInferior = false;
            ViewBag.Complexo = false;
        }

        #region Implementacao de Operacoes
        public virtual ViewResult Index()
        {
            return View("CrudProtIndex");
        }

        public virtual ActionResult CrudToolbar(CrudOperation operations)
        {
            return View("_CrudToolbar", operations);
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

        #region Operacoes CRUD Basicas 
        [HttpGet]
        public abstract ActionResult Listar(TFiltro filtro);
        [HttpGet]
        public abstract ActionResult Detalhar(int id);
        [HttpGet]
        public abstract ActionResult Editar(int id);
        [HttpPost]
        public abstract JsonResult Salvar(TEntidade model);
        [HttpPost]
        public abstract JsonResult Excluir(int id);
        #endregion
    }
}