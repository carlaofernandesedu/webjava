using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crudbase.Models
{
    public class FiltroBaseProt
    {
        public int? Codigo { get; set; }

        public string Termo { get; set; }

        /// <summary>
        /// Ativo ou Inativo
        /// </summary>
        public bool? Status { get; set; }

        /// <summary>
        /// Data de criação do registro.
        /// </summary>
        public virtual DateTime DataCriacao { get; set; }

        /// <summary>
        /// Usuário que criou o registro.
        /// </summary>
        public int IdUsuarioCriacao { get; set; }

        /// <summary>
        /// Data da última alteração do registro.
        /// </summary>
        public DateTime DataAlteracao { get; set; }

        /// <summary>
        /// Usuário responsável pela última alteração do registro.
        /// </summary>
        public int UsuarioAlteracao { get; set; }

        public int PaginaAtual { get; set; }

        private int _inicio;
        public int Inicio
        {
            get
            {
                return _inicio;
            }
            set
            {
                _inicio = value;

                PaginaAtual = (_inicio / _qtdItensPorPagina) + 1;
            }
        }

        private int _qtdItensPorPagina;
        public int QtdItensPorPagina
        {
            get
            {
                return _qtdItensPorPagina;
            }
            set
            {
                _qtdItensPorPagina = value;

                PaginaAtual = (_inicio / _qtdItensPorPagina) + 1;
            }
        }

        public int TotalRegistros { get; set; }

        public bool Paginado { get; set; }

        public KeyValuePair<string, int>? Ordenacao { get; set; }

        public FiltroBaseProt()
        {
            PaginaAtual = 1;
            QtdItensPorPagina = Int32.MaxValue;
        }

        public FiltroBaseProt(int paginaAtual, int qtdItensPorPagina)
        {
            PaginaAtual = paginaAtual;
            QtdItensPorPagina = qtdItensPorPagina;
        }

    }
}