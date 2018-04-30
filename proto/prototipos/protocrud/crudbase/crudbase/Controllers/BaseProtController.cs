using crudbase.CoreInfra;
using crudbase.Models;
using DataTables.AspNet.Core;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class BaseProtController : Controller
    {
        public BaseProtController() : base()
        {
        }

        #region Tratamento de Mensagens

        //Usado para redirecionamento entre controller
        //Nao possui diferenciacao de critica erro e sucesso
        private void AdicionarMensagem(bool _sucesso, string _msg, bool _novo = false)
        {
            if (TempData.Keys.Contains("Sucesso"))
                TempData.Remove("Sucesso");

            if (TempData.Keys.Contains("Mensagem"))
                TempData.Remove("Mensagem");

            if (TempData.Keys.Contains("NovoCadastro"))
                TempData.Remove("NovoCadastro");

            TempData.Add("Sucesso", _sucesso);
            TempData.Add("Mensagem", _msg);
            TempData.Add("NovoCadastro", _novo);
        }

        #endregion Tratamento de Mensagens

        #region acoes sobre os eventos do MVC

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior
            };
        }

        #endregion acoes sobre os eventos do MVC



        #region uso do NewtonSoftJson convertendo JsonResult padrao do ASP.Net MVC

        public class JsonNetResult : JsonResult
        {
            public override void ExecuteResult(ControllerContext context)
            {
                if (context == null)
                {
                    throw new ArgumentNullException("context");
                }
                if (JsonRequestBehavior == JsonRequestBehavior.DenyGet &&
                    String.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException();
                }

                HttpResponseBase response = context.HttpContext.Response;

                if (!String.IsNullOrEmpty(ContentType))
                {
                    response.ContentType = ContentType;
                }
                else
                {
                    response.ContentType = "application/json";
                }
                if (ContentEncoding != null)
                {
                    response.ContentEncoding = ContentEncoding;
                }
                if (Data != null)
                {
                    response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(Data));
                }
            }

            #endregion uso do NewtonSoftJson convertendo JsonResult padrao do ASP.Net MVC

            #region "DataTable"

            //Metodo que consolida o Tratamento de DataTable Componente com as classes de Filtro atribuindo informacoes as propriedades
            protected static T InstanciarFiltro<T>(IDataTablesRequest request, T filtroObj) where T : FiltroBaseProt, new()
            {
                if (request == null && filtroObj != null)
                {
                    filtroObj.Paginado = true;
                    return filtroObj;
                }

                T filtro = request != null ? request.AdditionalParameters.ToObject<T>() : new T();
                filtro.QtdItensPorPagina = request != null ? request.Length : VariaveisGlobaisProt.QtdItensPorPagina;
                filtro.Inicio = request != null ? request.Start : 0;
                filtro.Paginado = true;

                foreach (var column in request.Columns)
                {
                    if (column.Sort != null)
                    {
                        filtro.Ordenacao = new KeyValuePair<string, int>(column.Name, (int)column.Sort.Direction);
                    }
                }
                return filtro;
            }

            #endregion "DataTable"
        }
    }
}