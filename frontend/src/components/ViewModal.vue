<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';

defineProps({ photo: Object });
const emit = defineEmits(['close']);

onMounted(() => {
  const content = document.querySelector('#viewModal .modal-content');
  const backdrop = document.querySelector('#viewModal .modal-backdrop');
  gsap.fromTo(content,
    { scale: 0.85, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'expo.out' }
  );
  gsap.fromTo(backdrop,
    { opacity: 0 },
    { opacity: 1, duration: 0.35, ease: 'none' }
  );
});

function onClose() {
  const content = document.querySelector('#viewModal .modal-content');
  const backdrop = document.querySelector('#viewModal .modal-backdrop');
  gsap.to(content, {
    scale: 0.9, opacity: 0, duration: 0.2, ease: 'power1.in',
    onComplete: () => emit('close')
  });
  gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: 'none' });
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
