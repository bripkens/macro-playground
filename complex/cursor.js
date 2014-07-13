var mori = require('mori');
var EventEmitter = require('events').EventEmitter;

function isImmutableNative(v) {
  return typeof(v) !== 'object' ||
    v === null ||
    v instanceof RegExp;
}

function RootCursor(data) {
  EventEmitter.call(this);

  this.get = function get(key) {
    var val = mori.get(this.val(), key);
    if (isImmutableNative(val)) {
      return val;
    } else {
      return new Cursor(this, key);
    }
  }.bind(this);

  this.set = function set(prop, value) {
    data = mori.assoc(data, prop, value);
    this.emit('change');
  }.bind(this);

  this.val = function val() { return data };
}
RootCursor.prototype = Object.create(EventEmitter.prototype);


function Cursor(parentCursor, path) {
  EventEmitter.call(this);
  var that = this;

  this.get = function get(key) {
    var val = mori.get(this.val(), key);
    if (isImmutableNative(val)) {
      return val;
    } else {
      return new Cursor(this, key);
    }
  }.bind(this);

  this.set = function set(prop, value) {
    var data = this.val();
    data = mori.assoc(data, prop, value);
    parentCursor.set(path, data);
    this.emit('change');
  };

  this.val = function val() {
    var val = parentCursor.val();
    return mori.get(val, path);
  };
}
Cursor.prototype = Object.create(EventEmitter.prototype);


function fromJs(jsObj) {
  var moriObj = mori.js_to_clj(jsObj);
  return new RootCursor(moriObj, []);
}

module.exports.fromJs = fromJs;
