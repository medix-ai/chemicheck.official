/* ChemiCheck Landing · script.js  v5 */

/* ── Nav scroll shadow ── */
const snav = document.getElementById('snav');
if (snav) {
  window.addEventListener('scroll', () => {
    snav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

/* ── Sticky bottom CTA ── */
const stickyCta = document.getElementById('stickyCta');
const heroSec   = document.getElementById('heroSec');
if (stickyCta && heroSec) {
  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(e => stickyCta.classList.toggle('show', !e.isIntersecting));
  }, { threshold: 0.1 });
  heroObs.observe(heroSec);
}

/* ── Scroll fade-in ── */
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -16px 0px' });
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
  const map = {
    427000000: '4.27억',
    565000:    '56.5만',
    13000000:  '1,300만',
    7189:      '7,189',
    214815:    '214,815',
    5723:      '5,723',
    3534:      '3,534',
  };
  return map[t] || t.toLocaleString('ko-KR');
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
document.querySelectorAll('.stat-num[data-target], .data-big[data-target]').forEach(el => cntObs.observe(el));

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
    el.appendChild(r); setTimeout(() => r.remove(), 520);
  });
}
document.querySelectorAll('.btn, .snav-btn').forEach(addRipple);

/* ── TestFlight buttons ── */
function handleTF(e) {
  const href = this.getAttribute('href');
  if (!href || href === '#') {
    e.preventDefault();
    alert('TestFlight 링크를 준비 중입니다.\n곧 업데이트됩니다! 🙏');
  }
}
document.querySelectorAll('[data-tf]').forEach(el => el.addEventListener('click', handleTF));

/* ── Video play buttons ── */
document.querySelectorAll('.video-play').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const labels = ['60초 핵심 시연', '3분 전체 흐름', '5분 발표 영상'];
    alert(`${labels[i] || '시연 영상'}을 준비 중입니다.\n최종 버전 영상이 곧 업로드됩니다! 🎬`);
  });
});

/* ── Slide download ── */
document.querySelectorAll('.slide-dl-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const href = btn.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      alert('발표자료를 준비 중입니다.\n심사 전날까지 업로드됩니다! 📊');
    }
  });
});

/* ── Beta form ── */
const betaForm = document.getElementById('betaForm');
const betaOk   = document.getElementById('betaOk');
if (betaForm) {
  betaForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = betaForm.querySelector('#betaEmail').value;
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
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(93,187,148,.04) 0%, transparent 70%), var(--surface)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

/* ── Value card hover glow ── */
document.querySelectorAll('.value-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(74,107,156,.04) 0%, transparent 65%), var(--surface)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});
