var React = require('react');

var Editor = React.createClass({

  render: function() {
    return (
      <div>
        <input type="text"
          value={this.props.person.:name}
          onChange={event => this.props.person.:name = event.target.value} />
      </div>
    );
  }

});

module.exports = Editor;
