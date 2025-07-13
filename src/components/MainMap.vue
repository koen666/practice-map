<template>
  <div class="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      @ready="onMapReady"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
    </l-map>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const zoom = ref(13)
const center = ref([31.2304, 121.4737])

function onMapReady() {
  console.log('Map is ready')
}
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100vw;
}

.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>
