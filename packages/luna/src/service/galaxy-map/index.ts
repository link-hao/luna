import { shallowReactive, computed } from 'vue'
import { StarSystem } from '@/service/star-system'
import { defineStore } from 'pinia'
import useGalaxyGrid from './galaxy-grid'
import { Point } from '@/utils'
import { useStarSystemRandom } from '@/service/star-system/star-system-random'

const useStarSystems = () => {
  const starSystemList = shallowReactive<StarSystem[]>([])

  const starSystemMapping = computed(() => {
    const map = new Map<number, StarSystem>()
    starSystemList.forEach(star => {
      if (star) {
        map.set(star.id, star)
      }
    })
    return map
  })

  const getStarSystem = (id: number) => {
    return starSystemMapping.value.get(id)
  }

  const removeStarSystem = (idOrObj: number | StarSystem) => {
    const starSys: StarSystem =
      typeof idOrObj === 'number' ? getStarSystem(idOrObj) : idOrObj
    starSystemMapping.value.delete(starSys.id)
    const idx = starSystemList.indexOf(starSys)
    delete starSystemList[idx]
    starSystemList[idx] = starSystemList[starSystemList.length - 1]
    starSystemList.length--
  }

  const addStarSystem = (starSys: StarSystem) => {
    starSystemList[starSystemList.length++] = starSys
    return starSys
  }

  const addStarSystems = (list: StarSystem[]) => {
    list.forEach(starSys => addStarSystem(starSys))
  }

  return {
    starSystemList,
    getStarSystem,
    addStarSystem,
    removeStarSystem,
    addStarSystems,
  }
}

export const useGalaxyMapStore = defineStore('GalaxyMap', () => {
  const GalaxyMapOptions = {
    blockCells: 8,
    cellSize: 2500,
  }
  const { starSystemList, addStarSystems, getStarSystem } = useStarSystems()
  const { exploreArea } = useGalaxyGrid(GalaxyMapOptions)
  const starSystemRandom = useStarSystemRandom()

  const exploreGalaxyField = (point: Point) => {
    const newPoints = exploreArea(point)
    const newStarSystems = newPoints.map(point => starSystemRandom(point))
    addStarSystems(newStarSystems)
  }

  return {
    starSystemList,
    exploreGalaxyField,
    GalaxyMapOptions,
    getStarSystem,
  }
})
