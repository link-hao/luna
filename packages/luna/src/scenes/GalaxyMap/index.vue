<template>
  <div class="galaxyMap">
    <svg ref="svgRef" class="galaxyMap_cvs">
      <StarField :seed="seed.store.StarField" />
      <g ref="mapRef">
        <g v-for="(starSys, i) in starSystemList" :key="i">
          <StarSystemPreview :starSystem="starSys" :cameraScale="cameraScale" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import StarField from './StarField.vue'
import { useGalaxyMapStore } from '@/service/galaxy-map'
import { computed, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { useSVGCamera } from '@/service/camera'
import { useSeedStore } from '@/service/seed'
import { usePlayerSceneStore } from '@/service/scene/player'
import StarSystemPreview from './StarSystemPreview.vue'

const seed = useSeedStore()

const { exploreGalaxyField, starSystemList } = useGalaxyMapStore()

const svgRef = ref<SVGSVGElement>(null)
const mapRef = ref<SVGGElement>(null)

const mapGroup = computed(() => d3.select(mapRef.value))
const svg = computed(() => d3.select(svgRef.value))

const { camera, transform } = useSVGCamera(svgRef, {
  scaleExtent: [0.1, 1],
  initialTranslate: [0, 0],
  initialScale: 0.1,
})

const cameraScale = ref(1)

watch(transform, transform => {
  cameraScale.value = transform.k
  mapGroup.value.attr('transform', transform.toString())
})

onMounted(() => {
  exploreGalaxyField([0, 0])
})

const playerSceneStore = usePlayerSceneStore()

const enterStarSys = starSystem => {
  playerSceneStore.enterStarSystem(starSystem)
}
</script>

<style lang="less">
.galaxyMap {
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
