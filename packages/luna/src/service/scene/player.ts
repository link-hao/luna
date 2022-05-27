import { defineStore } from 'pinia'
import { GamingScenes } from './'
import { StarSystem } from '@/service/star-system'

export const usePlayerSceneStore = defineStore('Gaming', {
  state: () => ({
    currentScene: GamingScenes.galaxyMap,
    currentStarSystem: null as StarSystem,
  }),
  actions: {
    enterStarSystem(starSys: StarSystem) {
      this.currentScene = GamingScenes.starSysMap
      this.currentStarSystem = starSys
    },
    leaveStarSystem() {
      this.currentScene = GamingScenes.galaxyMap
      this.currentStarSystem = null
    },
  },
})
