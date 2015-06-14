/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var licensedb = licensedb ? licensedb : {};

(function () {

    var License = React.createClass({
        render: function () {
            var license = this.props.model;

            return (
                <div className="license">
                    <h1>{license.literal('dc:title')}</h1>
                </div>
            );
        }
    });

    licensedb.License = License;

})();

// -*- mode: web -*-
// -*- engine: jsx -*-
