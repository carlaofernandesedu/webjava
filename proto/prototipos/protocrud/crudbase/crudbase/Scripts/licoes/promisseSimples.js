var PROMISSES = (function () {

    'use strict';
    var ctSemRetorno = 'Funcionou corretamente';
    var ctRetorno = 1;
    var promisse;
    function promiseSimples() {
        promisse = new Promise(function(resolve, reject) {
            var bOk = true;
            if (bOk) {
                resolve(ctSemRetorno);
            }
            else {
                reject(Error('Gerou erro'));
            }
        });
        return promisse;
    }

    function promiseSimplesComRetorno()
    {
        promisse = new Promise(function (resolve, reject) {
            var bOk = true;
            if (bOk) {
                resolve(ctRetorno);
            }
            else {
                reject(Error('Gerou erro'));
            }
        });
        return promisse;
    }

    function promiseGetJson(url) {

        return new Promisse(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function() {
                reject(Error('network error'));
            };
            req.send();
        });
    }

    return {
        obterSemRetorno: promiseSimples,
        obterComRetorno: promiseSimplesComRetorno
    };

}());

