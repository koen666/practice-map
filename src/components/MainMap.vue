<template>
  <div id="map-container" class="map-container"></div>
</template>

<script setup>
import { onMounted } from 'vue';

const api_key = '6db502aba745f8fb2cc31ea659ecc3ea';

const initMap = () => {
  const map = new AMap.Map('map-container', {
    zoom: 10,
    center: [116.397428, 39.90923],
    viewMode: '2D',
  });

  const marker = new AMap.Marker({
    position: [116.397428, 39.90923],
    title: '天安门',
  });
  map.add(marker);
};

const loadAMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(); 
      return;
    }
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${api_key}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadAMapScript(); 
    initMap();
  } catch (error) {
    console.error('加载高德地图失败:', error);
  }
});
</script>

<style scoped>

.map-container 
{
  width: 200vh;
  height: 100vh;
  position: relative;
}
</style>
