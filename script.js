/* ChemiCheck Landing · script.js  v4 */

/* ── Nav scroll shadow ── */
const snav = document.getElementById('snav');
if (snav) {
  window.addEventListener('scroll', () => {
    snav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

/* ── Scroll fade-in ── */
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });
document.querySelectorAll('.fu').forEach(el => fadeObs.observe(el));

/* ── Stat counter ── */
function formatNum(v, target) {
  if (target >= 100_000_000) return (v / 100_000_000).toFixed(2).replace(/\.?0+$/, '') + '억';
  if (target >= 10_000_000)  return (v / 10_000_000 ).toFixed(1).replace(/\.?0+$/, '') + '천만';
  if (target >= 1_000_000)   return (v / 10_000     ).toFixed(0) + '만';
  if (target >= 100_000)     return (v / 10_000     ).toFixed(1).replace(/\.?0+$/, '') + '만';
  return v.toLocaleString('ko-KR');
}
function finalNum(t) {
  if (t === 427000000) return '4.27억';
  if (t === 560000)    return '56만';
  if (t === 13000000)  return '1,300만';
  return t.toLocaleString('ko-KR');
}
function runCounter(el, target, dur = 1400) {
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNum(Math.floor(ease * target), target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = finalNum(target);
  };
  requestAnimationFrame(tick);
}
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target, +e.target.dataset.target); cntObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => cntObs.observe(el));

/* ── Gallery ── */
const rail = document.getElementById('galleryRail');
const dots = document.querySelectorAll('.gd');
function syncDots() {
  if (!rail || !dots.length) return;
  const slides = rail.querySelectorAll('.g-slide');
  if (!slides.length) return;
  const sw = slides[0].offsetWidth + 12;
  const idx = Math.min(Math.round(rail.scrollLeft / sw), dots.length - 1);
  dots.forEach((d, i) => d.classList.toggle('on', i === idx));
}
if (rail) {
  rail.addEventListener('scroll', syncDots, { passive: true });
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      const slides = rail.querySelectorAll('.g-slide');
      if (slides[i]) rail.scrollTo({ left: slides[i].offsetLeft - 20, behavior: 'smooth' });
    });
  });
  let drag = false, sx = 0, sl = 0, vx = 0, lastX = 0, lastT = 0;
  rail.addEventListener('mousedown', e => {
    drag = true; sx = e.pageX - rail.offsetLeft; sl = rail.scrollLeft;
    lastX = e.pageX; lastT = Date.now(); vx = 0;
    rail.style.cursor = 'grabbing'; rail.style.scrollSnapType = 'none';
  });
  rail.addEventListener('mouseleave', () => stopDrag());
  rail.addEventListener('mouseup',    () => stopDrag());
  rail.addEventListener('mousemove',  e => {
    if (!drag) return;
    e.preventDefault();
    const now = Date.now(); const dt = now - lastT;
    if (dt > 0) vx = (e.pageX - lastX) / dt;
    lastX = e.pageX; lastT = now;
    rail.scrollLeft = sl - (e.pageX - rail.offsetLeft - sx) * 1.2;
  });
  function stopDrag() {
    if (!drag) return;
    drag = false; rail.style.cursor = 'grab'; rail.style.scrollSnapType = '';
    let v = -vx * 8;
    const step = () => { if (Math.abs(v) < .5) return; rail.scrollLeft += v; v *= .9; requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
}

/* ── Button ripple ── */
function addRipple(el) {
  el.addEventListener('click', function(e) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const r = document.createElement('span');
    r.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;left:${x}px;top:${y}px;background:rgba(255,255,255,.18);transform:scale(0);animation:rippleAnim .5s ease-out forwards;`;
    el.style.position = 'relative'; el.style.overflow = 'hidden';
    el.appendChild(r); setTimeout(() => r.remove(), 520);
  });
}
const rs = document.createElement('style');
rs.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0;}}';
document.head.appendChild(rs);
document.querySelectorAll('.btn, .tf-btn, .snav-btn').forEach(addRipple);

/* ── TestFlight buttons ── */
function handleTF(e) {
  if (e.currentTarget.getAttribute('href') === '#' || e.currentTarget.tagName === 'BUTTON') {
    e.preventDefault();
    alert('TestFlight 링크를 준비 중입니다.\n곧 업데이트됩니다! 🙏');
  }
}
const tfBtn  = document.getElementById('tfBtn');
const tfBtn2 = document.getElementById('tfBtn2');
if (tfBtn)  tfBtn.addEventListener('click', handleTF);
if (tfBtn2) tfBtn2.addEventListener('click', handleTF);

/* ── Video placeholder ── */
const videoPlay = document.getElementById('videoPlay');
if (videoPlay) videoPlay.addEventListener('click', () => alert('시연 영상을 준비 중입니다. 🎬'));

/* ── Beta form ── */
const betaForm = document.getElementById('betaForm');
const betaOk   = document.getElementById('betaOk');
if (betaForm) {
  betaForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('betaEmail').value;
    betaForm.style.display = 'none';
    if (betaOk) betaOk.style.display = 'block';
    console.log('Beta signup:', email);
  });
}

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 62, behavior: 'smooth' });
    }
  });
});

/* ── Step card cursor highlight ── */
document.querySelectorAll('.step-row').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(12,184,122,.04) 0%, transparent 70%), var(--surface)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});
