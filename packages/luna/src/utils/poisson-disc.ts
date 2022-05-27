import { randomLcg } from 'd3-random'
import { Point } from '@/utils'

export class PoissonDisc {
  public readonly width: number
  public readonly height: number
  public readonly radius: number
  public readonly seed: number

  public next: () => Point

  public first: Point

  constructor(options: {
    width: number
    height: number
    radius: number
    seed: number
    points?: Point[]
  }) {
    const { width, height, radius, seed, points } = options
    this.width = width
    this.height = height
    this.radius = radius
    this.first = [width / 2, height / 2]
    this.seed = seed

    const random = randomLcg(seed)

    const k = 30
    const radius2 = radius * radius
    const R = 3 * radius2
    const cellSize = radius * Math.SQRT1_2
    const gridWidth = Math.ceil(width / cellSize)
    const gridHeight = Math.ceil(height / cellSize)
    const grid = new Array<Point>(gridWidth * gridHeight)
    const queue: Point[] = points || []
    let queueSize = queue.length
    let sampleSize = queue.length

    const sample = (x: number, y: number): Point => {
      const s: Point = [x, y]
      queue.push(s)
      grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s
      ++sampleSize
      ++queueSize
      return s
    }

    const distance = (x: number, y: number) => {
      let i = (x / cellSize) | 0
      let j = (y / cellSize) | 0
      let i0 = Math.max(i - 2, 0)
      let j0 = Math.max(j - 2, 0)
      let i1 = Math.min(i + 3, gridWidth)
      let j1 = Math.min(j + 3, gridHeight)

      for (j = j0; j < j1; ++j) {
        const o = j * gridWidth
        for (i = i0; i < i1; ++i) {
          const s = grid[o + i]
          if (s) {
            const dx = s[0] - x
            const dy = s[1] - y
            if (dx * dx + dy * dy < radius2) return false
          }
        }
      }

      return true
    }

    this.next = function (): Point | undefined {
      if (!sampleSize) return sample(this.first[0], this.first[1])
      while (queueSize) {
        const i = (random() * queueSize) | 0
        const s = queue[i]

        for (let j = 0; j < k; ++j) {
          const a = 2 * Math.PI * random()
          const r = Math.sqrt(random() * R + radius2)
          const x = s[0] + r * Math.cos(a)
          const y = s[1] + r * Math.sin(a)

          if (0 <= x && x < width && 0 <= y && y < height && distance(x, y)) {
            return sample(x, y)
          }
        }

        queue[i] = queue[--queueSize]
        queue.length = queueSize
      }
    }
  }
}
