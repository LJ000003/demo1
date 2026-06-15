<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import gsap from 'gsap';
import PhotoCard from './PhotoCard.vue';

const LottieLoader = defineAsyncComponent(() => import('./LottieLoader.vue'));

const props = defineProps({
  photos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  totalCount: { type: Number, default: 0 }
});
const emit = defineEmits(['view', 'edit', 'delete', 'loadMore', 'batch-delete']);

const sentinel = ref(null);
let observer = null;

const selectedIds = ref(new Set());

function isSelected(id) {
  return selectedIds.value.has(id);
}

function toggleSelect(id) {
  const s = selectedIds.value;
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selectedIds.value = new Set(s); // trigger reactivity
}

const allSelected = computed(() =>
  props.photos.length > 0 && props.photos.every(p => selectedIds.value.has(p.id))
);

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(props.photos.map(p => p.id));
  }
}

function batchDelete() {
  if (selectedIds.value.size === 0) return;
  const ids = [...selectedIds.value];
  if (!confirm(`确定要删除选中的 ${ids.length} 张照片吗？`)) return;
  emit('batch-delete', ids);
  selectedIds.value = new Set();
}

// 当照片列表变化时清理无效的选中 ID
watch(() => props.photos, () => {
  const currentIds = new Set(props.photos.map(p => p.id));
  let changed = false;
  for (const id of selectedIds.value) {
    if (!currentIds.has(id)) { changed = true; break; }
  }
  if (changed) {
    const filtered = new Set([...selectedIds.value].filter(id => currentIds.has(id)));
    selectedIds.value = filtered;
  }
});

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
    gsap.fromTo(
      newCards.map((_, i) => `.photo-card[data-insert="${prevCount - newCards.length + i}"]`),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'expo.out' }
    );
  });
});
</script>

<template>
  <section class="gallery-section">
    <h2>我的照片 <span v-if="totalCount">({{ totalCount }})</span></h2>
    <div class="gallery-toolbar">
      <label>
        <input type="checkbox" :checked="allSelected" @change="toggleAll" />
        全选
      </label>
      <button v-if="selectedIds.size > 0" class="btn-del" @click="batchDelete">
        批量删除 ({{ selectedIds.size }})
      </button>
    </div>
    <div class="gallery">
      <PhotoCard
        v-for="(p, i) in photos"
        :key="p.id"
        :photo="p"
        :selected="isSelected(p.id)"
        :data-insert="i"
        @view="emit('view', p)"
        @edit="emit('edit', p)"
        @delete="emit('delete', p.id)"
        @toggle-select="toggleSelect"
      />
    </div>
    <div ref="sentinel" class="sentinel">
      <LottieLoader v-if="loading" name="loading" :size="60" />
      <span v-else-if="!hasMore && photos.length > 0" class="end-hint">没有更多了</span>
    </div>
    <div v-if="!loading && photos.length === 0" class="empty-state">
      <LottieLoader name="empty" :size="160" />
      <p class="empty-hint">还没有照片，上传第一张吧</p>
    </div>
  </section>
</template>
