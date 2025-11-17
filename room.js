(() => {
  const canvas = document.getElementById('canvas');
  const inner = document.getElementById('inner');
  if (!canvas || !inner) return;

  let isDown = false;
  let startX = 0;
  let startY = 0;
  let translateX = -200;
  let translateY = -100;

  const applyTransform = () => {
    inner.style.transform = `translate(${translateX}px, ${translateY}px)`;
  };
  applyTransform();

  canvas.addEventListener('mousedown', (e) => {
    isDown = true;
    canvas.style.cursor = 'grabbing';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    canvas.style.cursor = 'grab';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbManifest = document.getElementById('lb-manifest');
  const closeBtn = document.getElementById('closeBtn');
  const openLightbox = (src, manifestKey) => {
    lbImg.src = src;
    lb.classList.add('is-open');
    lb.style.animation = 'none';
    lb.offsetHeight; // reflow
    lb.style.animation = 'fadeIn .25s ease';
  };
  const closeLightbox = () => lb.classList.remove('is-open');
  closeBtn?.addEventListener('click', closeLightbox);
  lb?.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  inner.querySelectorAll('.exhibit img').forEach((img) => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const key = img.dataset.manifest || '';
      openLightbox(src, key);
    });
  });
})();


