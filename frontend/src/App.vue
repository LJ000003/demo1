<script setup>
import { ref, onMounted } from 'vue';
import { animate } from 'animejs';
import AppHeader from './components/AppHeader.vue';
import UploadCard from './components/UploadCard.vue';
import PhotoGallery from './components/PhotoGallery.vue';
import ViewModal from './components/ViewModal.vue';
import EditModal from './components/EditModal.vue';

const photos = ref([]);
const viewPhoto = ref(null);
const editPhoto = ref(null);
const page = ref(0);
const hasMore = ref(true);
const loading = ref(false);
const totalCount = ref(0);
const showBackTop = ref(false);

function scrollToTop() {
  const start = window.scrollY;
  const duration = 600; // ms
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start * (1 - easeOutCubic(progress)));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const res = await fetch(`/api/photos?page=${page.value}&size=20`);
    const json = await res.json();
    const { content, totalPages, totalElements } = json.data;
    photos.value.push(...content);
    page.value++;
    hasMore.value = page.value < totalPages;
    totalCount.value = totalElements;
  } catch {
    // 加载失败保留已加载的照片
  } finally {
    loading.value = false;
  }
}

function resetAndReload() {
  photos.value = [];
  page.value = 0;
  hasMore.value = true;
  loadMore();
}

function onView(photo)   { viewPhoto.value = photo; }
function onEdit(photo)   { editPhoto.value = photo; }
function onUploaded()    { resetAndReload(); }
function onSaved()       { editPhoto.value = null; resetAndReload(); }

async function extractErrorMessage(res) {
  try {
    const data = await res.json();
    return data.message || `请求失败（${res.status}）`;
  } catch {
    return `服务器返回异常（${res.status}），请稍后重试`;
  }
}

async function onDelete(id) {
  try {
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const msg = await extractErrorMessage(res);
      throw new Error(msg);
    }
    photos.value = photos.value.filter(p => p.id !== id);
  } catch (err) {
    alert(err.message);
  }
}

// 背景、光标、入场动画（首次加载时执行）
let firstLoad = true;
function initEffects() {
  if (!firstLoad) return;
  firstLoad = false;

  const orbsHTML = `
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', orbsHTML);
  animate('.orb-1', { translateX: ['-10%','10%','-5%','5%','-10%'], translateY: ['-5%','5%','10%','-5%','-5%'], scale: [1,1.15,0.9,1.05,1], duration: 12000, ease: 'inOut', loop: true });
  animate('.orb-2', { translateX: ['5%','-8%','3%','-5%','5%'], translateY: ['5%','-8%','3%','5%','5%'], scale: [1,0.85,1.1,0.95,1], duration: 15000, ease: 'inOut', loop: true });
  animate('.orb-3', { translateX: ['3%','-6%','8%','-3%','3%'], translateY: ['-5%','3%','-8%','5%','-5%'], scale: [1,1.1,0.85,1.05,1], duration: 10000, ease: 'inOut', loop: true });

  const trails = [];
  let mouseX = 0, mouseY = 0;
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.opacity = (1 - i / 12) * 0.5;
    dot.style.transform = `translate(-50%, -50%) scale(${1 - i / 12})`;
    document.body.appendChild(dot);
    trails.push({ el: dot, x: 0, y: 0 });
  }
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  (function tick() {
    let tx = mouseX, ty = mouseY;
    for (let i = 0; i < trails.length; i++) {
      const t = trails[i];
      t.x += (tx - t.x) * (0.35 - i * 0.02);
      t.y += (ty - t.y) * (0.35 - i * 0.02);
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      tx = t.x; ty = t.y;
    }
    requestAnimationFrame(tick);
  })();

  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  animate('.header h1', { translateY: [-60,0], opacity: [0,1], duration: 1000, ease: 'outExpo' });
  animate('.upload-card', { translateY: [40,0], opacity: [0,1], duration: 700, delay: 300, ease: 'outExpo' });
  animate('.gallery-section h2', { translateY: [30,0], opacity: [0,1], duration: 600, delay: 500, ease: 'out' });
}

onMounted(() => {
  initEffects();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      viewPhoto.value = null;
      editPhoto.value = null;
    }
  });
  window.addEventListener('scroll', () => {
    showBackTop.value = window.scrollY > 400;
  });
  loadMore();
});
</script>

<template>
  <AppHeader />
  <main class="page">
    <UploadCard @uploaded="onUploaded" />
    <PhotoGallery
      :photos="photos"
      :loading="loading"
      :has-more="hasMore"
      :total-count="totalCount"
      @view="onView"
      @edit="onEdit"
      @delete="onDelete"
      @load-more="loadMore"
    />
  </main>
  <button v-show="showBackTop" class="back-top" @click="scrollToTop" title="回到顶部">
    ↑
  </button>
  <ViewModal v-if="viewPhoto" :photo="viewPhoto" @close="viewPhoto = null" />
  <EditModal v-if="editPhoto" :photo="editPhoto" @close="editPhoto = null" @saved="onSaved" />
</template>
