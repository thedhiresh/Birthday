document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ambient petals ---------- */
  if (!reduceMotion) {
    const ambient = document.getElementById('ambient');
    const emojis = ['🌸', '💮', '🤍', '🎈', '✨'];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (10 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      p.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
      ambient.appendChild(p);
    }
  }

  /* ---------- hero balloons + sparkles ---------- */
  const hero = document.getElementById('hero');
  const balloonColors = ['#FFD1DC', '#D4F1F4', '#E8D5F2', '#FFF5BA'];
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = (5 + Math.random() * 90) + '%';
    b.style.background = balloonColors[i % balloonColors.length];
    b.style.borderTopColor = balloonColors[i % balloonColors.length];
    b.style.animationDuration = (10 + Math.random() * 8) + 's';
    b.style.animationDelay = (Math.random() * 10) + 's';
    hero.appendChild(b);
  }
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    const size = 3 + Math.random() * 4;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDuration = (1.6 + Math.random() * 2.4) + 's';
    s.style.animationDelay = (Math.random() * 3) + 's';
    hero.appendChild(s);
  }

  /* ---------- wonderful slider ---------- */
  const wonderfulTrack = document.getElementById('wonderfulTrack');
  const prevButton = document.getElementById('sliderPrev');
  const nextButton = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (wonderfulTrack && prevButton && nextButton && dotsContainer) {
    const cards = [...wonderfulTrack.querySelectorAll('.wonderful-card')];
    let currentIndex = 0;

    const updateSlider = () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      wonderfulTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const createDot = (index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    };

    cards.forEach((_, index) => createDot(index));

    const moveSlide = (direction) => {
      currentIndex = (currentIndex + direction + cards.length) % cards.length;
      updateSlider();
    };

    prevButton.addEventListener('click', () => moveSlide(-1));
    nextButton.addEventListener('click', () => moveSlide(1));
    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  /* ---------- music toggle ---------- */
  const musicBtn = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  let musicOn = false;
  musicBtn.addEventListener('click', () => {
    if (!bgMusic.querySelector('source').src) {
      musicBtn.textContent = '🎵';
      musicBtn.title = 'Add a song file to enable music';
      return;
    }
    musicOn = !musicOn;
    if (musicOn) {
      bgMusic.play().catch(() => {});
      musicBtn.classList.add('spinning');
      musicBtn.textContent = '🔊';
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('spinning');
      musicBtn.textContent = '🎵';
    }
  });

  /* ---------- gift box ---------- */
  const gift = document.getElementById('giftBox');
  const panels = document.getElementById('surprisePanels');
  const giftHint = document.getElementById('giftHint');
  let giftOpened = false;

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;
    gift.classList.add('open');
    panels.classList.add('show');
    giftHint.textContent = 'enjoy ✦';
    sizeScratchCanvas();
  }

  gift.addEventListener('click', openGift);
  gift.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGift();
    }
  });

  /* ---------- scratch card ---------- */
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');

  function sizeScratchCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#e8c15a');
    grad.addColorStop(1, '#f4d67e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '600 14px Poppins, sans-serif';
    ctx.fillStyle = '#2C3E50';
    ctx.textAlign = 'center';
    ctx.fillText('✂ scratch me ✦', rect.width / 2, rect.height / 2);
  }

  let scratching = false;

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  function getPos(e, rect) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  canvas.addEventListener('pointerdown', e => {
    scratching = true;
    const r = canvas.getBoundingClientRect();
    const p = getPos(e, r);
    scratchAt(p.x, p.y);
  });
  window.addEventListener('pointerup', () => scratching = false);
  canvas.addEventListener('pointermove', e => {
    if (!scratching) return;
    const r = canvas.getBoundingClientRect();
    const p = getPos(e, r);
    scratchAt(p.x, p.y);
  });

  /* ---------- cake candles ---------- */
  const candleEls = document.querySelectorAll('.candle');
  const cakeMsg = document.getElementById('cakeMsg');
  candleEls.forEach(c => {
    c.addEventListener('click', () => {
      c.classList.add('out');
      const allOut = [...candleEls].every(el => el.classList.contains('out'));
      if (allOut) {
        cakeMsg.textContent = 'Your wish has been sent to the universe 🌠';
        fireConfetti(0.6);
      }
    });
  });

  /* ---------- voice / video button ---------- */
  const voiceBtn = document.getElementById('voiceBtn');
  const voiceNote = document.getElementById('voiceNote');
  const voiceStatus = document.getElementById('voiceStatus');
  let voicePlaying = false;

  voiceBtn.addEventListener('click', () => {
    if (!voiceNote.querySelector('source').src) {
      voiceStatus.textContent = 'Add your recorded message file to hear this 🎙️';
      return;
    }
    if (!voicePlaying) {
      voiceNote.play();
      voiceBtn.textContent = '❚❚';
      voiceStatus.textContent = 'Playing…';
    } else {
      voiceNote.pause();
      voiceBtn.textContent = '▶';
      voiceStatus.textContent = 'Paused';
    }
    voicePlaying = !voicePlaying;
  });

  voiceNote.addEventListener('ended', () => {
    voicePlaying = false;
    voiceBtn.textContent = '▶';
    voiceStatus.textContent = 'Press play when you\'re ready';
  });

  /* ---------- confetti on final section ---------- */
  function fireConfetti(power) {
    if (typeof confetti !== 'function') return;
    confetti({ particleCount: 120 * power, spread: 90, origin: { y: 0.6 }, colors: ['#E8D5F2', '#D4F1F4', '#FFD1DC', '#FFF5BA'] });
  }

  const final = document.getElementById('final');
  let finalFired = false;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !finalFired) {
        finalFired = true;
        fireConfetti(1);
        setTimeout(() => fireConfetti(0.6), 400);
      }
    });
  }, { threshold: 0.5 });
  io.observe(final);

  /* ---------- send a wish back ---------- */
  const wishForm = document.getElementById('wishForm');
  wishForm.addEventListener('submit', e => {
    e.preventDefault();
    wishForm.style.display = 'none';
    document.getElementById('wishSent').style.display = 'block';
    fireConfetti(0.5);
  });
});
