<template>
  <div class="starSysMap">
    <svg ref="svgRef" class="starSysMap_cvs">
      <StarField :seed="seed.store.StarField" />
      <g ref="mapRef">
        <circle
          cx="0"
          cy="0"
          r="2500"
          :stroke-width="1"
          stroke="rgba(255,255,255,.5)"
          fill="transparent"
          stroke-dasharray="50,50"
        />
        <circle
          v-for="planet in planets"
          :key="planet.id"
          cx="0"
          cy="0"
          :r="planet.radius"
          :stroke-width="1"
          stroke="rgba(255,255,255,.2)"
          fill="transparent"
        />
        <circle cx="0" cy="0" :r="star.size" fill="#f8e20e" />
        <g v-for="planet in planets" :key="planet.id">
          <circle
            :r="planet.size"
            :cx="planet.radius"
            cy="0"
            fill="#fff"
            :transform="`rotate(${planet.angle})`"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as d3 from 'd3'
import { useSVGCamera } from '@/service/camera'
import StarField from '@/scenes/GalaxyMap/StarField.vue'
import { useSeedStore } from '@/service/seed'
import { usePlayerSceneStore } from '@/service/scene/player'

const playerSceneStore = usePlayerSceneStore()

const seed = useSeedStore()

const svgRef = ref<SVGSVGElement>(null)
const mapRef = ref<SVGGElement>(null)

const mapGroup = computed(() => d3.select(mapRef.value))
const svg = computed(() => d3.select(svgRef.value))

const { camera, transform } = useSVGCamera(svgRef, {
  scaleExtent: [0.2, 1],
  initialTranslate: [0, 0],
  initialScale: 0.2,
})

watch(transform, transform => {
  mapGroup.value.attr('transform', transform.toString())
})

const star = computed(() => playerSceneStore.currentStarSystem.star)
const planets = computed(() => playerSceneStore.currentStarSystem.planets)
</script>

<style lang="less">
.starSysMap {
  background: #000;
  width: 100%;
  height: 100%;
  user-select: none;
  display: block;
  overflow: hidden;
  &_cvs {
    width: 100%;
    height: 100%;
  }
}
</style>
