var PROMISSES = (function () {

    'use strict';
    var ctSemRetorno = 'Funcionou corretamente';
    var ctRetorno = 5;
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

    function promiseGet(url) {

        return new Promise(function (resolve, reject) {
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

    function promiseGetJSON(url) {
        return promiseGet(url).then(JSON.parse);
    }

    return {
        obterSemRetorno: promiseSimples,
        obterComRetorno: promiseSimplesComRetorno,
        get: promiseGet,
        getJSON : promiseGetJSON
    };

}());

