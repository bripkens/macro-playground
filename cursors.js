var mori = require('mori');
// var assert = require('assert');
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

window.fromJs = fromJs;


module.exports = fromJs;

// function testCollection() {
//   var cursor = fromJs([1, 2, 3]);
//   assert.equal(cursor.get(0), 1);
//   assert.equal(cursor.get(1), 2);
//   assert.equal(cursor.get(2), 3);
// }

// function testNestedObj() {
//   var rootCursor = fromJs({
//     name: 'Tom Mason',
//     address: {
//       street: 'Homestr. 11',
//       zipCode: '123 AWE',
//       city: 'SOME',
//       country: {
//         name: 'Marsian',
//         tld: 'mars'
//       }
//     }
//   });

//   assert.equal(rootCursor.get('name'), 'Tom Mason');

//   var addressCursor = rootCursor.get('address');
//   assert(addressCursor instanceof Cursor);
//   assert.equal(addressCursor.get('street'), 'Homestr. 11');

//   var countryCursor = addressCursor.get('country');
//   assert(countryCursor instanceof Cursor);
//   assert.equal(countryCursor.get('tld'), 'mars');
// }

// function testSetter() {
//   var cursor = fromJs({
//     name: 'Tom'
//   });

//   cursor.set('age', 41);
//   assert.equal(cursor.get('age'), 41);
// }

// function testNestedSetter() {
//   var rootCursor = fromJs({
//     name: 'Tom Mason',
//     address: {
//       street: 'Homestr. 11',
//       zipCode: '123 AWE',
//       city: 'SOME',
//       country: {
//         name: 'Marsian',
//         tld: 'mars'
//       }
//     }
//   });

//   var addressCursor = rootCursor.get('address');
//   addressCursor.set('street', 'Workstr. 12');
//   assert.equal(addressCursor.get('street'), 'Workstr. 12');

//   addressCursor = rootCursor.get('address');
//   assert.equal(addressCursor.get('street'), 'Workstr. 12');
// }

// testCollection();
// testNestedObj();
// testSetter();
// testNestedSetter();
// console.log('Awesome stuff!');
