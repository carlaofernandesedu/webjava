using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class VersaoController : Controller
    {
        // GET: Versao
        public ActionResult Obter()
        {
            ViewBag.VersaoFrontEnd = "";
            ViewBag.VersaoBackEnd = "";
            ViewBag.NumeroBuild = "";
            ViewBag.DataHoraExecucao = "";
            ViewBag.Informacao = "";

            try
            {
                var versao = ObterDadosXml();
                ViewBag.VersaoFrontEnd = versao.VersaoFrontEnd;
                ViewBag.VersaoBackEnd = versao.VersaoBackEnd; 
                ViewBag.NumeroBuild = versao.NumeroBuild;
                ViewBag.DataHoraExecucao = versao.DataHoraExecucao;
                ViewBag.Informacao = versao.Informacao;
            }
            catch (Exception ex)
            {

                ViewBag.Informacao = "Não foi possível obter a versão:" + ex.Message; 
            }

            return View();
        }


        public class VersionDevops
        {
            public string NumeroBuild { get; set; }
            public string VersaoFrontEnd { get; set; }
            public string VersaoBackEnd { get; set; }
            public string DataHoraExecucao { get; set; }
            public string Informacao { get; set; }
        }

        public static VersionDevops ObterDadosXml()
        {
            VersionDevops versao = new VersionDevops();    

                try
                {
                        var path = System.Web.HttpContext.Current.Server.MapPath("~/versaodevops.xml");
                        System.Xml.XmlReaderSettings set = new System.Xml.XmlReaderSettings();
                        set.ConformanceLevel = System.Xml.ConformanceLevel.Fragment;
                        System.Xml.XPath.XPathDocument doc = new System.Xml.XPath.XPathDocument(System.Xml.XmlReader.Create(path, set));
                        System.Xml.XPath.XPathNavigator nav = doc.CreateNavigator();
                        versao.NumeroBuild = nav.SelectSingleNode("/parametros/numerobuild").Value;
                        versao.VersaoFrontEnd = nav.SelectSingleNode("/parametros/versaofrontend").Value;
                        versao.VersaoBackEnd = nav.SelectSingleNode("/parametros/versaobackend").Value;
                        versao.Informacao = nav.SelectSingleNode("/parametros/informacao").Value;
                        versao.DataHoraExecucao = nav.SelectSingleNode("/parametros/datahoraexecucao").Value;
                }
                catch (Exception ex)
                {
                        versao.Informacao =  ex.Message;
                }
                return versao;
            }

        }
}
