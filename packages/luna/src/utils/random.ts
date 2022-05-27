import { randomLcg } from 'd3-random'

export const createRandom = (seed: number): RandomFactory => {
  const random = randomLcg(seed)
  return (min: number = 0, max: number = 1, integer: boolean = false) => {
    const num = random()
    const ranged = (max - min) * num + min
    if (integer) {
      return Math.floor(ranged)
    }
    return ranged
  }
}

export type RandomFactory = (
  min?: number,
  max?: number,
  integer?: boolean
) => number
