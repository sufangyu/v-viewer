<template>
  <div v-viewer>
    <!-- 静态图片 -->
    <img src="https://www.bing.com/th?id=OHR.LimosaLimosa_ZH-CN8008396927_1920x1080.jpg" width="100" height="100" />
    <img src="https://www.bing.com/th?id=OHR.MaineWetland_ZH-CN7884780461_1920x1080.jpg" width="100" height="100">
    <!-- 动态图片 -->
    <img v-for="img of images" :key="img" :src="img" width="100" height="100">
    <button @click="images.push('https://www.bing.com/th?id=OHR.MaineWetland_ZH-CN7884780461_1920x1080.jpg')">
      添加图片
    </button>
    <!-- 其他动态 -->
    <ul>
      <li v-for="index of list" :key="index">
        {{ index }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const list = ref<number[]>([])
const images = ref<string[]>([])

setInterval(() => {
  list.value.push(list.value.length)
}, 5000)
</script>
