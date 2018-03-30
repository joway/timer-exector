const bluebird = require("bluebird")
const TimeExector = require("./dist/src").default
class DemoTimeExector extends TimeExector {
  async exec(events) {
    events.forEach(event => {
      console.log(event)
    })
    return true
  }
}

const events = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const exector = new DemoTimeExector({
  maxQueueSize: 3,
  maxTimeWait: 3 * 1000,
})
console.log('start')
exector.start()
const main = async () => {
  for (const event of events) {
    exector.enqueue(event)
    await bluebird.delay(700)
  }
  await exector.exit()
  process.exit(0)
}
main()
// output:
// start
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
