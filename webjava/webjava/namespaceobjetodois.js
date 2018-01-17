'use strict';
var namespace = namespace || {};
namespace.subnamespace = namespace.subnamespace || {};
namespace.subnamespace.objetodois =
    {
        metodo: function () { document.writeln('execucao metodo objeto dois'); }
    };

        (function () {
            //representa o import da biblioteca namespace subnamespace 
            var meuObjetoum = namespace.subnamespace.objetoum;
            var meuObjetodois = namespace.subnamespace.objetodois;
            meuObjetoum.metodo();
            meuObjetodois.metodo();
        })();