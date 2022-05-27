<template>
  <g :transform="transform" class="starSysPreview">
    <circle
      v-if="showStarSysBound"
      class="starSysPreview_bound"
      cx="0"
      cy="0"
      :r="starSystem.radius / 10"
      :stroke-width="1"
      stroke="rgba(255,255,255,.5)"
      fill="transparent"
      stroke-dasharray="10,10"
      @click="enterStarSys(starSystem)"
    />
    <template v-if="showStarSysPreview">
      <circle
        v-for="planet in starSystem.planets"
        :cx="planet.radius / 10"
        :r="planet.size / 10"
        cy="0"
        fill="#fff"
        :transform="`rotate(${planet.angle})`"
        pointer-events="none"
      />
      <circle
        cx="0"
        cy="0"
        :r="starSystem.star.size / 10"
        fill="#f8e20e"
        pointer-events="none"
      />
    </template>
    <template v-else>
      <circle
        :r="(starSystem.star.size - 100) / 2"
        :cx="0"
        :cy="0"
        fill="#fff"
        @click="enterStarSys(starSystem)"
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerSceneStore } from '@/service/scene/player'

const props = defineProps({
  starSystem: Object,
  cameraScale: Number,
})

const transform = computed(() => {
  const [x, y] = props.starSystem.position
  return `translate(${x / 5}, ${y / 5})`
})

const showStarSysPreview = computed(() => props.cameraScale > 0.3)
const showStarSysBound = computed(() => props.cameraScale > 0.15)

const playerSceneStore = usePlayerSceneStore()

const enterStarSys = starSystem => {
  playerSceneStore.enterStarSystem(starSystem)
}
</script>

<style lang="less">
.starSysPreview {
  &_bound {
    &:hover {
      fill: rgba(255, 255, 255, 0.03);
    }
  }
}
</style>
