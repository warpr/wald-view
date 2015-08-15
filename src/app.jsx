/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var React = require('react');
var datastore = require('datastore');
var licensedb = require('license');
var prefixes = require('prefixes');
var wald = require('wald');

//var server = 'https://licensedb.org/data/licensedb';
//var subject = 'https://licensedb.org/id/AGPL-3';
var subject = 'https://licensedb.org/id/copyleft-next-0.3.0';

var main = function (datastore) {

    prefixes(datastore);

    var licenseModel = new wald.Model(datastore, subject);

    React.render (
        <article className="license-group">
            <licensedb.License model={licenseModel} />
            <licensedb.PlainText model={licenseModel} />
        </article>,
        document.getElementById('license-details')
    );
};

/*
datastore.loadTurtle('licensedb.2015-06-06.ttl')
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });
*/
/*
datastore.loadFragments(server, subject)
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });
*/
/*
datastore.loadJsonLD('copyleft-next-0.3.0.jsonld')
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });
*/

datastore.loadJsonLD(document.getElementById('license-data'))
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });

// -*- mode: web -*-
// -*- engine: jsx -*-
