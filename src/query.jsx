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

    var list = function (datastore, id, predicates) {
        if (!_(predicates).isArray()) {
            predicates = [ predicates ];
        }

        var candidates = _(predicates)
            .chain()
            .map(function (p) { return datastore.find(id, p); })
            .flatten(1)
            .value();

        return _(candidates).pluck('object');
    };

    var first = function (datastore, id, predicates) {
        var items = list(datastore, id, predicates);
        return items.length ? items[0] : null;
    }

    var links = function (datastore, id, predicates) {
        return _(list(datastore, id, predicates))
            .filter(function (item) { return N3.Util.isIRI(item); })
    };

    var literal = function (datastore, id, predicates, languages) {
        // languages is currently ignored.  The idea for that param is to build a
        // fallback system/mapping where you can call something like preferredLanguage("nl")
        // which would return all language tags which should match that (e.g. "nl_NL",
        // "nl_BE", etc..).

        var value = first(datastore, id, predicates);
        return value ? N3.Util.getLiteralValue(value) : null;
    };

    var Query = function (datastore) {
        this.datastore = datastore;
    };

    Query.prototype.list = function (id, predicates) {
        return list(this.datastore, id, predicates);
    };

    Query.prototype.first = function (id, predicates) {
        return first(this.datastore, id, predicates);
    };

    Query.prototype.links = function (id, predicates) {
        return links(this.datastore, id, predicates);
    };

    Query.prototype.literal = function (id, predicates, languages) {
        return literal(this.datastore, id, predicates, languages);
    };

    var Model = function (datastore, id) {
        this.datastore = datastore;
        this.id = id;
    };

    Model.prototype.list = function (predicates) {
        return list(this.datastore, this.id, predicates);
    };

    Model.prototype.first = function (predicates) {
        return first(this.datastore, this.id, predicates);
    };

    Model.prototype.links = function (predicates) {
        return links(this.datastore, this.id, predicates);
    };

    Model.prototype.literal = function (predicates, languages) {
        return literal(this.datastore, this.id, predicates, languages);
    };

    wald.find.Query = Query;
    wald.find.Model = Model;
})();

// -*- mode: web -*-
// -*- engine: jsx -*-
