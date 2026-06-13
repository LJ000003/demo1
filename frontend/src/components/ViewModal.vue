<script setup>
import { onMounted } from 'vue';
import { animate } from 'animejs';

defineProps({ photo: Object });
const emit = defineEmits(['close']);

onMounted(() => {
  const content = document.querySelector('#viewModal .modal-content');
  const backdrop = document.querySelector('#viewModal .modal-backdrop');
  animate(content, { scale: [0.85, 1], opacity: [0, 1], duration: 350, ease: 'outExpo' });
  animate(backdrop, { opacity: [0, 1], duration: 350, ease: 'linear' });
});

function onClose() {
  const content = document.querySelector('#viewModal .modal-content');
  const backdrop = document.querySelector('#viewModal .modal-backdrop');
  animate(content, { scale: [1, 0.9], opacity: [1, 0], duration: 200, ease: 'in' });
  animate(backdrop, { opacity: [1, 0], duration: 200, ease: 'linear', onComplete: () => emit('close') });
}
</script>

<template>
  <div id="viewModal" class="modal">
    <div class="modal-backdrop" @click="onClose"></div>
    <div class="modal-content">
      <button class="modal-close" @click="onClose">&times;</button>
      <img :src="`/api/photos/${photo.id}/file`" :alt="photo.name" />
      <div class="modal-info">
        <h3>{{ photo.name }}</h3>
        <p>{{ photo.description }}</p>
      </div>
    </div>
  </div>
</template>
