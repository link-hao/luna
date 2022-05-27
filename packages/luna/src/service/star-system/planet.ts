import { reactive } from 'vue'

export interface PlanetClimate {
  temperature: number
  precipitation: number
  landArea: number
  livable: boolean
}

export interface Planet {
  id: number
  name: string
  size: number
  radius: number
  angle: number
  climate: PlanetClimate
}

export const useCreatePlanet = (planet: Planet): Planet => {
  return reactive<Planet>(planet)
}
