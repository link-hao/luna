<template>
  <GalaxyMap v-show="showGalaxyMap" />
  <template v-if="showStarSysMap">
    <StarSystemMap />
    <StarSystemInfo :key="playerSceneStore.currentStarSystem.id" />
  </template>
</template>

<script setup lang="ts">
import GalaxyMap from '@/scenes/GalaxyMap/index.vue'
import StarSystemMap from '@/scenes/StarSystemMap/index.vue'
import { GamingScenes } from '@/service/scene'
import { usePlayerSceneStore } from '@/service/scene/player'
import { computed } from 'vue'
import StarSystemInfo from '@/views/StarSystemInfo.vue'

const playerSceneStore = usePlayerSceneStore()

const showGalaxyMap = computed(
  () => playerSceneStore.currentScene === GamingScenes.galaxyMap
)
const showStarSysMap = computed(
  () => playerSceneStore.currentScene === GamingScenes.starSysMap
)
</script>
