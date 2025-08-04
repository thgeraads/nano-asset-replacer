<script setup>
import {ref, onMounted} from 'vue';

defineProps({
  device: {
    type: String,
    required: true
  }
})

</script>


<template>
  <div class="navbar">
    <h1>Nano {{ device.toUpperCase() }} asset replacer</h1>
  </div>
</template>

<style scoped>
.navbar {
  padding: 0 1rem;
  background-color: #0e1113;
  color: white;
  border-bottom: 2px solid #3e4142;
}
</style>
