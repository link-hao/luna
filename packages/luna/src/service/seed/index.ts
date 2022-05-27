import { defineStore } from 'pinia'
import { createRandom, RandomFactory } from '@/utils/random'

export const useSeedStore = defineStore('Seed', {
  state: () => ({
    current: 12343124,
  }),
  getters: {
    random(state) {
      return createRandom(state.current)
    },
    store() {
      const random = this.random as RandomFactory
      return {
        StarField: random(),
      }
    },
  },
})
