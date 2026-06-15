<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { animate, stagger } from 'animejs';
import PhotoCard from './PhotoCard.vue';

const props = defineProps({
  photos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  totalCount: { type: Number, default: 0 }
});
const emit = defineEmits(['view', 'edit', 'delete', 'loadMore']);

const sentinel = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      emit('loadMore');
    }
  }, { threshold: 0 });
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// 新加载的照片入场动画（仅动画新增部分）
let prevCount = 0;
watch(() => props.photos.length, () => {
  if (props.photos.length === prevCount) return;
  const newCards = props.photos.slice(prevCount);
  prevCount = props.photos.length;
  nextTick(() => {
    animate(newCards.map((_, i) => `.photo-card[data-insert="${prevCount - newCards.length + i}"]`), {
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
    <h2>我的照片 <span v-if="totalCount">({{ totalCount }})</span></h2>
    <div class="gallery">
      <PhotoCard
        v-for="(p, i) in photos"
        :key="p.id"
        :photo="p"
        :data-insert="i"
        @view="emit('view', p)"
        @edit="emit('edit', p)"
        @delete="emit('delete', p.id)"
      />
    </div>
    <div ref="sentinel" class="sentinel">
      <span v-if="loading" class="loading-dots">加载中</span>
      <span v-else-if="!hasMore && photos.length > 0" class="end-hint">没有更多了</span>
    </div>
    <p v-if="!loading && photos.length === 0" class="empty-hint">还没有照片，上传第一张吧</p>
  </section>
</template>
