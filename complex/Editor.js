var __ref$1365 = require('react');
var React$1367 = __ref$1365;
var __ref$1369 = React$1367.createClass({
        render: function () {
            return React$1367.DOM.div(null, React$1367.DOM.input({
                type: 'text',
                value: this.props.person.get('name'),
                onChange: function (__fa_args$1375, event$1376) {
                    return this.props.person.set('name', event$1376.target.value);
                }.bind(this, arguments)
            }));
        }
    });
var Editor$1371 = __ref$1369;
module.exports = Editor$1371;