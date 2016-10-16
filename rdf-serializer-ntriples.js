var Transform = require('stream').Transform
var util = require('util')

function NTriplesSerializer () {
  if (!(this instanceof NTriplesSerializer)) {
    return new NTriplesSerializer()
  }

  Transform.call(this, {encoding: 'utf8'})

  this._writableState.objectMode = true

  var self = this

  this._transform = function (triple, encoding, done) {
    self.push(triple.toString() + '\n')

    done()
  }
}

util.inherits(NTriplesSerializer, Transform)

module.exports = NTriplesSerializer
