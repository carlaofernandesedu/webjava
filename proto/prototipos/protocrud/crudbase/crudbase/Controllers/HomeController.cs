﻿using System;
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
            var objetoResult = new { Resultado = lista, Mensagem = "Nenhum registro para ser exibido" , Sucesso= true};
            var jsonResultado = new JsonResult() { Data = objetoResult , JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return jsonResultado;
        }


        public JsonResult ObterListaPai()
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem() { Text = "ItemPai 1", Value = "1" },
                new SelectListItem() { Text = "ItemPai 2", Value = "2"},
                new SelectListItem() { Text = "ItemPai 3", Value = "3" }
            };
            var objetoResult = new { Resultado = lista, Mensagem = "Nenhum registro para ser exibido", Sucesso = true };
            var jsonResultado = new JsonResult() { Data = objetoResult, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return jsonResultado;
        }

        public JsonResult ObterListaFilho(int idPai)
        { 
            var lista = new List<SelectListItem>();
            if (idPai == 1)
            {
                lista.Add(new SelectListItem() { Text = "ItemFilho 101", Value = "101" });
                lista.Add(new SelectListItem() { Text = "ItemFilho 102", Value = "102" });
            }
            else if(idPai == 2)
            {
                lista.Add(new SelectListItem() { Text = "ItemFilho 201", Value = "201" });
                lista.Add(new SelectListItem() { Text = "ItemFilho 202", Value = "202" });
            }
            else
            {
                lista.Add(new SelectListItem() { Text = "ItemFilho 301", Value = "301" });
            }
            
            var objetoResult = new { Resultado = lista, Mensagem = "Nenhum registro para ser exibido", Sucesso = true };
            var jsonResultado = new JsonResult() { Data = objetoResult, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return jsonResultado;
        }
    }
}