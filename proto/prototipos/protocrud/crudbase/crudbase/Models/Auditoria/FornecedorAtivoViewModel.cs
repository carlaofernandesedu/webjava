using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crudbase.Models.Auditoria
{
    public class FornecedorAtivoViewModel
    {
        public int Id { get; set; }
        public string NomeFornecedor { get; set; }
        public string Endereco { get; set; }
        public string CNPJ {get;set;}
        public string FornecedorOficial { get; set; }

    }
}