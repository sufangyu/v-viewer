<template>
  <!-- 默认 -->
  <h2>默认</h2>
  <viewer :images="reactiveImages.syncImages" :options="reactiveImages.options" @inited="initViewer">
    <img v-for="item of reactiveImages.syncImages" :key="item" :src="item" width="200" height="200" />
  </viewer>

  <!-- 使用 tag 指定渲染组件标签 -->
  <h2>使用 tag 指定渲染组件标签</h2>
  <viewer tag="section">
    <img v-for="item of reactiveImages.syncImages" :key="item" :src="item" width="200" height="200" />
  </viewer>

  <!-- 使用 v-is 代替现在的指令方式 -->
  <h2>使用 v-is 代替现在的指令方式</h2>
  <section v-is="'viewer'" :images="reactiveImages.asyncImages">
    <img v-for="item of reactiveImages.asyncImages" :key="item" :src="item" width="200" height="200" />
  </section>

  <!-- 侦听一个 getter -->
  <h2>侦听一个 getter</h2>
  <viewer :images="reactiveImages.asyncImages">
    <img v-for="item of reactiveImages.asyncImages" :key="item" :src="item" width="200" height="200" />
  </viewer>

  <!-- 侦听一个 ref -->
  <h2>侦听一个 ref</h2>
  <viewer :images="asyncImages">
    <img v-for="item of asyncImages" :key="item" :src="item" width="200" height="200" />
  </viewer>

  <!-- 作用域插槽 -->
  <h2>作用域插槽</h2>
  <viewer v-slot="scope" :images="asyncImages">
    {{ JSON.stringify(scope) }}
  </viewer>

  <!-- 模板引用 -->
  <h2>模板引用</h2>
  <viewer ref="viewerRef" :images="asyncImages"></viewer>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
const Images = [
  'https://www.bing.com/th?id=OHR.LimosaLimosa_ZH-CN8008396927_1920x1080.jpg',
  'https://www.bing.com/th?id=OHR.MaineWetland_ZH-CN7884780461_1920x1080.jpg',
]

// 初始化完成回调
const initViewer = (viewer: any) => {
  console.log(viewer)
}

// 侦听一个 getter
const reactiveImages = reactive({
  syncImages: [] as string[],
  asyncImages: [] as string[],
  options: {
    navbar: false,
  },
})
reactiveImages.syncImages = Images
setTimeout(() => {
  reactiveImages.asyncImages = Images
}, 2000)

// 直接侦听一个 ref
const asyncImages = ref<string[]>([])
setTimeout(() => {
  asyncImages.value.push(...Images)
}, 2000)

// 模板引用
const viewerRef = ref(null)
nextTick(() => {
  // @ts-ignore
  console.log(viewerRef.value.$viewer())
})
</script>
