<script setup>
import {ref} from 'vue';

const props = defineProps({
  device: {
    type: String,
    required: true
  },
  loaded: {
    type: Boolean,
    required: true
  }
})


const emit = defineEmits(['update:device']);
const selectDevice = (device) => {
  if (props.device !== device) {
    emit('update:device', device);
  }
};
</script>

<template>
  <div class="content">
    <p class="deviceLabel">Select device:</p>
    <div class="buttonGroup">
      <a
          class="n6g-button"
          :class="{ active: props.device === '6g' }"
          @click="selectDevice('6g')"
      >
        Nano 6
      </a>
      <a
          class="n7g-button"
          :class="{ active: props.device === '7g' }"
          @click="selectDevice('7g')"
      >
        Nano 7
      </a>
    </div>


    <div class="themeControls">
      <p class="exportLabel">Asset options</p>
      <a
          class="copyFromOriginButton"
          :class="{disabled: !props.loaded }"
      >Copy all from origin</a>
    </div>


    <div class="exportOptions">
      <p class="exportLabel">Export options</p>

      <div class="buildButtons">
        <a v-if="props.device === '6g'"
           class="buildButton"
           :class="{disabled: !props.loaded }"
        >
          Build for 6G
        </a>
        <a v-if="props.device === '7g'"
           class="buildButton"
           :class="{disabled: !props.loaded }">
          Build 7G (2012)
        </a>
        <a
            v-if="props.device === '7g'"
            class="buildButton"
            :class="{disabled: !props.loaded }">
          Build 7G (2015)
        </a>
        <a
            class="buildButton"
            :class="{disabled: !props.loaded }">
          Export modified .PNGs
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

.themeControls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  margin-top: 1rem;
  max-width: 250px;
}

.exportOptions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  margin-top: 1rem;
  max-width: 250px;
}

.copyFromOriginButton {
  display: inline-block;
  padding: 0.6rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  align-self: center;
  justify-self: center;
  width: 100%;
  text-align: center;
}

.buildButtons {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}

.buildButton {
  max-width: 250px;
  width: 100%;
  display: inline-block;
  padding: 0.6rem 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.deviceLabel {
  margin-top: 0;
}

.deviceLabel, .exportLabel {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.exportLabel {
  margin-top: 2rem;
}

.buttonGroup a {
  display: inline-block;
  padding: 0.6rem 1rem;
  background-color: white;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s ease;

}

.active {
  background-color: #007bff !important;
  color: white !important;
}

.n6g-button {
  background-color: #ccc;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.n7g-button {
  background-color: #ddd;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

/* Active button styles */
.active {
  background-color: #007bff;
  color: white;
}


/* Layout styling */
.buttonGroup {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.content {
  flex: 1;
  padding: 1rem;
  background-color: #0e1113;
  border-left: 1px solid #3e4142;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
