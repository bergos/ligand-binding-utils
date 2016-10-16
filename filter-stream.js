var Transform = require('stream').Transform
var util = require('util')

function Filter (filter) {
  if (!(this instanceof Filter)) {
    return new Filter(filter)
  }

  Transform.call(this)

  this._writableState.objectMode = true
  this._readableState.objectMode = true

  this._transform = function (object, encoding, done) {
    if (filter(object)) {
      this.push(object)
    }

    done()
  }
}

util.inherits(Filter, Transform)

module.exports = Filter
