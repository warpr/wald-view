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

var subject = document.getElementById('license-data').getAttribute('about');

var main = function (datastore) {

    prefixes(datastore);

    var licenseModel = new wald.Model(datastore, subject);

    React.render (
        <article className="license-group">
            <licensedb.Heading model={licenseModel} />
            <div className="license-group">
                <licensedb.License model={licenseModel} />
                <licensedb.PlainText model={licenseModel} />
            </div>
        </article>,
        document.getElementById('license-details')
    );
};

datastore.loadJsonLD(document.getElementById('license-data'))
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });

// -*- mode: web -*-
// -*- engine: jsx -*-
