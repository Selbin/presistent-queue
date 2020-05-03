const path = require('path')
const fs = require('fs')
const readStream = require('readline')
const fileName = 'store.txt'
const taskQueue = []

const write = (data, dirPath) => {
  taskQueue.push(data)
  if (taskQueue.length > 9) {
    while (taskQueue.length !== 0) {
      writeToFile(taskQueue.shift, dirPath)
    }
  }
}

const writeToFile = (taskQueueData, dirPath) => {
  fs.appendFileSync(path.join(dirPath, fileName), taskQueueData + '\r\n')
  if (fs.statSync(path.join(__dirname, fileName)).size > 1000) {
    fs.renameSync(path.join(__dirname, fileName), path.join(__dirname, 'bigStore/', `${new Date().getTime()}.txt`))
  }
}

const read = (dirPath, cb) => {
  try {
    fs.readdir(dirPath, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        const readLine = readStream.createInterface({ input: path.join(dirPath, file) })
        readLine.on('line', (line) => {
          cb(null, line)
        })
        readLine.on('close', () => {
          fs.unlink(path.join(__dirname, 'bigStore/', file))
        })
      })
    })
  } catch (error) {
    cb(error)
  }
}

module.exports = { write, read }
