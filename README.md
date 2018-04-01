# Timer Exector

[![npm](https://img.shields.io/npm/v/timer-exector.svg)](https://www.npmjs.com/package/timer-exector)
[![npm](https://img.shields.io/npm/dy/timer-exector.svg)](https://www.npmjs.com/package/timer-exector)

## Purpose

Exec all events when hit the `maxQueueSize ` or `maxTimeWait` .

You can extends class `TimeExector` and implement `exec(events: any[]){}` method .

## Usage

### Install

```
> npm i timer-exector -S
```

### Import Class

#### TypeScript

```ts
import TimeExector from 'time-exector'
```

#### JavaScript

```js
const TimeExector = require('time-exector').default
```

### Extends class

```js
class DemoTimeExector extends TimeExector {
  async exec(events: any[]): Promise<boolean> {
    events.forEach(event => {
      console.log(event)
    })
    return true
  }
}
```

### Create exector instance

```js
const exector = new DemoTimeExector({
  maxQueueSize: 3,
  maxTimeWait: 3 * 1000,
})
```

### Start the exector before your application start

```js
exector.start()
```

### Exit the exector and wait for every events has been executed .

```js
await exector.exit()
```

## Options

#### maxQueueSize : 

If the queue's length >= `maxQueueSize ` , exec all events immediately and empty the queue . It will be disable when set as `-1` . Default value is `32` .

### maxTimeWait : 

If there is no exec for `maxTimeWait` ms , exec all events immediately . It will be disable when set as `-1` . Default value is `10000` .

## Example

```js
const bluebird = require('bluebird')
const TimeExector = require('time-exector').default

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
```
