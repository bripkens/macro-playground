var React = require('react');

var Viewer = React.createClass({
  render: function() {
    var name = this.props.person.:name;
    return (
      <h2>{name}</h2>
    );
  }
});

module.exports = Viewer;
