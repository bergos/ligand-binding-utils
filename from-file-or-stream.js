var fs = require('fs')

function fromFileOrStream (filename, stream, verbose) {
  return new Promise(function (resolve, reject) {
    if (filename) {
      if (verbose) {
        process.stderr.write('read from: ' + filename + '\n')
      }

      stream = fs.createReadStream(filename)
    }

    var data = ''

    stream.on('data', function (chunk) {
      data += chunk.toString()
    })

    stream.on('end', function () {
      resolve(data)
    })

    stream.on('error', reject)
  })
}

module.exports = fromFileOrStream
