/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var React = require('react');
var N3 = require('n3/browser/n3-browser');
var _ = require('underscore');
var s = require('underscore.string');
var query = require('query');
var $ = require('jquery');

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

        _(this.props.datastore._prefixes).find(function (basePath, prefix) {
            if (s_iri.startsWith(basePath)) {
                qname = qname.replace(basePath, prefix + ':');
                return true;
            }

            return false;
        });

        return <a href={this.props.iri}>{qname}</a>;
    }
});

var KeyValue = React.createClass({
    propTypes: {
        predicate: React.PropTypes.string.isRequired,
        subject: React.PropTypes.string.isRequired
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

var License = React.createClass({
    propTypes: {
        model: React.PropTypes.instanceOf(query.Model).isRequired,
    },
    render: function () {
        var license = this.props.model;
        var hasVersion = license.literal('dc:hasVersion');
        var versionString = null;
        if (hasVersion) {
            versionString = <span>version {hasVersion}</span>;
        }

        return (
            <div className="license">
                <Image src={license.links('foaf:logo')} />
                <h1>{license.literal('dc:title')}<br />
                    {versionString}
                </h1>
                <KeyValue subject={license} predicate="li:id" />
                <KeyValue subject={license} predicate="li:name" />
                <hr />
                <KeyValue subject={license} predicate="dc:title" />
                <KeyValue subject={license} predicate="dc:identifier" />
                <KeyValue subject={license} predicate="dc:hasVersion" />
                <KeyValue subject={license} predicate="dc:creator" />
                <hr />
                <KeyValue subject={license} predicate="li:plaintext" />
                <KeyValue subject={license} predicate="cc:legalcode" />
                <KeyValue subject={license} predicate="li:libre" />
                <hr />
                <KeyValue subject={license} predicate="cc:permits" />
                <KeyValue subject={license} predicate="cc:requires" />
                <hr />
                <KeyValue subject={license} predicate="dc:replaces" />
                <hr />
                <KeyValue subject={license} predicate="spdx:licenseId" />
            </div>
        );
    }
});

var PlainText = React.createClass({
    getInitialState: function () {
        return { body: 'first KOEK' };
    },
    componentDidMount: function () {
        if (this.props) {
            this.loadDocument(this.props);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadDocument(nextProps);
    },
    loadDocument: function (props) {
        var self = this;
        var values = props.model.list('li:plaintext');

        var plaintext = _(values).find(function (iri) {
            return s(iri).startsWith('https://licensedb.org/id/');
        });

        if (plaintext) {
            $.get(plaintext).then(function (data) {
                self.setState({ body: data });
            });
        }
    },
    render: function () {
        return (
            <div className="license-plain-text">
                <pre>{this.state.body}</pre>
            </div>
        );
    }
});

exports.Image = Image;
exports.KeyValue = KeyValue;
exports.License = License;
exports.PlainText = PlainText;
exports.QName = QName;

// -*- mode: web -*-
// -*- engine: jsx -*-
