﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crudbase.Models.Auditoria
{
    public class FornecedorEliminadoViewModel
    {
        public int Id { get; set; }
        public string NomeFornecedor { get; set; }
        public string Endereco { get; set; }
        public string CPFCNPJ {get;set;}
        public string FornecedorPadrao { get; set; }

    }
}