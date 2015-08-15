/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var N3 = require('n3/browser/n3-browser');
var React = require('react');
var _ = require('underscore');
var s = require('underscore.string');

var _array = function (item) {
    return _(item).isArray() ? item : [ item ];
};

var Image = React.createClass({
    propTypes: {
      src: React.PropTypes.oneOfType([
          React.PropTypes.array,
          React.PropTypes.string
      ]).isRequired
    },
    render: function () {
        var src = _array(this.props.src);
        if (!src.length) {
            return null;
        }

        // try to guess the largest image, looks for NNNNxYYY patterns in the iri/filename.
        var sizes = _(src).map(function (lnk) {
            var size = lnk.match(/([0-9]+)x([0-9]+)/);
            if (size.length > 2) {
                return parseInt(size[1], 10) * parseInt(size[2], 10);
            } else {
                return false;
            }
        });

        var max = 0;
        var iri = src[0];
        for (var i = 0; i < sizes.length; i++) {
            if (sizes[i] > max) {
                max = sizes[i];
                iri = src[i];
            }
        }

        if (!iri) {
            return null;
        }

        return <img src={iri} style={{maxWidth: 128}} />;
    }
});

var QName = React.createClass({
    propTypes: {
        datastore: React.PropTypes.instanceOf(N3.Store).isRequired,
        iri: React.PropTypes.string.isRequired
    },
    render: function () {
        var s_iri = s(this.props.iri);
        var qname = this.props.iri;
        var prefixed = false;

        _(this.props.datastore._prefixes).find(function (basePath, prefix) {
            if (s_iri.startsWith(basePath)) {
                qname = qname.replace(basePath, prefix + ':');
                prefixed = true;
                return true;
            }

            return false;
        });

        if (!prefixed) {
            qname = this.props.iri.slice(this.props.iri.lastIndexOf('/') + 1)
        }

        return <a href={this.props.iri}>{qname}</a>;
    }
});

var KeyValue = React.createClass({
    propTypes: {
        predicate: React.PropTypes.string.isRequired,
        // FIXME: should be instanceOf(wald.Model), but that is failing for some reason
        subject: React.PropTypes.object.isRequired
    },
    render: function () {
        var self = this;
        var predicate = self.props.predicate;

        var values = self.props.subject.list(predicate);

        var prefix = '';
        var label = predicate;

        var parts = predicate.split(':');
        if (parts.length == 2) {
            prefix = parts[0];
            label = parts[1];
        }

        var renderValue = function (value) {
            var valueStr = '';
            if (value) {
                if (N3.Util.isIRI(value)) {
                    valueStr = <QName datastore={self.props.subject.datastore} iri={value} />;
                } else {
                    valueStr = N3.Util.getLiteralValue(value);
                }
            }

            var key = predicate + ' ' + value;

            return (
                <span key={key}>
                    <div className="label-wrapper">
                        <span className="prefix">{prefix}:</span><span
                            className="label">{label}:</span>{' '}
                    </div>
                    <span className="value">{valueStr}</span><br />
                </span>
            );
        };

        return <span>{_(values).map(renderValue)}</span>;
    }
});

exports.Image = Image;
exports.KeyValue = KeyValue;
exports.QName = QName;

// -*- mode: web -*-
// -*- engine: jsx -*-
