<template>
  <div class="main-container">
    <header class="main-header">
      <div class="content-area">
        <!-- 根据不同视图显示内容 -->
        <div v-if="currentView === 'steps'" class="charts-container">
          <!-- 步数统计视图的饼状图容器 -->
          <div v-for="(day, index) in stepsData" :key="index" class="chart-item">
            <h3>第{{ index + 1 }}天</h3>
            <div class="chart-wrapper" :id="'chart-' + index"></div>
          </div>
        </div>
        
        <!-- 行程管理 -->
        <div v-if="currentView === 'schedule'" class="schedule-container">
          <div class="schedule-list">
            <div v-for="(item, index) in schedules" :key="index" class="schedule-item">
              <span class="date">{{ item.date }}</span>
              <span class="location">{{ item.location }}</span>
              <button @click="deleteSchedule(index)" class="delete-btn">×</button>
            </div>
          </div>
          <div class="schedule-form">
            <input v-model="newSchedule.date" placeholder="日期（例：2025-07-07）">
            <input v-model="newSchedule.location" placeholder="地点">
            <button @click="addSchedule">添加行程</button>
          </div>
        </div>
      </div>
      <div class="icon-bar">
        <button @click="switchView('steps')" :class="{active: currentView === 'steps'}" aria-label="步数统计">
          <svg class="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="2.5" fill="currentColor"/>
            <path d="M12 8.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 13.5l-3 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 13.5l3 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 10l-3.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 10l3.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button @click="switchView('schedule')" :class="{active: currentView === 'schedule'}">
          <svg class="icon" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>
        </button>
        <button @click="switchView('documents')" :class="{active: currentView === 'documents'}">
          <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        </button>
      </div>
    </header>

    <button 
      class="collapse-btn"
      @click="isHeaderCollapsed = !isHeaderCollapsed"
      aria-label="折叠面板"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" :style="{transform: isHeaderCollapsed ? 'rotate(180deg)' : ''}">
        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
      </svg>
    </button>
    <div 
      id="map-container" 
      class="map-container" 
    ></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref ,watch} from 'vue';
import * as echarts from 'echarts';
const currentView = ref('steps');
const  isHeaderCollapsed = ref(false);
const headerHeight = computed(() => isHeaderCollapsed.value ? '60px' : '35vh');

const schedules = ref([
  { date: '2025-07-07', location: '乐山' },
  { date: '2025-07-09', location: '西昌' },
  { date: '2025-07-11', location: '成都' }
]);

const newSchedule = ref({
  date: '',
  location: ''
});

const stepsData = [
  { day: '第一天', 何柯: 12850, 徐晨帆: 13520, 杨健淳: 11980 },
  { day: '第二天', 何柯: 15630, 徐晨帆: 14980, 杨健淳: 16210 },
  { day: '第三天', 何柯: 13270, 徐晨帆: 12890, 杨健淳: 14050 },
  { day: '第四天', 何柯: 14560, 徐晨帆: 15120, 杨健淳: 13890 }
];

const switchView = (view) => {
  currentView.value = view;
};

const addSchedule = () => {
  if (newSchedule.value.date && newSchedule.value.location) {
    schedules.value.push({...newSchedule.value});
    newSchedule.value = { date: '', location: '' };
  }
};

const deleteSchedule = (index) => {
  schedules.value.splice(index, 1);
};

const initCharts = () => {
  stepsData.forEach((_, index) => {
    const chartDom = document.getElementById(`chart-${index}`);
    if (chartDom) {
      echarts.dispose(chartDom);
    }
  });

  stepsData.forEach((dayData, index) => {
    const chartDom = document.getElementById(`chart-${index}`);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const data = [
      { name: '何柯', value: dayData.何柯 },
      { name: '徐晨帆', value: dayData.徐晨帆 },
      { name: '杨健淳', value: dayData.杨健淳 }
    ];
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}步 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '步数分布',
          type: 'pie',
          radius: ['40%', '70%'], 
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ],
      color: ['#3498db', '#2ecc71', '#f39c12'] 
    };

    chart.setOption(option);
    
    window.addEventListener('resize', () => {
      chart.resize();
    });
  });
};

watch(currentView, (newVal) => {
  if (newVal === 'steps') {
    setTimeout(initCharts, 0);
  }
});


import xichangImage from '@/assets/image/西昌卫星发射基地.png';
import chengduImage from '@/assets/image/四川省第三测绘工程院.png';

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
    
    if (currentView.value === 'steps') {
      setTimeout(initCharts, 0);
    }
  } catch (error) {
    console.error('加载高德地图失败:', error);
  }
});
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  
}

.main-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 修改为flex-start以适应图表垂直排列 */
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: v-bind(headerHeight);
  overflow-y: auto;
  transition: max-height 0.3s ease;
}

.collapse-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1001;
}

.collapse-btn:hover {
  background: #f5f5f5;
}

.content-area {
  flex: 1;
  padding-right: 2rem;
}

.icon-bar {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 0 1rem;
}

.icon-bar button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.icon-bar button:hover {
  background: #f0f2f5;
}

.icon-bar button.active {
  background: #e6f4ff;
}

.icon-bar button.active .icon {
  fill: #1677ff;
}

.icon {
  width: 28px;
  height: 28px;
  fill: #666;
}

.map-container {
  flex: 1;
  width: 100%;
  height: calc(100vh - 72px);
  position: relative;
}

:deep(.amap-info-content) {
  padding: 0 !important;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 新增：步数图表容器样式 */
.charts-container {
  display: flex;
  gap: 140px;
  padding: 15px 0;
  overflow-x: auto; /* 允许横向滚动 */
  width: 100%;
  scrollbar-width: thin; /* 美化滚动条 */
}

.charts-container::-webkit-scrollbar {
  height: 6px;
  gap: 130px;
}

.charts-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.chart-item {
  min-width: 250px; /* 固定每个图表宽度 */
  text-align: center;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart-wrapper {
  width: 100%;
  height: 200px; /* 固定图表高度 */
}

.chart-item h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

/* 行程管理样式 */
.schedule-container {
  width: 100%;
  max-width: 2000px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.schedule-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.schedule-item {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.2s;
}

.schedule-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.date {
  flex: 0 0 120px;
  font-weight: 500;
  color: #2c3e50;
}

.location {
  flex: 1;
  color: #34495e;
}

.delete-btn {
  flex: 0 0 30px;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.schedule-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.schedule-form input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.schedule-form button {
  padding: 0.6rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.schedule-form button:hover {
  background: #2980b9;
}
</style>
