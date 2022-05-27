import { Point } from '@/utils'
import { reactive, shallowReactive } from 'vue'
import { useGalaxyMapStore } from '@/service/galaxy-map'
import { Planet } from './planet'

export interface StarSystemOptions {
  id: number
  name: string
  radius?: number
  position: Point
  size: number
  planets?: Planet[]
}

export interface Star {
  name: string
  size: number
}

export interface StarSystem {
  id: number
  position: Point
  star: Star
  planets: Planet[]
  radius: number
}

export const useCreateStar = (options: Star) => {
  return reactive<Star>(options)
}

export const useCreateStarSystem = (options: StarSystemOptions): StarSystem => {
  return shallowReactive({
    id: options.id,
    position: reactive(options.position),
    radius: options.radius,
    star: useCreateStar({
      name: options.name,
      size: options.size,
    }),
    planets: reactive([]),
  })
}

export const useStarSystem = (
  id: number
): ReturnType<typeof useCreateStarSystem> => {
  const galaxyMap = useGalaxyMapStore()
  return galaxyMap.getStarSystem(id)
}
