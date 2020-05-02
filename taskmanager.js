const path = require('path')
const fs = require('fs')

const fileName = 'store.txt'
const taskQueue = []

const fillTaskQueue = (data) => {
  taskQueue.push(data)
  if (taskQueue.length > 9) {
    while (taskQueue.length !== 0) {
      writeFromQueue(taskQueue.shift)
    }
  }
}

const writeFromQueue = taskQueueData => {
  fs.appendFileSync(path.join(__dirname, fileName), taskQueueData + '\r\n')
  if (fs.statSync(path.join(__dirname, fileName)).size > 1000) {
    fs.renameSync(path.join(__dirname, fileName), path.join(__dirname, 'bigStore/', `${new Date().getTime()}.txt`))
  }
}

const readFromFile = () => {
  fs.readdir(path.join(__dirname, 'bigStore/'), (err, files) => {
    if (err) throw err
    files.forEach((file) => {
      fs.readFile(path.join(__dirname, 'bigStore/', file), 'utf8', (err, data) => {
        if (err) throw err
        console.log('---------------------------------------')
        console.log(data)
        fs.unlink(path.join(__dirname, 'bigStore/', file), (err) => {
          if (err) throw err
          console.log('file read and removed')
        })
      })
    })
  })
}

module.exports = { fillTaskQueue, readFromFile }
