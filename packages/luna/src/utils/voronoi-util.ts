import * as d3 from 'd3'
import Polygon from './multi-polygon'
import { Point } from '@/utils/index'

const triangleOfEdge = (e: number) => {
  return Math.floor(e / 3)
}

const edgesOfTriangle = (t: number) => {
  return [3 * t, 3 * t + 1, 3 * t + 2]
}

const pointsOfEdge = (delaunay: d3.Delaunay<Point>, e: number) => {
  return [delaunay.triangles[e], delaunay.triangles[delaunay.halfedges[e]]]
}

const oppositeEdge = (delaunay: d3.Delaunay<Point>, e: number) => {
  return delaunay.halfedges[e]
}

const pointsOfTriangle = (delaunay: d3.Delaunay<Point>, t: number) => {
  return edgesOfTriangle(t).map((e) => delaunay.triangles[e])
}

const pointPosition = (
  delaunay: d3.Delaunay<Point>,
  p: number
): d3.Delaunay.Point => {
  return [delaunay.points[p * 2], delaunay.points[p * 2 + 1]]
}

const nextHalfEdge = (e: number) => {
  return e % 3 === 2 ? e - 2 : e + 1
}

const prevHalfEdge = (e: number) => {
  return e % 3 === 0 ? e + 2 : e - 1
}

const edgesAroundPoint = (delaunay: d3.Delaunay<Point>, start, fn) => {
  const result = []
  let incoming = start
  do {
    result.push(incoming)
    const outgoing = nextHalfEdge(incoming)
    incoming = oppositeEdge(delaunay, outgoing)
    fn?.(incoming)
  } while (incoming !== -1 && incoming !== start)
  return result
}

const trianglesAdjacentToTriangle = (
  delaunay: d3.Delaunay<Point>,
  t: number
) => {
  const adjacentTriangles = []
  for (const e of edgesOfTriangle(t)) {
    const opposite = oppositeEdge(delaunay, e)
    if (opposite >= 0) {
      adjacentTriangles.push(triangleOfEdge(opposite))
    }
  }
  return adjacentTriangles
}

const circumCenter = (a, b, c) => {
  const ad = a[0] * a[0] + a[1] * a[1]
  const bd = b[0] * b[0] + b[1] * b[1]
  const cd = c[0] * c[0] + c[1] * c[1]
  const D =
    2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
  return [
    (1 / D) * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
    (1 / D) * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
  ]
}

const triangleCenter = (delaunay: d3.Delaunay<Point>, t: number) => {
  const points = pointsOfTriangle(delaunay, t)
  const vertex = points.map((p) => {
    return pointPosition(delaunay, p)
  })
  return circumCenter(vertex[0], vertex[1], vertex[2])
}

export const mergePolygons = (
  delaunay: d3.Delaunay<Point>,
  polygons: number[]
) => {
  const outlineTriangleNeighbors: Map<number, number> = new Map()
  const triangleCenters: Map<number, d3.Delaunay.Point> = new Map()

  polygons.forEach((polygon) => {
    edgesAroundPoint(delaunay, delaunay.inedges[polygon], (edge) => {
      const neighbor = delaunay.triangles[edge]
      if (!polygons.includes(neighbor)) {
        const opposite = oppositeEdge(delaunay, edge)
        const triangle = triangleOfEdge(edge)
        const neighborTriangle = triangleOfEdge(opposite)
        outlineTriangleNeighbors.set(triangle, neighborTriangle)
        if (!(triangle in triangleCenters)) {
          triangleCenters.set(triangle, triangleCenter(delaunay, triangle))
        }
        if (!(neighborTriangle in triangleCenters)) {
          triangleCenters.set(
            neighborTriangle,
            triangleCenter(delaunay, neighborTriangle)
          )
        }
      }
    })
  })

  const polygon = new Polygon()

  const finished = new Set<number>()
  outlineTriangleNeighbors.forEach((val, key) => {
    if (!finished.has(key)) {
      let current = key
      const head = triangleCenters.get(current)
      polygon.moveTo(head[0], head[1])

      while (!finished.has(current)) {
        finished.add(current)
        current = outlineTriangleNeighbors.get(current)
        const node = triangleCenters.get(current)
        polygon.lineTo(node[0], node[1])
      }
      polygon.closePath()
    }
  })

  return polygon
}
