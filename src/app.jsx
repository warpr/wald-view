/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var main = function (datastore) {

    datastore.addPrefix('lidb', 'https://licensedb.org/id/');

    var agpl3 = new wald.find.Model(datastore, 'lidb:AGPL-3');

    React.render (
        <licensedb.License model={agpl3} />,
        document.getElementById('main')
    );
};

wald.find.loadTurtle('licensedb.2015-06-06.ttl')
    .then(main)
    .catch(function (err) {
        console.log ('ERROR: ', err);
    });

// -*- mode: web -*-
// -*- engine: jsx -*-
