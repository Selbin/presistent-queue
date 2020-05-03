const path = require('path')
const fs = require('fs')
const readStream = require('readline')
const fileName = 'store.txt'
const taskQueue = []

class PresistentQueue {
  constructor (fileName, baseDir, storeDir, delimiter) {
    this.fileName = fileName || 'store.txt'
    this.storeDir = storeDir
    this.taskQueue = []
    this.baseDir = baseDir || __dirname
    this.delimiter = delimiter || '\r\n'
  }

  write (data) {
    this.taskQueue.push(data)
    if (this.taskQueue.length > 9) {
      // queue length greater than 10 we will write to file
      while (this.taskQueue.length !== 0) {
        fs.appendFileSync(path.join(this.baseDir, this.fileName), taskQueue.shift() + '\r\n')
        // write to a new store if file size greater than 1000 byte
        if (fs.statSync(path.join(this.baseDir, fileName)).size > 1000) {
          fs.renameSync(path.join(this.baseDir, fileName), path.join(this.baseDir, this.storeDir, `${new Date().getTime()}.txt`))
        }
      }
    }
  }

  read (cb) {
    try {
      console.log(__dirname)
      fs.readdir(path.join(this.baseDir, this.storeDir), (err, files) => {
        if (err) throw err
        files.forEach((file) => {
          const readLine = readStream.createInterface({
            input: fs.createReadStream(path.join(this.baseDir, this.storeDir, file)),
            output: process.stdout,
            console: false
          })
          readLine.on('line', (line) => cb(null, line))
          readLine.on('close', () => {
            fs.unlink(path.join(this.baseDir, this.storeDir, file), err => { if (err) throw err })
          })
        })
      })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = PresistentQueue
