
wald:view
=========

A collection of javascript modules to load Linked Data into a datastore,
query it for information about a particular subject, and render that
information using a few React components built for displaying Linked Data.

usage
-----

If you can require .jsx files directly in your project you can require the
.jsx sources directly using:

    var view = require('wald-view/jsx');

Otherwise, use:

    var view = require('wald-view');

You'll need something like webpack or browserify to use this client-side,
no pure browser version is provided.


License
=======

Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>

This program is free software: you can redistribute it and/or modify
it under the terms of copyleft-next 0.3.0.  See [LICENSE.txt](LICENSE.txt).
