using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace crudbase.Models.Auditoria
{
    public class FornecedorEliminadoFiltro :FiltroBaseProt
    {
        [StringLength(100)]
        public string Fornecedor { get; set; }
        [StringLength(100)]
        public string Documento { get; set; }
        [StringLength(100)]
        public string Website { get; set; }
        [Display(Name = "Data Atualização (Inicial)")]
        public string DataInicial { get; set; }
        [Display(Name = "Data Atualização (Final)")]
        public string DataFinal { get; set; }

    }
}