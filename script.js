// 基本交互：导航切换、联系表单简单验证
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const result = document.getElementById('formResult');

  // 更新页脚年份
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 移动端切换导航
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isHidden = siteNav.style.display === '' || siteNav.style.display === 'none';
      siteNav.style.display = isHidden ? 'flex' : 'none';
    });

    // 点击导航后在移动端收起
    siteNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 640) siteNav.style.display = 'none';
      });
    });
  }

  // 简单前端表单处理（示例：不实际发送）
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      result.textContent = '';
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        result.textContent = '请填写所有必填项。';
        result.style.color = 'crimson';
        return;
      }
      // 模拟发送
      result.textContent = '发送中...';
      result.style.color = 'var(--muted)';
      setTimeout(() => {
        result.textContent = '已发送！感谢你的联系，我们会尽快回复。';
        result.style.color = 'green';
        form.reset();
      }, 900);
    });
  }
});