var Promise = require('bluebird')
var rdf = require('rdf-ext')
var util = require('util')
var Transform = require('stream').Transform

function ToTriple (options) {
  if (!(this instanceof ToTriple)) {
    return new ToTriple(options)
  }

  Transform.call(this)

  this._writableState.objectMode = true
  this._readableState.objectMode = true

  var self = this
  var rowId = 0

  options.object = options.object || {}

  var mapSubject = function (predicate, row, rowId) {
    return Promise.resolve().then(function () {
      var property = options.predicate[predicate]
      var object = property in row ? row[property] : null

      if (predicate in options.subject) {
        return options.subject[predicate].call(self, object, row, rowId)
      } else {
        if (typeof options.subject === 'function') {
          return options.subject.call(self, object, row, rowId)
        } else {
          return options.subject
        }
      }
    })
  }

  var mapObject = function (predicate, row, rowId) {
    return Promise.resolve().then(function () {
      var property = options.predicate[predicate]
      var object = property in row ? row[property] : null

      if (predicate in options.object) {
        if (typeof options.object[predicate] === 'function') {
          return options.object[predicate].call(self, object, row, rowId)
        } else {
          return options.object[predicate]
        }
      } else {
        return object.toString()
      }
    })
  }

  this._transform = function (row, encoding, done) {
    Promise.all(Object.keys(options.predicate).map(function (predicate) {
      return Promise.all([
        mapSubject(predicate, row, rowId),
        mapObject(predicate, row, rowId)
      ]).spread(function (subject, object) {
        if (typeof subject === 'string') {
          subject = rdf.createNamedNode(subject)
        }

        if (typeof object === 'string') {
          object = rdf.createLiteral(object)
        }

        if (subject && object) {
          return rdf.createTriple(
            subject,
            rdf.createNamedNode(predicate),
            object
          )
        }
      })
    })).then(function (triples) {
      triples.filter(function (triple) {
        return triple
      }).forEach(function (triple) {
        self.push(triple)
      })

      rowId++

      done()
    })
  }
}

util.inherits(ToTriple, Transform)

module.exports = ToTriple
