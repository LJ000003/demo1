import './style.css';

// ---- DOM 引用 ----
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

// ---- 工具函数 ----
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function closeModals() {
  viewModal.classList.add('hidden');
  editModal.classList.add('hidden');
}

// ---- 文件预览 ----
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove('preview-hidden');
      fileLabel.classList.add('preview-hidden');
    };
    reader.readAsDataURL(file);
  }
});

// ---- 上传 ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert('请选择一张照片');

  const fd = new FormData();
  fd.append('file', file);
  fd.append('name', uploadName.value.trim());
  fd.append('description', uploadDesc.value.trim());

  try {
    await fetch('/api/photos', { method: 'POST', body: fd });
    form.reset();
    preview.classList.add('preview-hidden');
    fileLabel.classList.remove('preview-hidden');
    loadPhotos();
  } catch (err) {
    alert('上传失败: ' + err.message);
  }
});

// ---- 加载照片列表 ----
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
    return;
  }
  emptyHint.classList.add('hidden');

  photos.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
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

// ---- 查看大图 ----
function openView(photo) {
  viewImage.src = `/api/photos/${photo.id}/file`;
  viewName.textContent = photo.name;
  viewDesc.textContent = photo.description || '';
  viewModal.classList.remove('hidden');
}

// ---- 编辑 ----
function openEdit(photo) {
  editId.value = photo.id;
  editName.value = photo.name;
  editDesc.value = photo.description || '';
  editModal.classList.remove('hidden');
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
    editModal.classList.add('hidden');
    loadPhotos();
  } catch (err) {
    alert('编辑失败: ' + err.message);
  }
});

// ---- 删除 ----
async function deletePhoto(id) {
  if (!confirm('确定要删除这张照片吗？')) return;
  try {
    await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    loadPhotos();
  } catch (err) {
    alert('删除失败: ' + err.message);
  }
}

// ---- 弹窗关闭 ----
document.querySelectorAll('.modal-close, .modal-backdrop').forEach((el) =>
  el.addEventListener('click', closeModals)
);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModals();
});

// ---- 初始化 ----
loadPhotos();
