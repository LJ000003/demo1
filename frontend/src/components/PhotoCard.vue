<script setup>
import { ref } from 'vue';
import { animate } from 'animejs';

const props = defineProps({ photo: Object });
const emit = defineEmits(['view', 'edit', 'delete']);

const cardRef = ref(null);

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function tiltOn(e) {
  const card = cardRef.value;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  animate(card, { rotateY: x * 8, rotateX: -y * 8, duration: 200, ease: 'out' });
}

function tiltOff() {
  animate(cardRef.value, { rotateY: 0, rotateX: 0, duration: 400, ease: 'out' });
}

async function onDelete() {
  if (!confirm('确定要删除这张照片吗？')) return;
  await animate(cardRef.value, {
    scale: [1, 0.7],
    opacity: [1, 0],
    rotateX: [0, 40],
    translateY: [0, -30],
    filter: ['blur(0px)', 'blur(8px)'],
    duration: 400,
    ease: 'in'
  });
  emit('delete');
}
</script>

<template>
  <div
    ref="cardRef"
    class="photo-card"
    @mousemove="tiltOn"
    @mouseleave="tiltOff"
  >
    <div class="photo-thumb" @click="$emit('view')">
      <img :src="`/api/photos/${photo.id}/file`" :alt="photo.name" loading="lazy" />
      <div class="photo-overlay">
        <button class="btn-view" @click.stop="$emit('view')">查看</button>
      </div>
    </div>
    <div class="photo-body">
      <h4 class="photo-name">{{ photo.name }}</h4>
      <p class="photo-meta">{{ formatSize(photo.fileSize) }}</p>
      <div class="photo-actions">
        <button class="btn-edit" @click="$emit('edit')">编辑</button>
        <button class="btn-del" @click="onDelete">删除</button>
      </div>
    </div>
  </div>
</template>
