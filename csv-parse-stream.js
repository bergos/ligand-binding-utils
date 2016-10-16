var util = require('util')
var Transform = require('stream').Transform

function CsvParseStream (options) {
  if (!(this instanceof CsvParseStream)) {
    return new CsvParseStream(options)
  }

  Transform.call(this)

  this._readableState.objectMode = true

  var columns = null

  options = options || {}
  options.delimiter = options.delimiter || ','

  this._transform = function (row, encoding, done) {
    var values = row.toString(options.encoding).split(options.delimiter)

    if (options.columns && !columns) {
      columns = values

      return done()
    }

    if (columns) {
      this.push(values.reduce(function (object, value, index) {
        object[columns[index]] = value

        return object
      }, {}))
    } else {
      this.push(values)
    }

    done()
  }
}

util.inherits(CsvParseStream, Transform)

module.exports = CsvParseStream
