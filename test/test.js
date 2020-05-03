const assert = require('assert')
const presistentQueue = require('../presistentQueue')
const prequeue = new presistentQueue('store.txt', __dirname,'bigStore', '\r\n' )

describe('function to test write', () => {
  it('verifying write',  () => {
    const arr1 = []
    const arr2 = []
    for (let i=0 ; i <= 300 ; i++ ){
      prequeue.write(i)
      arr1.push(i)
    }
    prequeue.read((err, data)=> {
      if (err) throw err
      arr2.push(data*1)
    })
    setTimeout(()=> {
      assert.equal(JSON.stringify(arr1.slice(0,arr2.length)), JSON.stringify(arr2))
    }, 10000)
    
  })
})
