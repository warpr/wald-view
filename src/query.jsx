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

    var literal = function (datastore, id, predicates, languages) {
        // languages is currently ignored.  The idea for that param is to build a
        // fallback system/mapping where you can call something like preferredLanguage("nl")
        // which would return all language tags which should match that (e.g. "nl_NL",
        // "nl_BE", etc..).

        if (!_(predicates).isArray()) {
            predicates = [ predicates ];
        }

        var candidates = _(predicates)
            .chain()
            .map(function (p) { return datastore.find(id, p); })
            .flatten(1)
            .value();

        if (!candidates.length) {
            return false;
        }

        // FIXME; this hardcodes a preference for english over other languages, remove
        // this when the languages param is supported.
        return N3.Util.getLiteralValue(candidates[0].object);
    };

    var Query = function (datastore) {
        this.datastore = datastore;
    };

    Query.prototype.literal = function (id, predicates, languages) {
        return literal(this.datastore, id, predicates, languages);
    };

    var Model = function (datastore, id) {
        this.datastore = datastore;
        this.id = id;
    };

    Model.prototype.literal = function (predicates, languages) {
        return literal(this.datastore, this.id, predicates, languages);
    };

    wald.find.Query = Query;
    wald.find.Model = Model;
})();

// -*- mode: web -*-
// -*- engine: jsx -*-
