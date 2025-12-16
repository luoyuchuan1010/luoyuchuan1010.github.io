const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 确保 uploads 目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 避免同名冲突
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200 MB 单文件限制，可按需调整
  }
});

// 中间件
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// 暴露 uploads 目录，方便查看已上传文件（仅开发/测试使用）
app.use('/uploads', express.static(UPLOAD_DIR));

// 上传接口，表单字段名为 files（多个文件）
app.post('/upload', upload.array('files'), (req, res) => {
  const files = (req.files || []).map(f => ({
    originalname: f.originalname,
    filename: f.filename,
    size: f.size,
    url: `/uploads/${f.filename}`
  }));

  res.json({
    ok: true,
    files
  });
});

// 简单根路径提示
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});