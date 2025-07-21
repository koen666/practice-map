<template>
  <div id="map-container" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const api_key = '6db502aba745f8fb2cc31ea659ecc3ea';
const infoWindow = ref(null);

const initMap = () => {
  const map = new AMap.Map('map-container', {
    zoom: 8,
    center: [103.7606, 29.5584], 
    viewMode: '2D',
  });

  const points = {
    leshan: [103.7606, 29.5584],  // 乐山文庙
    xichang: [102.0266, 28.2461], // 西昌卫星基地
    emei: [103.4848, 29.6012],    // 峨眉山
    chengdu: [104.0665, 30.6595]  // 成都人民公园
  };


  const createInfoWindowContent = () => {
    return `
      <div style="width: 800px; height: 600px; padding: 10px;">
        <h3 style="margin-top: 0; margin-bottom: 10px;">乐山文庙3D建模</h3>
        <iframe 
          src="https://www.get3d.cn/share?shareKey=rs8Qe50zCHfl388OGzLb0BdM&password=2" 
          width="100%" 
          height="90%" 
          frameborder="0" 
          allowfullscreen
          style="border: none;">
        </iframe>
      </div>
    `;
  };


  const leshanMarker = new AMap.Marker({
    position: points.leshan,
    title: '乐山文庙'
  });
  
  leshanMarker.on('click', () => {
    if (infoWindow.value) {
      infoWindow.value.close();
    }
    
    infoWindow.value = new AMap.InfoWindow({
      content: createInfoWindowContent(),
      offset: new AMap.Pixel(0, -30),
      size: new AMap.Size(800, 600)
    });
    
    infoWindow.value.open(map, points.leshan);
  });

  const otherMarkers = [
    new AMap.Marker({ position: points.xichang, title: '西昌卫星发射基地' }),
    new AMap.Marker({ position: points.emei, title: '峨眉山(途径点)' }),
    new AMap.Marker({ position: points.chengdu, title: '成都人民公园' })
  ];


  map.add([leshanMarker, ...otherMarkers]);

  const polyline = new AMap.Polyline({
    path: [points.leshan, points.xichang, points.emei, points.chengdu],
    isOutline: true,
    outlineColor: '#ffeeff',
    borderWeight: 1,
    strokeColor: "#3366FF", 
    strokeOpacity: 1,
    strokeWeight: 5,
    strokeStyle: "dashed",
    lineJoin: 'round',
    lineCap: 'round',
    showDir: true,
    dirColor: '#ff0000',
    dirSize: 6
  });
  map.add(polyline);  

  map.setFitView();
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
.map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}


:deep(.amap-info-content) {
  padding: 0 !important;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>