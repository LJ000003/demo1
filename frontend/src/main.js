import { animate, stagger } from 'animejs';
import './style.css';

// ═══════════════════════════════════════
// 背景光球
// ═══════════════════════════════════════
const orbsHTML = `
  <div class="bg-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>`;
document.body.insertAdjacentHTML('afterbegin', orbsHTML);

function animateOrbs() {
  animate('.orb-1', {
    translateX: ['-10%', '10%', '-5%', '5%', '-10%'],
    translateY: ['-5%', '5%', '10%', '-5%', '-5%'],
    scale: [1, 1.15, 0.9, 1.05, 1],
    duration: 12000,
    ease: 'inOut',
    loop: true
  });
  animate('.orb-2', {
    translateX: ['5%', '-8%', '3%', '-5%', '5%'],
    translateY: ['5%', '-8%', '3%', '5%', '5%'],
    scale: [1, 0.85, 1.1, 0.95, 1],
    duration: 15000,
    ease: 'inOut',
    loop: true
  });
  animate('.orb-3', {
    translateX: ['3%', '-6%', '8%', '-3%', '3%'],
    translateY: ['-5%', '3%', '-8%', '5%', '-5%'],
    scale: [1, 1.1, 0.85, 1.05, 1],
    duration: 10000,
    ease: 'inOut',
    loop: true
  });
}
animateOrbs();

// ═══════════════════════════════════════
// 光标拖尾
// ═══════════════════════════════════════
let mouseX = 0, mouseY = 0;
const trailCount = 12;
const trails = [];

for (let i = 0; i < trailCount; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.opacity = (1 - i / trailCount) * 0.5;
  dot.style.transform = `translate(-50%, -50%) scale(${1 - i / trailCount})`;
  document.body.appendChild(dot);
  trails.push({ el: dot, x: 0, y: 0 });
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateTrail() {
  let tx = mouseX, ty = mouseY;
  for (let i = 0; i < trails.length; i++) {
    const t = trails[i];
    t.x += (tx - t.x) * (0.35 - i * 0.02);
    t.y += (ty - t.y) * (0.35 - i * 0.02);
    t.el.style.left = t.x + 'px';
    t.el.style.top = t.y + 'px';
    tx = t.x;
    ty = t.y;
  }
  requestAnimationFrame(updateTrail);
}
updateTrail();

// ═══════════════════════════════════════
// DOM 引用
// ═══════════════════════════════════════
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const fileLabel = document.getElementById('fileLabel');
const uploadName = document.getElementById('uploadName');
const uploadDesc = document.getElementById('uploadDesc');
const gallery = document.getElementById('gallery');
const emptyHint = document.getElementById('emptyHint');
const photoCount = document.getElementById('photoCount');

const viewModal = document.getElementById('viewModal');
const viewImage = document.getElementById('viewImage');
const viewName = document.getElementById('viewName');
const viewDesc = document.getElementById('viewDesc');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editId = document.getElementById('editId');
const editName = document.getElementById('editName');
const editDesc = document.getElementById('editDesc');

// ═══════════════════════════════════════
// 按钮波纹效果
// ═══════════════════════════════════════
document.addEventListener('click', (e) => {
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

// ═══════════════════════════════════════
// 3D 卡片倾斜
// ═══════════════════════════════════════
function initCardTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    animate(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 200,
      ease: 'out'
    });
  });
  card.addEventListener('mouseleave', () => {
    animate(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 400,
      ease: 'out'
    });
  });
}

// ═══════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function closeModals() {
  const openModals = [viewModal, editModal].filter(m => !m.classList.contains('hidden'));
  if (!openModals.length) return;
  openModals.forEach(m => {
    animate(m.querySelector('.modal-content'), {
      scale: [1, 0.9],
      opacity: [1, 0],
      duration: 200,
      ease: 'in',
      onComplete: () => m.classList.add('hidden')
    });
    animate(m.querySelector('.modal-backdrop'), {
      opacity: [1, 0],
      duration: 200,
      ease: 'linear'
    });
  });
}

// ═══════════════════════════════════════
// 页面入场动画
// ═══════════════════════════════════════
function pageEntrance() {
  animate('.header h1', {
    translateY: [-60, 0],
    opacity: [0, 1],
    duration: 1000,
    ease: 'outExpo'
  });
  // 标题文字渐变闪烁
  animate('.header h1', {
    filter: [
      'drop-shadow(0 0 0px rgba(0,212,255,0))',
      'drop-shadow(0 0 20px rgba(0,212,255,0.6))',
      'drop-shadow(0 0 12px rgba(0,212,255,0.3))'
    ],
    duration: 1500,
    delay: 600,
    ease: 'outExpo'
  });

  animate('.upload-card', {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 700,
    delay: 300,
    ease: 'outExpo'
  });

  animate('.gallery-section h2', {
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 600,
    delay: 500,
    ease: 'out'
  });
}

// ═══════════════════════════════════════
// 文件预览
// ═══════════════════════════════════════
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove('preview-hidden');
      fileLabel.classList.add('preview-hidden');
      animate(preview, {
        scale: [0.85, 1],
        opacity: [0, 1],
        duration: 500,
        ease: 'outExpo'
      });
    };
    reader.readAsDataURL(file);
  }
});

// ═══════════════════════════════════════
// 上传
// ═══════════════════════════════════════
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert('请选择一张照片');

  const fd = new FormData();
  fd.append('file', file);
  fd.append('name', uploadName.value.trim());
  fd.append('description', uploadDesc.value.trim());

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  // 按钮加载态
  animate(btn, {
    scale: [1, 0.96, 1],
    duration: 300,
    ease: 'inOut'
  });

  try {
    await fetch('/api/photos', { method: 'POST', body: fd });
    form.reset();
    preview.classList.add('preview-hidden');
    fileLabel.classList.remove('preview-hidden');
    // 脉冲 + 发光
    animate('.upload-card', {
      borderColor: [
        'rgba(255,255,255,0.08)',
        'rgba(0,212,255,0.6)',
        'rgba(255,255,255,0.08)'
      ],
      boxShadow: [
        '0 8px 32px rgba(0,0,0,0.3)',
        '0 8px 32px rgba(0,0,0,0.3), 0 0 30px rgba(0,212,255,0.4)',
        '0 8px 32px rgba(0,0,0,0.3)'
      ],
      duration: 1000,
      ease: 'outExpo'
    });
    loadPhotos();
  } catch (err) {
    alert('上传失败: ' + err.message);
  } finally {
    btn.disabled = false;
  }
});

// ═══════════════════════════════════════
// 加载照片列表
// ═══════════════════════════════════════
async function loadPhotos() {
  try {
    const res = await fetch('/api/photos');
    const photos = await res.json();
    render(photos);
  } catch (err) {
    gallery.innerHTML = '<p class="error">加载失败，请确认后端已启动</p>';
  }
}

function render(photos) {
  gallery.innerHTML = '';
  photoCount.textContent = photos.length ? `(${photos.length})` : '';

  if (photos.length === 0) {
    emptyHint.classList.remove('hidden');
    animate('.empty-hint', {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 500,
      ease: 'out'
    });
    return;
  }
  emptyHint.classList.add('hidden');

  photos.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.style.opacity = 0;
    card.innerHTML = `
      <div class="photo-thumb" data-id="${p.id}">
        <img src="/api/photos/${p.id}/file" alt="${p.name}" loading="lazy" />
        <div class="photo-overlay">
          <button class="btn-view" data-id="${p.id}">查看</button>
        </div>
      </div>
      <div class="photo-body">
        <h4 class="photo-name">${p.name}</h4>
        <p class="photo-meta">${formatSize(p.fileSize)}</p>
        <div class="photo-actions">
          <button class="btn-edit" data-id="${p.id}">编辑</button>
          <button class="btn-del" data-id="${p.id}">删除</button>
        </div>
      </div>`;
    gallery.appendChild(card);
    initCardTilt(card);
  });

  // 卡片交错入场
  animate('.photo-card', {
    translateY: [40, 0],
    opacity: [0, 1],
    delay: stagger(60, { from: 'first' }),
    duration: 600,
    ease: 'outExpo'
  });

  // 事件委托
  gallery.querySelectorAll('.btn-view, .photo-thumb img').forEach((el) =>
    el.addEventListener('click', () => openView(photos.find((p) => p.id == el.dataset.id)))
  );
  gallery.querySelectorAll('.btn-edit').forEach((el) =>
    el.addEventListener('click', () => openEdit(photos.find((p) => p.id == el.dataset.id)))
  );
  gallery.querySelectorAll('.btn-del').forEach((el) =>
    el.addEventListener('click', () => deletePhoto(el.dataset.id))
  );
}

// ═══════════════════════════════════════
// 查看大图
// ═══════════════════════════════════════
function openView(photo) {
  viewImage.src = `/api/photos/${photo.id}/file`;
  viewName.textContent = photo.name;
  viewDesc.textContent = photo.description || '';
  viewModal.classList.remove('hidden');
  animate(viewModal.querySelector('.modal-content'), {
    scale: [0.85, 1],
    opacity: [0, 1],
    duration: 350,
    ease: 'outExpo'
  });
  animate(viewModal.querySelector('.modal-backdrop'), {
    opacity: [0, 1],
    duration: 350,
    ease: 'linear'
  });
  // 大图加载后微动画
  viewImage.onload = () => {
    animate(viewImage, {
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 400,
      ease: 'out'
    });
  };
}

// ═══════════════════════════════════════
// 编辑弹窗
// ═══════════════════════════════════════
function openEdit(photo) {
  editId.value = photo.id;
  editName.value = photo.name;
  editDesc.value = photo.description || '';
  editModal.classList.remove('hidden');
  animate(editModal.querySelector('.modal-content'), {
    scale: [0.85, 1],
    opacity: [0, 1],
    duration: 350,
    ease: 'outExpo'
  });
  animate(editModal.querySelector('.modal-backdrop'), {
    opacity: [0, 1],
    duration: 350,
    ease: 'linear'
  });
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editId.value;
  try {
    await fetch(`/api/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.value, description: editDesc.value })
    });
    closeModals();
    loadPhotos();
  } catch (err) {
    alert('编辑失败: ' + err.message);
  }
});

// ═══════════════════════════════════════
// 删除
// ═══════════════════════════════════════
async function deletePhoto(id) {
  if (!confirm('确定要删除这张照片吗？')) return;
  const card = document.querySelector(`.btn-del[data-id="${id}"]`)?.closest('.photo-card');
  if (card) {
    await animate(card, {
      scale: [1, 0.7],
      opacity: [1, 0],
      rotateX: [0, 40],
      translateY: [0, -30],
      filter: ['blur(0px)', 'blur(8px)'],
      duration: 400,
      ease: 'in'
    });
  }
  try {
    await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    loadPhotos();
  } catch (err) {
    alert('删除失败: ' + err.message);
  }
}

// ═══════════════════════════════════════
// 弹窗关闭事件
// ═══════════════════════════════════════
document.querySelectorAll('.modal-close, .modal-backdrop').forEach((el) =>
  el.addEventListener('click', closeModals)
);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModals();
});

// ═══════════════════════════════════════
// 初始化
// ═══════════════════════════════════════
pageEntrance();
loadPhotos();
