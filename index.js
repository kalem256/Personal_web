// ── Custom cursor ──────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.opacity = '0.8'; });
      el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)';   ring.style.opacity = '0.5'; });
    });

    // ── Sticky nav ────────────────────────────────────────────────────────────
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── Scroll reveal ─────────────────────────────────────────────────────────
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── Skill bars ────────────────────────────────────────────────────────────
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skills-layout').forEach(el => barObs.observe(el));

    // ── Contact form with Formspree ───────────────────────────────────────────
    // ➡  STEP 1: Go to https://formspree.io → create a free account
    // ➡  STEP 2: Click "New Form", name it "Portfolio Contact"
    // ➡  STEP 3: Copy your endpoint and paste it below
    const FORMSPREE = 'https://formspree.io/f/xdabdywy';

    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('cf-submit');
    const successEl = document.getElementById('cf-success');
    const failEl    = document.getElementById('cf-fail');

    function validate(id, errId, check) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      const ok  = check(el.value);
      el.classList.toggle('err', !ok);
      if (err) err.style.display = ok ? 'none' : 'block';
      return ok;
    }

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

    // Clear errors on input
    ['cf-name','cf-email','cf-msg'].forEach(id => {
      document.getElementById(id).addEventListener('input', function() {
        this.classList.remove('err');
        const err = document.getElementById('err-' + id.replace('cf-',''));
        if (err) err.style.display = 'none';
      });
    });

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const ok =
        validate('cf-name',  'err-name',  v => v.trim().length > 1) &
        validate('cf-email', 'err-email', v => validEmail(v))        &
        validate('cf-msg',   'err-msg',   v => v.trim().length > 5);

      if (!ok) return;

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      successEl.style.display = 'none';
      failEl.style.display    = 'none';

      try {
        const res = await fetch(FORMSPREE, {
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          document.getElementById('cf-type').classList.remove('chosen');
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          failEl.style.display = 'block';
        }
      } catch {
        failEl.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });