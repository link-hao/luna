import { StarSystem, useCreateStarSystem } from './'
import { int2Roman, Point } from '@/utils'
import { useSeedStore } from '@/service/seed'
import { RandomFactory } from '@/utils/random'
import StarNames from '@/assets/star-names.yaml'
import { Planet, PlanetClimate, useCreatePlanet } from './planet'
import { reactive } from 'vue'

let sequence = 0

const nameRandomFactory = (random: RandomFactory) => {
  const history = new Set<number>()
  return () => {
    if (StarNames.length <= 0) return
    while (true) {
      const idx = random(0, StarNames.length, true)
      if (!history.has(idx)) {
        let newName = StarNames[idx] as string
        newName = newName.replace(/[_\s]/g, ' ')
        history.add(idx)
        return newName
      }
    }
  }
}

const planetsRandomFactory = (random: RandomFactory) => {
  const randomPlanetSize = (radius: number) => {
    if (radius > 0 && radius <= 400) {
      return random(50, 65)
    } else if (radius > 400 && radius <= 800) {
      return random(60, 75)
    } else {
      return random(75, 100)
    }
  }

  return (starSys: StarSystem) => {
    const planets: Planet[] = []
    let distance = starSys.star.size
    let i = 0
    while (true) {
      i++
      distance += random(100, 300)
      const radius = distance
      const size = randomPlanetSize(distance)
      distance += size * 2
      if (distance > random(1500, 2500) + 200) {
        starSys.radius = distance
        break
      }
      const name = starSys.star.name + ' ' + int2Roman(i)
      const angle = random(0, 360)
      const livable = radius < 1200 && radius >= 600
      const climate: PlanetClimate = {
        temperature: (radius * 80) / 600 + -100,
        precipitation: random(10, 100),
        landArea: random(20, 80),
        livable,
      }
      const planet = useCreatePlanet({
        id: i,
        name,
        size,
        radius,
        angle,
        climate,
      })
      planets.push(planet)
    }
    return planets
  }
}

export const useStarSystemRandom = () => {
  const seed = useSeedStore()
  const nameRandom = nameRandomFactory(seed.random)
  const planetsRandom = planetsRandomFactory(seed.random)

  return (position: Point): StarSystem => {
    const id = sequence++
    const name = nameRandom() || `Star ${id}`
    const size = seed.random(150, 200)

    const starSys = useCreateStarSystem({
      id,
      name,
      size,
      position,
    })

    starSys.planets = reactive(planetsRandom(starSys))

    return starSys
  }
}
