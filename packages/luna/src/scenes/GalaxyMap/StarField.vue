<template>
  <g>
    <filter
      :id="filterId"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
      color-interpolation-filters="linearRGB"
    >
      <feTurbulence
        type="turbulence"
        baseFrequency=".2"
        numOctaves="5"
        stitchTiles="stitch"
        :seed="seed"
        result="turbulence"
      />
      <feSpecularLighting
        surfaceScale="6"
        specularConstant=".3"
        specularExponent="50"
        lighting-color="rgb(77, 121, 173)"
        in="turbulence"
        result="specularLighting"
      >
        <feDistantLight azimuth="3" elevation="100" />
      </feSpecularLighting>
    </filter>
    <rect x="0" y="0" width="100%" height="100%" fill="rgb(19,29,41)" />
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :filter="`url(#${filterId})`"
    />
  </g>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { ref } from 'vue'

defineProps({
  seed: Number,
})

const filterId = ref(nanoid())
</script>
