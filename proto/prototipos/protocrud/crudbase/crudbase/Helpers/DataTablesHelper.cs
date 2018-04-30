using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Helpers
{
    public class DataTablesHelper
    {
        public static IDictionary<string, object> ParseAdditionalParameters(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var retorno = new Dictionary<string, object>();

            var values = bindingContext.ValueProvider;

            var filtro = values.GetValue("filtro");

            var dict = HttpUtility.ParseQueryString(filtro.AttemptedValue);
            var dict2 = dict.AllKeys.ToDictionary(k => k, k => dict[k]);

            foreach (var item in dict2)
            {
                retorno.Add(item.Key, item.Value);
            }

            return retorno;
        }
    }
}