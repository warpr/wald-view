/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var LDF = require('ldf');
var N3 = require('n3/browser/n3-browser');
var httpinvoke = require('httpinvoke/httpinvoke-browser');
var jsonld = require('jsonld').promises;

var when = require('when');

var streamTurtle = function (data) {
    var chunkSize = 1024 * 1024;
    var dataSize = data.length;
    var offset = 0;
    var delay = 50;
    var parser = new N3.Parser();

    var useNprogress = typeof NProgress !== undefined;

    if (useNprogress) {
        NProgress.start();
    }

    var nextChunk = function () {
        if (offset < dataSize) {
            if (useNprogress) {
                NProgress.set(offset / dataSize);
            }
            parser.addChunk(data.slice(offset, chunkSize + offset));
            offset += chunkSize;
            setTimeout (nextChunk, delay);
        } else {
            parser.end();
            if (useNprogress) {
                NProgress.done();
            }
        }
    }

    setTimeout(function () {
        nextChunk();
    }, delay);

    return parser;
};

var parseTurtle = function (input, datastore) {
    var deferred = when.defer ();

    var parser = streamTurtle(input);
    parser.parse (function (err, triple, prefixes) {
        if (err) {
            deferred.reject (err);
        } else if (triple) {
            datastore.addTriple(triple);
        } else {
            datastore.addPrefixes(prefixes);
            deferred.resolve(datastore);
        }
    });

    return deferred.promise;
};

var parseJsonLD = function (input, datastore) {
    var data = JSON.parse(input);

    var options = { format: 'application/nquads' };
    return jsonld.toRDF (data, options).then(function (dataset) {
        return parseTurtle(dataset, datastore);
    });
};

var loadTurtle = function (iri, datastore) {
    if (!datastore) {
        datastore = new N3.Store();
    }

    return when(httpinvoke(iri, 'GET')).then(function (data) {
        return parseTurtle(data, datastore);
    });
};

var loadFragments = function (server, subject, datastore) {
    var ldf = new LDF(server, datastore);

    return ldf.query({ subject: subject });
};

var loadJsonLD = function (iri, datastore) {
    if (!datastore) {
        datastore = new N3.Store();
    }

    if (typeof iri === 'string') {
        return when(httpinvoke(iri, 'GET')).then(function (data) {
            return parseJsonLD(data.body, datastore);
        });
    } else if (typeof iri === 'object' && iri instanceof HTMLElement) {
        // iri is an embedded <script type="application/ld+json"> block.
        return parseJsonLD(iri.textContent, datastore);
    } else {
        when.error('unsupported iri type in loadJsonLD, expected HTMLElement or string');
    }
};

exports.loadFragments = loadFragments;
exports.loadTurtle = loadTurtle;
exports.loadJsonLD = loadJsonLD;

// -*- mode: web -*-
// -*- engine: jsx -*-
