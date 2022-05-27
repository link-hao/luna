import { computed, reactive, ref, Ref, shallowRef } from 'vue'
import { Point } from '@/utils'
import { Quadtree, quadtree } from 'd3-quadtree'
import { RandomFactory } from '@/utils/random'
import { useSeedStore } from '@/service/seed'
import { Delaunay } from 'd3-delaunay'

const useMap = <T>() => {
  const map = shallowRef<Record<number, Record<number, T>>>({})

  const setMap = (x: number, y: number, v: T) => {
    const row = map[y] || {}
    row[x] = v
    map[y] = row
  }

  const getMap = (x: number, y: number): Point => {
    const row = map[y] || {}
    return row[x]
  }

  const setIfNotExistMap = (x: number, y: number, v: T) => {
    if (getMap(x, y)) return false
    setMap(x, y, v)
    return true
  }

  return {
    map,
    setMap,
    getMap,
    setIfNotExistMap,
  }
}

interface PoissonDiscSamplerOptions {
  cellSize: number
  blockSize: number
  random: RandomFactory
  points?: Point[]
}

const poissonDiscSamplerMap = (opt: PoissonDiscSamplerOptions) => {
  const { cellSize, random, blockSize } = opt
  const k = 50
  const radius = cellSize / Math.SQRT1_2
  const radius2 = radius * radius
  const R = 3 * radius2
  const gridMap = useMap<Point>()
  const blockMap = useMap<boolean>()

  const far = (x: number, y: number) => {
    let i = Math.floor(x / cellSize)
    let j = Math.floor(y / cellSize)

    const i0 = i - 2
    const j0 = j - 2
    const i1 = i + 3
    const j1 = j + 3

    for (j = j0; j < j1; ++j) {
      for (i = i0; i < i1; ++i) {
        const p: Point = gridMap.getMap(i, j)
        if (p) {
          const dx = p[0] - x
          const dy = p[1] - y
          if (dx * dx + dy * dy < radius2) return false
        }
      }
    }

    return true
  }

  const sampleAround = (point: Point, blockRect: number[]): Point => {
    for (let j = 0; j < k; ++j) {
      const a = 2 * Math.PI * random(),
        r = Math.sqrt(random() * R + radius2),
        x = point[0] + r * Math.cos(a),
        y = point[1] + r * Math.sin(a)
      if (
        x >= blockRect[0] &&
        x < blockRect[2] &&
        y >= blockRect[1] &&
        y < blockRect[3] &&
        far(x, y)
      ) {
        return [x, y]
      }
    }
  }

  const getBlock = (point: Point): Point => {
    const x = Math.floor(point[0] / blockSize)
    const y = Math.floor(point[1] / blockSize)
    return [x, y]
  }

  const blockRect = (block: Point) => {
    const x = block[0] * blockSize
    const y = block[1] * blockSize
    return [x, y, x + blockSize, y + blockSize]
  }

  const buildBlock = (point: Point, list: Point[] = []): Point[] => {
    const block = getBlock(point)
    const exist = !blockMap.setIfNotExistMap(block[0], block[1], true)
    if (exist) return []
    const rect = blockRect(block)

    const inserted = gridMap.setIfNotExistMap(
      Math.floor(point[0] / cellSize),
      Math.floor(point[1] / cellSize),
      point
    )
    if (inserted) {
      list.push(point)
    }

    const queue: Point[] = []
    queue.push(point)
    let queueSize: number = queue.length
    while (queueSize > 0) {
      const p = sampleAround(queue[0], rect)
      if (p) {
        gridMap.setMap(
          Math.floor(p[0] / cellSize),
          Math.floor(p[1] / cellSize),
          p
        )
        queue[queueSize] = p
        queueSize++
        list.push(p)
      } else {
        queueSize--
        queue[0] = queue[queueSize]
      }
    }

    return list
  }

  const buildBlockAround = (point: Point, list: Point[] = []) => {
    buildBlock(point, list)

    const block = getBlock(point)
    const rect = blockRect(block)
    const blockCenter: Point = [
      (rect[2] - rect[0]) / 2,
      (rect[3] - rect[1]) / 2,
    ]

    const quadrant = [
      point[0] - blockCenter[0] > 0 ? 1 : -1,
      point[1] - blockCenter[1] > 0 ? 1 : -1,
    ]

    const otherBlockDirs = [
      [1, -1],
      [-1, 1],
      [1, 1],
    ]
    const otherBlockOffset = [
      [1, 0],
      [0, 1],
      [1, 1],
    ]

    otherBlockDirs.forEach((dir, idx) => {
      const x = quadrant[0] * dir[0] * otherBlockOffset[idx][0]
      const y = quadrant[1] * dir[1] * otherBlockOffset[idx][1]
      const newBlock: Point = [block[0] + x, block[1] + y]
      const newBlockRect = blockRect(newBlock)

      const newBlockPoint: Point = sampleAround(
        [
          random() * blockSize + newBlockRect[0],
          random() * blockSize + newBlockRect[1],
        ],
        newBlockRect
      )

      if (newBlockPoint) {
        buildBlock(newBlockPoint, list)
      }
    })

    return list
  }

  return (point: Point) => {
    return buildBlockAround(point)
  }
}

export const useBlockGenerator = (option: GalaxyOption, ps: Ref<Point[]>) => {
  const seed = useSeedStore()
  const { cellSize, blockCells } = option

  const buildBlockAround = poissonDiscSamplerMap({
    cellSize,
    blockSize: cellSize * blockCells,
    random: seed.random,
  })

  const exploreArea = (point: Point) => {
    const points = buildBlockAround(point)
    if (points.length <= 0) return []
    ps.value = ps.value.concat(points)
    return points
  }

  return {
    exploreArea,
  }
}

export const useVoronoiGrid = (option: GalaxyOption, points: Ref<Point[]>) => {
  const delaunay = computed(() => Delaunay.from(points.value))
  const voronoi = computed(() => delaunay.value.voronoi())
  return {
    delaunay,
    voronoi,
  }
}

export interface GalaxyOption {
  cellSize: number
  blockCells: number
}

const useGalaxyGrid = (option: GalaxyOption) => {
  const points = ref<Point[]>([])

  const blockGenerator = useBlockGenerator(option, points)
  const voronoiGrid = useVoronoiGrid(option, points)

  return {
    points,
    ...blockGenerator,
    ...voronoiGrid,
  }
}

export default useGalaxyGrid
