import * as _ from 'lodash'
import * as bluebird from 'bluebird'

interface Options {
  maxQueueSize?: number
  maxTimeWait?: number // ms
}

const DEFAULT_OPTIONS = {
  maxQueueSize: 32,
  maxTimeWait: 10 * 1000,
}

abstract class TimeExector {
  private buffer: any[]
  private cursor: number
  private alive: boolean
  private stopped: boolean
  private forzen: boolean

  constructor(public options: Options = {}, ) {
    this.options = options
    this.cursor = 0
    this.buffer = []

    this.alive = true
    this.stopped = false
    this.forzen = false
  }

  abstract async exec(events: any[]): Promise<boolean>

  enqueue(event: any): boolean {
    if (this.forzen) {
      return false
    }
    this.buffer.push(event)
    return true
  }

  start() {
    return this.loop()
  }

  freeze() {
    this.forzen = true
  }

  unfreeze() {
    this.forzen = false
  }

  stop() {
    this.alive = false
  }

  async exit() {
    // prevent to enqueue new event
    this.freeze()

    this.stop()
    // check is stopped
    while (!this.stopped) {
      await bluebird.delay(50)
    }
  }

  private async loop() {
    while (this.alive) {
      const queueSize = this.buffer.length
      const cursor = this.cursor
      const maxQueueSize = this.options.maxQueueSize !== undefined ? this.options.maxQueueSize : DEFAULT_OPTIONS.maxQueueSize
      const maxTimeWait = this.options.maxTimeWait !== undefined ? this.options.maxTimeWait : DEFAULT_OPTIONS.maxTimeWait

      if ((maxQueueSize >= 0 && queueSize >= maxQueueSize)
        || (maxTimeWait >= 0 && cursor >= maxTimeWait)) {
        await this.exec(this.buffer)
        // clean buffer and cursor
        this.buffer.length = 0
        this.cursor = 0
      }

      await bluebird.delay(1000)
      this.cursor += 1000
    }

    // clean final buffer
    await this.exec(this.buffer)
    this.buffer.length = 0
    this.cursor = 0

    this.stopped = true
  }
}

export default TimeExector
