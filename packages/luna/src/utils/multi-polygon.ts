import * as d3 from 'd3'

export default class MultiPolygon
  implements d3.Delaunay.MoveContext, d3.Delaunay.LineContext
{
  path: number[][] = []
  current: number

  moveTo(x: number, y: number) {
    this.path.push([x, y])
    this.switch(this.path.length - 1)
  }

  closePath() {
    const current = this.path[this.current]
    this.path[this.current].push(current[0], current[1])
  }

  lineTo(x: number, y: number) {
    this.path[this.current].push(x, y)
  }

  switch(i: number) {
    this.current = i
  }

  render(): string {
    let result = ''
    this.path.forEach((line) => {
      result += `M${line[0]},${line[1]}`
      for (let i = 2; i < line.length; i += 2) {
        result += `L${line[i]},${line[i + 1]}`
      }
      result += 'Z'
    })
    return result
  }

  static from(points: number[] | number[][]): MultiPolygon {
    const result = new MultiPolygon()
    if (!Array.isArray(points[0])) {
      result.path[0] = points.slice() as number[]
    } else {
      points.forEach((list, i) => {
        result.path[i] = list.slice()
      })
    }
    return result
  }

  toString() {
    return this.path
      .map((line) => {
        return line.join(', ')
      })
      .join('\n')
  }
}
