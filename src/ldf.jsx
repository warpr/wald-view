/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var wald = wald ? wald : {};
wald.find = wald.find ? wald.find : {};

(function () {

    var XHR;
    if (typeof XMLHttpRequest !== 'function') {
        XHR = require('xmlhttprequest').XMLHttpRequest;
    } else {
        XHR = XMLHttpRequest;
    }

    var getRequest = function (url) {
        var deferred = Q.defer ();

        var xhr = new XHR();
        xhr.onload = function () {
            // FIXME: check status code
            deferred.resolve (this.responseText);
        };

        // FIXME: is there an onerror or equivalent we need to check?

        xhr.open('get', url, true);
        xhr.setRequestHeader('Accept', 'application/trig');
        xhr.send();

        return deferred.promise;
    };

    var LDF = function (connection, datastore) {
        this._server = connection;

        if (!datastore) {
            this._datastore = new N3.Store();
        } else {
            this._datastore = datastore;
        }
    };

    LDF.prototype.page = function (url) {
        var self = this;
        var parser = new N3.Parser({ format: 'application/trig' });
        var nextPage = null;

        return getRequest (url).then (function (body) {
            var deferred = Q.defer();

            parser.parse (body, function (parserError, triple, prefixes) {
                if (parserError != null) {
                    return deferred.reject (parserError);
                }

                if (!triple) {
                    self._datastore.addPrefixes(prefixes);
                    return deferred.resolve (nextPage ? self.page (nextPage) : self._datastore);
                }

                if (triple.graph === '') {
                    self._datastore.addTriple(triple);
                } else if (triple.predicate === 'http://www.w3.org/ns/hydra/core#nextPage') {
                    nextPage = triple.object;
                }
            });

            return deferred.promise;
        });
    };

    LDF.prototype.query = function (pattern) {
        var url = this._server + '?' + Qs.stringify(pattern);

        return this.page (url);
    };

    wald.find.LDF = LDF;

})();
