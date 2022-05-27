import { computed, onMounted, Ref, ref, shallowRef } from 'vue'
import * as d3 from 'd3'
import { ZoomTransform, ZoomBehavior } from 'd3'
import { Point } from '@/utils'
import { getScreenRect } from '@/utils/element'

export interface SVGCameraOptions {
  scaleExtent?: [number, number]
  translateExtent?: [[number, number], [number, number]]
  initialScale?: number
  initialTranslate?: [number, number]
}

export const useSVGCamera = (
  svgRef: Ref<SVGSVGElement>,
  options: SVGCameraOptions
) => {
  const camera = shallowRef<ZoomBehavior<Element, unknown>>(null)
  const transform = ref<ZoomTransform>()
  const svg = computed(() => d3.select(svgRef.value))

  const alignToPoint = (position: Point) => {
    const screenRect = getScreenRect()
    camera.value.translateBy(
      svg.value,
      screenRect.width / 2 + position[0],
      screenRect.height / 2 + position[1]
    )
  }

  onMounted(() => {
    camera.value = d3.zoom()
    if (options.scaleExtent) {
      camera.value.scaleExtent(options.scaleExtent)
    }
    if (options.translateExtent) {
      camera.value.translateExtent(options.translateExtent)
    }
    camera.value.on('zoom', e => {
      transform.value = e.transform as ZoomTransform
    })
    svg.value.call(camera.value)
    if (options.initialTranslate) {
      alignToPoint(options.initialTranslate)
    }
    if (options.initialScale) {
      camera.value.scaleTo(svg.value, options.initialScale)
    }
  })

  return {
    transform,
    camera,
    alignToPoint,
  }
}
