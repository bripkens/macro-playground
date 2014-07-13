var mori = require('mori');
var cursor = require('./cursor');
var React = require('react');
var Viewer = require('./Viewer');
var Editor = require('./Editor');

var App = React.createClass({
  getInitialState: function() {
    return cursor.fromJs({
      person: {
        name: 'Tom Mason'
      }
    });
  },

  componentDidMount: function() {
    this.state.on('change', function() {
      this.setState(this.state);
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <Viewer person={this.state.:person} />
        <Editor person={this.state.:person} />
      </div>
    );
  }
});

module.exports = App;
