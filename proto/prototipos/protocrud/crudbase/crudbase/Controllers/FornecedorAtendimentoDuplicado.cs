﻿using crudbase.Models.Auditoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class FornecedorAtendimentoDuplicadoController : FornecedorAuditoriaBaseController<FornecedorEliminadoViewModel, AuditoriaFiltroModel>
    {
        public FornecedorAtendimentoDuplicadoController() : base()
        {
            ViewBag.Title = "Eliminar Fornecedor";
            ViewBag.BarraInferior = true;
            ViewBag.acaoBotaoBarraInferior = "prosseguireliminacao";
            ViewBag.urlacaoBarraInferior = "FornecedorAtendimentoDuplicado/ListarSelecionados";
            ViewBag.tituloBotaoBarraInferior = "Prosseguir Eliminacao";
        }

        public override ActionResult Listar(AuditoriaFiltroModel filtro)
        {
            var result = new List<FornecedorEliminadoViewModel>();
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 1, CPFCNPJ = "24567890832", FornecedorPadrao= "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 2, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 3, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 4, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 5, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 6, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            return View("_Listar", result);
        }

        public ActionResult ListarSelecionados(ParametrosAcao parametros)
        {
            ViewBag.Title = "";
            ViewBag.acaoBotaoBarraInferior = "eliminar";
            ViewBag.urlacaoBarraInferior = "FornecedorAtendimentoDuplicado/Eliminar";

            var result = new List<FornecedorEliminadoViewModel>();
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 1, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 2, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 3, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 4, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 5, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });
            result.Add(new FornecedorEliminadoViewModel() { NomeFornecedor = "Claro S.A", Endereco = "Rua dos Goiabas 704", Id = 6, CPFCNPJ = "24567890832", FornecedorPadrao = "Fornecedor Padrao Claro" });

            var arrCodigos = parametros.listaIdsControleCheckbox.Split(',');
            var resultadoFiltro = result.Where(x => arrCodigos.Contains(x.Id.ToString()));
            return View("_Listar", resultadoFiltro);

        }

        public ActionResult Eliminar()
        {
            throw new NotImplementedException();
        }
    }
}