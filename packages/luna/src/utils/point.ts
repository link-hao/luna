import * as d3 from 'd3'
import * as MathJS from 'mathjs'
import { Point } from '@/utils/index'

export const pointsBoundRect = (points: Point[]) => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  points.forEach((point: Point) => {
    if (point[0] > maxX) {
      maxX = point[0]
    } else if (point[0] < minX) {
      minX = point[0]
    }
    if (point[1] > maxY) {
      maxY = point[1]
    } else if (point[1] < minY) {
      minY = point[1]
    }
  })
  return {
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export const pointsConvexHull = (points: Point[]) => {
  return d3.polygonHull(points)
}

export const pointsMinBoundingRect = (points: Point[]) => {
  const hull = pointsConvexHull(points)
  const edges = []
  for (let i = 0; i < hull.length - 1; i++) {
    edges.push([hull[i + 1][0] - hull[i][0], hull[i + 1][1] - hull[i][1]])
  }
  const angles = [
    ...new Set(
      edges.map((edge) => {
        return Math.abs(Math.atan2(edge[1], edge[0]) % (Math.PI / 2))
      })
    ),
  ]
  const rotations = angles.map((angle) => {
    return [
      [Math.cos(angle), Math.cos(angle - Math.PI / 2)],
      [Math.cos(angle + Math.PI / 2), Math.cos(angle)],
    ]
  })
  const rotPoints = rotations.map((rotation) => {
    return MathJS.multiply(
      MathJS.matrix(rotation),
      MathJS.transpose(MathJS.matrix(hull))
    ).toArray()
  })
  const minXY = rotPoints.map((pMat) => {
    const minValues = MathJS.min(pMat, 1)
    return [minValues[0], minValues[1]]
  })
  const maxXY = rotPoints.map((pMat) => {
    const maxValues = MathJS.max(pMat, 1)
    return [maxValues[0], maxValues[1]]
  })
  const minX = minXY.map((m) => m[0])
  const minY = minXY.map((m) => m[1])
  const maxX = maxXY.map((m) => m[0])
  const maxY = maxXY.map((m) => m[1])

  const areas = minX.map((_, i) => {
    return (maxX[i] - minX[i]) * (maxY[i] - minY[i])
  })
  const bestIdx = areas.reduce(
    (iMax, x, i, arr) => (x < arr[iMax] ? i : iMax),
    0
  )
  const x1 = maxX[bestIdx]
  const x2 = minX[bestIdx]
  const y1 = maxY[bestIdx]
  const y2 = minY[bestIdx]
  const r = rotations[bestIdx]
  const minRect = []
  minRect.push(MathJS.multiply([x1, y2], r))
  minRect.push(MathJS.multiply([x2, y2], r))
  minRect.push(MathJS.multiply([x2, y1], r))
  minRect.push(MathJS.multiply([x1, y1], r))
  return minRect
}

export const pointsDistance = (a: Point, b: Point) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}
