<script setup>
import {defineProps, defineEmits, ref, computed} from 'vue';
import {extractFilteredImages} from '../utils/unpack.js';
import {
  getGroupForAssetId,
  validAssetEndings,
  groupMap,
  importantAssets,
  doNotShow
} from '../utils/assetGroups.js';
import {reactive} from 'vue';

const colorInfoMap = reactive({});
const props = defineProps({
  device: {
    type: String,
    required: true
  },
  loaded: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:loaded']);

const fileInput = ref(null);
const imageInput = ref(null);
const replacingImage = ref(null);

const allImages = ref([]);
const selectedCategory = ref('App Icons');

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFile = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const buffer = await file.arrayBuffer();

    const jsonConfig = {
      wallpapers_by_color: {} // Still empty, unless needed
    };

    const rawImages = await extractFilteredImages(buffer, jsonConfig);

    // Add `fullId` to each image (id + format)
    const processedImages = rawImages.map(img => ({
      ...img,
      fullId: `${img.id}_${img.format.toString(16).padStart(4, '0')}`
    }));

    allImages.value = processedImages;

    emit('update:loaded', true);

    console.log('✅ Loaded and processed images:', processedImages);
  } catch (err) {
    console.error('❌ Failed to load IPSW file:', err.message || err);
    emit('update:loaded', false);
  }
};


import JSZip from 'jszip';

const loadStockAssets = async () => {
  try {
    const response = await fetch('https://ipsw.zeehondie.net/unmodified.zip');
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const images = [];

    for (const filename of Object.keys(zip.files)) {
      if (!filename.toLowerCase().endsWith('.png')) continue;

      const match = filename.match(/^(\d+)_([0-9a-fA-F]{4})\.png$/);
      if (!match) continue;

      const [, id, formatHex] = match;
      const file = zip.files[filename];
      const blob = await file.async('blob');
      const dataURL = await blobToDataURL(blob);

      // Optionally get dimensions
      const {width, height} = await getImageSize(dataURL);

      images.push({
        id: parseInt(id),
        format: parseInt(formatHex, 16),
        fullId: `${id}_${formatHex.toLowerCase()}`,
        dataURL,
        width,
        height
      });
    }

    allImages.value = images;
    emit('update:loaded', true);
    emit('modified-assets', []); // no modified yet, unless you copy-to-modified by default

    console.log(`📦 Loaded ${images.length} PNGs from stock ZIP`);
  } catch (err) {
    console.error('❌ Failed to load stock PNGs:', err);
    emit('update:loaded', false);
  }
};

const blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const getImageSize = (dataURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({width: img.width, height: img.height});
    img.src = dataURL;
  });
};


const openReplacePicker = (img) => {
  replacingImage.value = img;
  imageInput.value?.click();
};

import RgbQuant from 'rgbquant';

const replaceAsset = async (event) => {
  const file = event.target.files?.[0];
  if (!file || !replacingImage.value) return;

  try {
    const original = replacingImage.value;
    const imgBitmap = await createImageBitmap(file);

    const canvas = document.createElement('canvas');
    canvas.width = original.width;
    canvas.height = original.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);

    const format = original.fullId.split('_')[1];
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (format === '0064' || format === '0065') {
      const maxColors = format === '0064' ? 255 : 65535;
      const before = countUniqueColors(imgData);
      const quantized = quantizeWithRgbQuant(imgData, maxColors);
      ctx.putImageData(quantized, 0, 0);
      const after = countUniqueColors(quantized);

      colorInfoMap[original.fullId] = `${before} to ${after} colors`;
      console.log(`🎨 ${original.fullId}: ${before} to ${after} colors`);
    } else {
      const colorCount = countUniqueColors(imgData);
      colorInfoMap[original.fullId] = `Original colors: ${colorCount}`;
      console.log(`🎨 No quantization needed, colors: ${colorCount}`);
    }


    const finalDataURL = canvas.toDataURL('image/png');

    const index = allImages.value.findIndex(
        i => `${i.id}_${i.format.toString(16).padStart(4, '0')}` === original.fullId
    );

    if (index !== -1) {
      allImages.value[index] = {
        ...allImages.value[index],
        modifiedDataURL: finalDataURL
      };
    }

    emit(
        'modified-assets',
        allImages.value.filter(i => i.modifiedDataURL)
    );

    replacingImage.value = null;
    event.target.value = null;

  } catch (err) {
    console.error('❌ Failed to replace asset:', err);
  }
};


const categorizedImages = computed(() => {
  const categoryIds = importantAssets[selectedCategory.value] || [];
  const idSet = new Set(categoryIds);

  return allImages.value
      .map(img => ({
        ...img,
        fullId: `${img.id}_${img.format.toString(16).padStart(4, '0')}`
      }))
      .filter(img =>
          idSet.has(img.fullId) && !doNotShow.includes(img.fullId)
      );
});


const copyFromOriginAssets = () => {
  allImages.value = allImages.value.map(img => ({
    ...img,
    modifiedDataURL: img.dataURL
  }));

  emit(
      'modified-assets',
      allImages.value.filter(i => i.modifiedDataURL)
  );

  console.log('📝 All original assets copied to modified.');
};

defineExpose({copyFromOriginAssets});

const syncToGroup = async (sourceImg) => {
  if (!sourceImg || !sourceImg.modifiedDataURL) {
    console.warn('⚠️ syncToGroup called without a valid image');
    return;
  }

  const groupKey = getGroupForAssetId(sourceImg.fullId);
  if (!groupKey) {
    console.warn(`🔍 No group found for ${sourceImg.fullId}`);
    return;
  }

  const groupIds = groupMap[groupKey];

  const srcImageBitmap = await createImageBitmap(await dataURLToBlob(sourceImg.modifiedDataURL));

  const updatedImages = allImages.value.map((img) => {
    if (!groupIds.includes(img.fullId) || img.fullId === sourceImg.fullId) return img;

    // Draw resized image to fit destination canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(srcImageBitmap, 0, 0, canvas.width, canvas.height);

    const resizedDataURL = canvas.toDataURL('image/png');

    return {
      ...img,
      modifiedDataURL: resizedDataURL
    };
  });

  allImages.value = updatedImages;

  emit(
      'modified-assets',
      updatedImages.filter(i => i.modifiedDataURL)
  );

  console.log(`✅ Synced resized image from ${sourceImg.fullId} to group "${groupKey}"`);
};

// Helper
const dataURLToBlob = async (dataURL) => {
  const res = await fetch(dataURL);
  return await res.blob();
};

function quantizeWithRgbQuant(imageData, maxColors) {
  const q = new RgbQuant({
    colors: maxColors,
    method: 2,
    initColors: 4096,
    minHueCols: 256,
    dithKern: null
  });

  q.sample(imageData);
  const rgbaArray = q.reduce(imageData, true);
  return new ImageData(new Uint8ClampedArray(rgbaArray), imageData.width, imageData.height);
}

function countUniqueColors(imageData) {
  const data = imageData.data;
  const colors = new Set();
  for (let i = 0; i < data.length; i += 4) {
    colors.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`);
  }
  return colors.size;
}


</script>

<template>
  <div class="content">
    <!-- Category toggle bar -->
    <div class="assetTypeBar" v-if="props.loaded">
      <div class="categoryTabs">
        <button
            v-for="category in Object.keys(importantAssets)"
            :key="category"
            :class="{ active: category === selectedCategory }"
            @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="assetContainer">
      <!-- Upload section -->
      <div class="uploadSection" v-if="!props.loaded">
        <input type="file" ref="fileInput" @change="handleFile" style="display: none"/>
        <a class="btn-pri uploadButton" @click="openFilePicker">Upload IPSW</a>
        <p>-- OR --</p>
        <a class="btn-alt loadStockButton" @click="loadStockAssets">Use stock assets</a>
      </div>

      <!-- Filtered image section -->
      <div class="assetSection" v-if="props.loaded">
        <div class="groupSection">
          <h3 class="groupTitle">{{ selectedCategory }}</h3>
          <div class="imageGrid">
            <div v-for="img in categorizedImages" :key="img.fullId" class="imageItem">
              <p v-if="['229442319_0064', '229442320_0064', '229442322_0064', '229442323_0064'].includes(img.fullId)">(i) Neutral Grey</p>
              <p class="imageIdLabel">{{ img.fullId }}</p>

              <!-- Original image box -->
              <div class="imageBox">
                <img :src="img.dataURL" :alt="img.fullId + ' original'"/>
              </div>


              <svg class="arrowDown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path
                    d="M297.4 566.6C309.9 579.1 330.2 579.1 342.7 566.6L502.7 406.6C515.2 394.1 515.2 373.8 502.7 361.3C490.2 348.8 469.9 348.8 457.4 361.3L352 466.7L352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 466.7L182.6 361.3C170.1 348.8 149.8 348.8 137.3 361.3C124.8 373.8 124.8 394.1 137.3 406.6L297.3 566.6z"/>
              </svg>

              <!-- Replacement image box (or blank) -->
              <div class="imageBox">

                <!--                blank box with the same height as the original-->
                <!-- Replacement image box (or blank) -->
                <div
                    class="imageBox"
                    :style="{ width: img.width + 'px', height: img.height + 'px' }"
                >
                  <img
                      v-if="img.modifiedDataURL"
                      :src="img.modifiedDataURL"
                      :alt="img.fullId + ' modified'"
                      :width="img.width"
                      :height="img.height"
                  />
                  <div
                      v-else
                      class="placeholderBox"
                      :style="{ width: img.width + 'px', height: img.height + 'px' }"
                  ></div>
                </div>
              </div>
              <p v-if="colorInfoMap[img.fullId]" class="colorInfo">
                {{ colorInfoMap[img.fullId] }}
              </p>

              <!-- ID and buttons -->
              <a class="syncButton" v-if="selectedCategory === 'Wallpapers'" @click="syncToGroup(img)">Sync to group</a>
              <a class="replaceButton" @click="openReplacePicker(img)">Replace Asset</a>
            </div>
          </div>
        </div>

        <!-- Hidden file input for replace -->
        <input
            type="file"
            ref="imageInput"
            style="display: none"
            accept="image/*"
            @change="replaceAsset"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>
.imageIdLabel {
  margin-top: 4px;
}

.imageBox {
  border: 1px solid #3e4142;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholderBox {
  background-color: #2a2d2f;
  border-radius: 4px;
}


.arrowDown {
  width: 36px;
  height: 36px;
  padding: 8px;
  fill: #007bff;
  //cursor: pointer;

}

.syncButton {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  width: 128px;
  text-align: center;
}

.replaceButton {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  width: 128px;
  text-align: center;
}


.content {
  flex: 4;
  background-color: #0e1113;
  border-right: 1px solid #3e4142;
}

.assetTypeBar {
  height: 48px;
  border-bottom: 2px solid #3e4142;
  display: flex;
  align-items: center;
  justify-content: center;
}

.categoryTabs {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.categoryTabs button {
  background: transparent;
  color: white;
  border: 1px solid #007bff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.categoryTabs button.active {
  background-color: #007bff;
}

.assetContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 50px);
}

.uploadSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: fit-content;
  background-color: #0e1113;
  color: white;
}

.uploadButton {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.loadStockButton {
  border: 1px solid #007bff;
  background-color: transparent;
  border-radius: 4px;
  color: white;
  padding: 10px 20px;
}

.assetSection {
  width: 100%;
}

.groupTitle {
  color: white;
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.imageGrid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px;
  gap: 12px;
  max-width: 100%;
  overflow-y: auto;
}


.imageItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1d1f;
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
}

.imageItem img {
  width: auto;
  height: auto;
  border-radius: 4px;
}

.imageLabel {
  color: #ccc;
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
}
</style>
