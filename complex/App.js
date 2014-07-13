var __ref$1365 = require('mori');
var mori$1367 = __ref$1365;
var __ref$1369 = require('./cursor');
var cursor$1371 = __ref$1369;
var __ref$1373 = require('react');
var React$1375 = __ref$1373;
var __ref$1377 = require('./Viewer');
var Viewer$1379 = __ref$1377;
var __ref$1381 = require('./Editor');
var Editor$1383 = __ref$1381;
var __ref$1385 = React$1375.createClass({
        getInitialState: function () {
            return cursor$1371.fromJs({ person: { name: 'Tom Mason' } });
        },
        componentDidMount: function () {
            this.state.on('change', function () {
                this.setState(this.state);
            }.bind(this));
        },
        render: function () {
            return React$1375.DOM.div(null, Viewer$1379({ person: this.state.get('person') }), Editor$1383({ person: this.state.get('person') }));
        }
    });
var App$1387 = __ref$1385;
module.exports = App$1387;