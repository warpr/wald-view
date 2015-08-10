/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var httpinvoke = require('httpinvoke/httpinvoke-browser');
var s = require('underscore.string');
var wald = require("wald");

var License = React.createClass({
    propTypes: {
        model: React.PropTypes.instanceOf(wald.Model).isRequired,
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
                <wald.components.Image src={license.links('foaf:logo')} />
                <h1>{license.literal('dc:title')}<br />
                    {versionString}
                </h1>
                <wald.components.KeyValue subject={license} predicate="li:id" />
                <wald.components.KeyValue subject={license} predicate="li:name" />
                <hr />
                <wald.components.KeyValue subject={license} predicate="dc:title" />
                <wald.components.KeyValue subject={license} predicate="dc:identifier" />
                <wald.components.KeyValue subject={license} predicate="dc:hasVersion" />
                <wald.components.KeyValue subject={license} predicate="dc:creator" />
                <hr />
                <wald.components.KeyValue subject={license} predicate="li:plaintext" />
                <wald.components.KeyValue subject={license} predicate="cc:legalcode" />
                <wald.components.KeyValue subject={license} predicate="li:libre" />
                <hr />
                <wald.components.KeyValue subject={license} predicate="cc:permits" />
                <wald.components.KeyValue subject={license} predicate="cc:requires" />
                <hr />
                <wald.components.KeyValue subject={license} predicate="dc:replaces" />
                <hr />
                <wald.components.KeyValue subject={license} predicate="spdx:licenseId" />
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
            httpinvoke(plaintext, 'GET').then(function (data) {
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

exports.License = License;
exports.PlainText = PlainText;

// -*- mode: web -*-
// -*- engine: jsx -*-
