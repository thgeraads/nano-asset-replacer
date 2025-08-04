<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue';
import ControlPanel from "./components/ControlPanel.vue";
import ContentPanel from "./components/ContentPanel.vue";
import {extractFilteredImages} from "./utils/unpack.js";
import {createStartupModal} from "./utils/modal.js";

import {isProxy, ref} from "vue";
import {createConsentModal} from "./utils/analytics-modal.js";
const currentlySelectedDevice = ref('7g');
const ipswLoaded = ref(false);
const modifiedAssets = ref([]);


// createConsentModal();
// createStartupModal();


const contentPanelRef = ref(null);
const handleCopyFromOrigin = () => {
  contentPanelRef.value?.copyFromOriginAssets();
};


</script>


<template>
  <div id="app">
    <Navbar :device="currentlySelectedDevice" />
    <div class="container">


      <ContentPanel
          ref="contentPanelRef"
          :device="currentlySelectedDevice"
          v-model:loaded="ipswLoaded"
          @modified-assets="modifiedAssets = $event"

      />
      <ControlPanel
          :loaded="ipswLoaded"
          :modified="modifiedAssets"
          v-model:device="currentlySelectedDevice"
          @copy-from-origin="handleCopyFromOrigin"

      />
    </div>
  </div>
</template>

<style scoped>

#app{
  display: flex;
  flex-direction: column;
  height: 100svh;
}

.navbar {
  flex: 1;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.container{
  display: flex;
  flex-direction: row;
  flex: 9;
}

</style>
