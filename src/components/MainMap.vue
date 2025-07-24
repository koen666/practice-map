<template>
  <div id="map-container" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import xichangImage from '@/assets/image/西昌卫星发射基地.png';
import chengduImage from '@/assets/image/四川省第三测绘工程院.png'; // 请确保有这个图片

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
    xichang: [102.0346, 28.2449], // 西昌卫星基地
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

  const createXichangInfoWindowContent = () => {
    return `
      <div style="width: 800px; height: 600px; padding: 10px; font-family: 'Microsoft YaHei', sans-serif;">
        <h3 style="margin: 0 0 15px 0; color: #1a5276; border-bottom: 2px solid #3498db; padding-bottom: 8px;">
          西昌卫星发射中心
        </h3>
        <div style="display: flex; height: 90%; gap: 15px;">
          <!-- 左侧图片区域 -->
          <div style="flex: 1; background: #f8f9fa; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img 
              src="${xichangImage}" 
              alt="西昌卫星发射中心" 
              style="max-width: 100%; max-height: 100%; object-fit: contain;"
            >
          </div>
          
          <!-- 右侧文字区域 -->
          <div style="flex: 1; display: flex; flex-direction: column;">
            <div style="flex: 1; overflow-y: auto; padding-right: 5px;">
              <p style="margin: 0 0 10px 0; line-height: 1.6; color: #333;">
                西昌卫星发射中心是中国重要的航天发射场，始建于1970年，主要承担地球同步轨道卫星发射任务。
              </p>
              
              <h4 style="margin: 15px 0 8px 0; color: #2874a6;">主要功能</h4>
              <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 5px;">通信卫星发射</li>
                <li style="margin-bottom: 5px;">北斗导航卫星发射</li>
                <li style="margin-bottom: 5px;">探月工程发射任务</li>
                <li style="margin-bottom: 5px;">商业卫星发射</li>
              </ul>
              
              <h4 style="margin: 15px 0 8px 0; color: #2874a6;">历史成就</h4>
              <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 5px;">1984年成功发射中国第一颗试验通信卫星</li>
                <li style="margin-bottom: 5px;">2007年发射中国首颗月球探测卫星嫦娥一号</li>
                <li style="margin-bottom: 5px;">2018年完成北斗三号全球组网卫星发射</li>
              </ul>
            </div>
            
            <div style="margin-top: auto; text-align: center; padding: 10px 0;">
              <a 
                href="https://sat.huijiwiki.com/wiki/%E8%A5%BF%E6%98%8C%E5%8D%AB%E6%98%9F%E5%8F%91%E5%B0%84%E4%B8%AD%E5%BF%83" 
                target="_blank" 
                style="
                  display: inline-block;
                  padding: 8px 15px;
                  background-color: #3498db;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  transition: background-color 0.3s;
                "
                onmouseover="this.style.backgroundColor='#2874a6'" 
                onmouseout="this.style.backgroundColor='#3498db'"
              >
                查看更多详细信息
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createChengduInfoWindowContent = () => {
    return `
      <div style="width: 800px; height: 600px; padding: 10px; font-family: 'Microsoft YaHei', sans-serif;">
        <h3 style="margin: 0 0 15px 0; color: #1a5276; border-bottom: 2px solid #3498db; padding-bottom: 8px;">
          四川省第三测绘工程院
        </h3>
        <div style="display: flex; height: 90%; gap: 15px;">
          <!-- 左侧图片区域 -->
          <div style="flex: 1; background: #f8f9fa; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img 
              src="${chengduImage}" 
              alt="四川省第三测绘工程院" 
              style="max-width: 100%; max-height: 100%; object-fit: contain;"
            >
          </div>
          
          <!-- 右侧文字区域 -->
          <div style="flex: 1; display: flex; flex-direction: column;">
            <div style="flex: 1; overflow-y: auto; padding-right: 5px;">
              <p style="margin: 0 0 10px 0; line-height: 1.6; color: #333;">
                四川省第三测绘工程院是四川省自然资源厅直属事业单位，主要从事测绘地理信息工作。
              </p>
              
              <h4 style="margin: 15px 0 8px 0; color: #2874a6;">主要职能</h4>
              <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 5px;">基础测绘与地理国情监测</li>
                <li style="margin-bottom: 5px;">应急测绘保障</li>
                <li style="margin-bottom: 5px;">航空航天遥感影像处理</li>
                <li style="margin-bottom: 5px;">地理信息系统开发</li>
              </ul>
              
              <h4 style="margin: 15px 0 8px 0; color: #2874a6;">主要成就</h4>
              <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 5px;">参与汶川地震灾后重建测绘</li>
                <li style="margin-bottom: 5px;">完成四川省地理国情普查</li>
                <li style="margin-bottom: 5px;">建立四川省遥感影像数据库</li>
              </ul>
            </div>
            
            <div style="margin-top: auto; text-align: center; padding: 10px 0;">
              <a 
                href="https://www.cehuiyc.com/Company_Detail.asp?Param=VRqnwyeb6jmz1974" 
                target="_blank" 
                style="
                  display: inline-block;
                  padding: 8px 15px;
                  background-color: #3498db;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  transition: background-color 0.3s;
                "
                onmouseover="this.style.backgroundColor='#2874a6'" 
                onmouseout="this.style.backgroundColor='#3498db'"
              >
                访问官网
              </a>
            </div>
          </div>
        </div>
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

  const xichangMarker = new AMap.Marker({
    position: points.xichang,
    title: '西昌卫星发射中心',
  });

  xichangMarker.on('click', () => {
    if (infoWindow.value) {
      infoWindow.value.close();
    }
    
    infoWindow.value = new AMap.InfoWindow({
      content: createXichangInfoWindowContent(),
      offset: new AMap.Pixel(0, -30),
      size: new AMap.Size(800, 600)
    });
    
    infoWindow.value.open(map, points.xichang);
  });

  const chengduMarker = new AMap.Marker({
    position: points.chengdu,
    title: '四川省第三测绘工程院',
  });

  chengduMarker.on('click', () => {
    if (infoWindow.value) {
      infoWindow.value.close();
    }
    
    infoWindow.value = new AMap.InfoWindow({
      content: createChengduInfoWindowContent(),
      offset: new AMap.Pixel(0, -30),
      size: new AMap.Size(800, 600)
    });
    
    infoWindow.value.open(map, points.chengdu);
  });

  const otherMarkers = [
    new AMap.Marker({ position: points.emei, title: '峨眉山(途径点)' })
  ];

  map.add([leshanMarker, xichangMarker, chengduMarker, ...otherMarkers]);

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