intellisense.annotate(CLIENTSTORAGE, {
    'Init': function () {
        /// <signature>
        ///   <summary>Inicializa o módulo de gerenciamento de Storage no cliente</summary>
        ///   <param name="tipo" type="String">O tipo de storage: TipoStorage.LocalStorage ou TipoStorage.SessionStorage</param>
        /// </signature>
    },
    'AdicionarObjeto': function () {
        /// <signature>
        ///   <summary>Adiciona um objeto ao Storage no navegador do cliente</summary>
        ///   <param name="chave" type="String">A chave para armazenar o objeto</param>
        ///   <param name="valor" type="Object">O objeto a ser armazenado.</param>
        /// </signature>
    },
    'RemoverObjeto': function () {
        /// <signature>
        ///   <summary>Remove um objeto do Storage no navegador do cliente</summary>
        ///   <param name="chave" type="String">A chave para armazenar o objeto</param>
        /// </signature>
    },
    'ObterObjeto': function () {
        /// <signature>
        ///   <summary>Recupera um objeto do Storage no navegador do cliente</summary>
        ///   <param name="chave" type="String">A chave para armazenar o objeto</param>
        ///   <returns type="object" />
        /// </signature>
    },
    'LimparTudo': function () {
        /// <signature>
        ///   <summary>Limpa Storage no navegador do cliente</summary>
        /// </signature>
    }
});

intellisense.annotate(window, {
    'CLIENTSTORAGE': function () {
        /// <signature>
        ///   <summary>Gerencia um storage no cliente</summary>
        /// </signature>
    },
});