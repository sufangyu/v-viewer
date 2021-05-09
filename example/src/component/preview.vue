<template>
  <div>
    <button @click="openImagePreview">
      点击查看图片
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, nextTick, onUnmounted } from 'vue'
import { ViewerPreview } from '../../../src/index'
import type { ViewerInstanceExposed } from '../../../src/index'

const Images = [
  'https://www.bing.com/th?id=OHR.LimosaLimosa_ZH-CN8008396927_1920x1080.jpg',
  'https://www.bing.com/th?id=OHR.MaineWetland_ZH-CN7884780461_1920x1080.jpg',
]
const reactiveImages = reactive({
  syncImages: [] as string[],
  options: {
    navbar: false,
  },
})
reactiveImages.syncImages = Images

let viewerInstance = {} as ViewerInstanceExposed
const openImagePreview = () => {
  if (!viewerInstance.$viewer) {
    viewerInstance = ViewerPreview({
      images: reactiveImages.syncImages,
      options: reactiveImages.options,
    })
  }
  nextTick(() => {
    console.log(viewerInstance.$viewer().view(1))
  })
}

onUnmounted(() => {
  viewerInstance.destroyViewer()
})
</script>
