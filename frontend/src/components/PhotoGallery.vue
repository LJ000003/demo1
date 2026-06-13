<script setup>
import { watch, nextTick } from 'vue';
import { animate, stagger } from 'animejs';
import PhotoCard from './PhotoCard.vue';

const props = defineProps({ photos: { type: Array, default: () => [] } });
const emit = defineEmits(['view', 'edit', 'delete']);

watch(() => props.photos, () => {
  if (props.photos.length === 0) return;
  nextTick(() => {
    animate('.photo-card', {
      translateY: [40, 0],
      opacity: [0, 1],
      delay: stagger(60, { from: 'first' }),
      duration: 600,
      ease: 'outExpo'
    });
  });
});
</script>

<template>
  <section class="gallery-section">
    <h2>我的照片 <span v-if="photos.length">({{ photos.length }})</span></h2>
    <div class="gallery">
      <PhotoCard
        v-for="p in photos"
        :key="p.id"
        :photo="p"
        @view="emit('view', p)"
        @edit="emit('edit', p)"
        @delete="emit('delete', p.id)"
      />
    </div>
    <p v-if="photos.length === 0" class="empty-hint">还没有照片，上传第一张吧</p>
  </section>
</template>
