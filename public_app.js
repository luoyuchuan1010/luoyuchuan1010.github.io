(function () {
  const dropArea = document.getElementById('drop-area');
  const fileElem = document.getElementById('fileElem');
  const pickBtn = document.getElementById('file-picker-btn');
  const progressWrap = document.getElementById('progress-wrap');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const fileList = document.getElementById('file-list');

  // 打开文件选择
  pickBtn.addEventListener('click', () => fileElem.click());
  fileElem.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length) uploadFiles(files);
  });

  // 拖拽事件
  ['dragenter', 'dragover'].forEach(evt => {
    dropArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('dragover');
    }, false);
  });

  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) uploadFiles(files);
  });

  function uploadFiles(files) {
    const formData = new FormData();
    // 多文件，字段名为 files（后端用 multer.array('files') 接收）
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // 使用 XMLHttpRequest 以便获取上传进度
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressWrap.style.display = 'block';
        progressBar.style.width = percent + '%';
        progressText.textContent = percent + '%';
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        progressBar.style.width = '0%';
        progressWrap.style.display = 'none';
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText);
            if (resp && resp.ok && Array.isArray(resp.files)) {
              resp.files.forEach(f => addUploadedItem(f));
            } else {
              alert('上传完成，但服务器返回未知响应。');
            }
          } catch (err) {
            alert('解析服务器响应失败：' + err.message);
          }
        } else {
          alert('上传失败，HTTP ' + xhr.status);
        }
      }
    };

    xhr.send(formData);
  }

  function addUploadedItem(file) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = file.url;
    a.target = '_blank';
    a.textContent = file.originalname + ' (' + humanFileSize(file.size) + ')';
    li.appendChild(a);
    fileList.insertBefore(li, fileList.firstChild);
  }

  function humanFileSize(bytes) {
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    const units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }
})();