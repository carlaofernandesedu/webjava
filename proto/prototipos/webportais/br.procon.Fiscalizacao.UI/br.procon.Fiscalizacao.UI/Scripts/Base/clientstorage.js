var TipoStorage =
{
    LocalStorage: 1,
    SessionStorage: 2
};

var CLIENTSTORAGE = (function () {

    var storage = sessionStorage;

    function init(tipo) {
        BASE.Debug("clientstorageinit");

        if (tipo === undefined || tipo === null) {
            BASE.Mensagem.Mostrar("DEFINA UM TIPO DE STORAGE", TipoMensagem.Alerta);
        }

        switch (tipo) {
            case TipoStorage.LocalStorage:
                storage = localStorage;
                break;
            case TipoStorage.SessionStorage:
                storage = sessionStorage;
                break;
            default:
                storage = sessionStorage;
                break;
        }
    }

    function limparTudo() {
        storage.clear();
    }

    function adicionarObjeto(chave, valor) {
        storage.setItem(chave, JSON.stringify(valor));
    }

    function removerObjeto(chave) {
        storage.removeItem(chave);
    }

    function obterObjeto(chave) {
        return JSON.parse(storage.getItem(chave));
    }

    function filtrarObjeto(chave, situacao) {
        var result = JSON.parse(storage.getItem(chave));

        var filterednames = result.filter(function (obj) {
            return (obj.Situacao == situacao);
        });

        return filterednames;
    }

    function substituirObjeto(chave, valor) {
        removerObjeto(chave);
        adicionarObjeto(chave, valor);
        return valor;
    }

    function arrayContemObjeto(obj, name) {
        var list = arrayObter(name);

        var i;
        for (i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                return true;
            }
        }

        return false;
    }

    function arrayAdicionarObjeto(name, obj) {
        var list = arrayObter(name);

        list.push(obj);
    }

    function arrayRemoverObjeto(nomeArray, propriedadeBusca, valor) {
        var list = arrayObter(nomeArray);

        for (i = list.length - 1; i >= 0; i--) {
            if (list[i][propriedadeBusca] === valor) {
                BASE.Debug('removendo item com ' + propriedadeBusca + ': ' + valor);
                list.splice(i, 1);
            }
        }

        substituirObjeto(nomeArray, list);
    }
    
    function arraySubstituirObjeto(nomeArray, propriedadeBusca, valor, obj) {
        var list = arrayObter(nomeArray);

        for (i = list.length - 1; i >= 0; i--) {
            console.log(list[i][propriedadeBusca]);
            if (list[i][propriedadeBusca] === valor) {
                BASE.Debug('substituindo item com ' + propriedadeBusca + ': ' + valor);
                list[i] = obj;
            }
        }

        substituirObjeto(nomeArray, list);
    }

    function arrayAdicionarObjetoUnico(name, obj) {
        var list = arrayObter(name);

        if (!arrayContemObjeto(obj, name)) {
            list.push(obj);
        }
        adicionarObjeto(name, list);
    }

    function arrayObter(name) {
        var list = obterObjeto(name);

        if (list === null) {
            BASE.Debug('criando array');
            list = new Array();
            adicionarObjeto(name, list);
        }

        return list;
    }     

    return {
        Init: init,
        Tipo: TipoStorage.SessionStorage,
        AdicionarObjeto: adicionarObjeto,
        RemoverObjeto: removerObjeto,
        ObterObjeto: obterObjeto,
        SubstituirObjeto: substituirObjeto,
        LimparTudo: limparTudo,
        Lista: {
            Obter: arrayObter,
            ContemObjeto: arrayContemObjeto,
            AdicionarObjeto: arrayAdicionarObjeto,
            AdicionarObjetoUnico: arrayAdicionarObjetoUnico,
            RemoverObjeto: arrayRemoverObjeto,
            AtualizarObjeto: arraySubstituirObjeto,
            Filtrar: filtrarObjeto, 
        }
    };
}());