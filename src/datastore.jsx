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
var NProgress = require('nprogress');
var when = require('when');

var streamTurtle = function (data) {
    var chunkSize = 1024 * 1024;
    var dataSize = data.length;
    var offset = 0;
    var delay = 50;
    var parser = new N3.Parser();

    NProgress.start();

    var nextChunk = function () {
        if (offset < dataSize) {
            NProgress.set(offset / dataSize);
            parser.addChunk(data.slice(offset, chunkSize + offset));
            offset += chunkSize;
            setTimeout (nextChunk, delay);
        } else {
            parser.end();
            NProgress.done();
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

var loadTurtle = function (iri, datastore) {
    if (!datastore) {
        datastore = new N3.Store();
    }

    return when($.get(iri)).then(function (data) {
        return parseTurtle(data, datastore);
    });
};

var loadFragments = function (server, subject, datastore) {
    var ldf = new LDF(server, datastore);

    return ldf.query({ subject: subject });
};



exports.loadFragments = loadFragments;
exports.loadTurtle = loadTurtle;

// -*- mode: web -*-
// -*- engine: jsx -*-
