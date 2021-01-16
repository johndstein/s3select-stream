const { Transform  } = require('stream')

class Ssplit extends Transform {
  constructor() {
    super({ objectMode: true })
  }
  _transform(event, x, done) {
    // console.log('EVENT', event.toString())
    const lines = ((this.soFar != null ? this.soFar: "") + event.toString()).split(/\r?\n/)
    this.soFar = lines.pop()
    for (var line of lines) { this.push(line) }
    done()
  }
  _flush(done) {
  this.push(this.soFar != null ? this.soFar:"");
    done();
  }
}

class S3SelectStream extends Transform {
  constructor() {
    super({ objectMode: true })
  }
  _transform(event, x, done) {
    // console.log('transform', event)
    if (event.Records) {
      // console.log('records')
      this.push(event.Records.Payload)
    }
    done()
  }
}

class Parse extends Transform {
  constructor() {
    super({ objectMode: true })
  }
  _transform(event, x, done) {
    // console.log('parsing')
    done(null, JSON.parse(event))
  }
  _flush(done) {
    // console.log('parse flushing')
    done()
  }
}

class Stringify extends Transform {
  constructor() {
    super({ objectMode: true })
  }
  _transform(event, x, done) {
    // console.log('stringifying')
    done(null, `${JSON.stringify(event)}\n`)
  }
  _flush(done) {
    // console.log('stringify flushing')
    done()
  }
}

exports = module.exports = {
  S3SelectStream,
  Parse,
  Stringify,
  Ssplit,
}