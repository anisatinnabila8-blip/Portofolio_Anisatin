/**
 * script.js — Portofolio Rizky Pratama
 * Fungsi: Navbar scroll, hamburger menu, scroll reveal,
 *         animasi skill bar, counter animasi, validasi form.
 * Penulis: Frontend Developer
 * Versi  : 1.0.0
 */

'use strict';

/* =============================================================
   UTILITAS: Tunggu DOM selesai dimuat sebelum menjalankan skrip
============================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. NAVBAR — Tambah kelas .scrolled saat user men-scroll
     Efek: shadow + border muncul agar navbar tidak "melayang"
  ────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    // Tambah kelas 'scrolled' jika posisi scroll > 20px
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Panggil sekali saat halaman pertama dimuat (jika sudah di-scroll)
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);


  /* ──────────────────────────────────────────────────────────
     2. HAMBURGER MENU — Toggle menu mobile saat ikon diklik
  ────────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    // Toggle kelas 'active' pada hamburger (animasi → X)
    hamburger.classList.toggle('active');
    // Toggle kelas 'open' pada menu (menampilkan / menyembunyikan)
    navMenu.classList.toggle('open');
  });

  // Tutup menu saat salah satu link diklik
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────────────────
     3. SMOOTH ACTIVE LINK — Highlight link sesuai section aktif
     Menggunakan IntersectionObserver untuk efisiensi
  ────────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Hapus kelas aktif dari semua link
        navLinks.forEach(link => link.style.color = '');
        // Beri warna aksen pada link yang sesuai
        const activeLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.style.color = 'var(--accent)';
      }
    });
  }, {
    threshold: 0.4,            // Aktif saat 40% section terlihat
    rootMargin: '-60px 0px 0px 0px'   // Offset untuk tinggi navbar
  });

  sections.forEach(section => sectionObserver.observe(section));


  /* ──────────────────────────────────────────────────────────
     4. SCROLL REVEAL — Elemen muncul dengan animasi saat di-scroll
     Menambahkan kelas .reveal ke elemen target, lalu mengobservasi
  ────────────────────────────────────────────────────────── */

  // Daftar selector elemen yang ingin dianimasikan
  const revealSelectors = [
    '.about-text',
    '.about-skills',
    '.skill-card',
    '.program-card',
    '.stat-item',
    '.contact-info',
    '.contact-form-wrap',
    '.programs-header',
  ];

  // Tambahkan kelas .reveal ke setiap elemen
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Tambah delay bertahap untuk elemen dalam grid (maks 6)
      const delayClass = `reveal-delay-${Math.min(i + 1, 6)}`;
      el.classList.add(delayClass);
    });
  });

  // Observer: tambah .visible saat elemen masuk viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Berhenti mengobservasi setelah elemen terlihat (optimasi)
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────────────────────────────
     5. SKILL BAR ANIMATION — Lebar bar diisi saat section About
        memasuki viewport
  ────────────────────────────────────────────────────────── */
  const skillSection = document.getElementById('about');
  let skillsAnimated = false;   // Flag agar hanya berjalan sekali

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;

        // Ambil semua elemen .skill-fill yang memiliki data-width
        document.querySelectorAll('.skill-fill').forEach(fill => {
          const targetWidth = fill.getAttribute('data-width') + '%';

          // Delay kecil agar animasi terasa natural
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 200);
        });

        skillObserver.unobserve(skillSection);
      }
    });
  }, { threshold: 0.3 });

  if (skillSection) skillObserver.observe(skillSection);


  /* ──────────────────────────────────────────────────────────
     6. COUNTER ANIMASI — Hitung dari 0 ke nilai target
        dengan easing smooth
  ────────────────────────────────────────────────────────── */
  const statsSection = document.getElementById('stats');
  let countersStarted = false;   // Flag agar hanya berjalan sekali

  /**
   * Fungsi animasi counter
   * @param {HTMLElement} el      - Element yang menampilkan angka
   * @param {number}      target  - Nilai akhir yang dituju
   * @param {number}      duration - Durasi animasi dalam ms
   */
  function animateCounter(el, target, duration = 2000) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing fungsi: easeOutExpo — lambat di akhir untuk kesan dramatis
      const eased = 1 - Math.pow(2, -10 * progress);

      // Bulatkan angka saat ini
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('id-ID');

      // Lanjutkan animasi hingga progress = 1
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    }

    requestAnimationFrame(update);
  }

  // Observer: jalankan counter saat section stats terlihat
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;

        document.querySelectorAll('.counter').forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          animateCounter(counter, target, 2200);
        });

        counterObserver.unobserve(statsSection);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) counterObserver.observe(statsSection);


  /* ──────────────────────────────────────────────────────────
     7. FORM VALIDASI & SUBMIT — Validasi input sebelum kirim
        dan simulasi pengiriman dengan loading state
  ────────────────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {

    /**
     * Aturan validasi per field
     * Setiap aturan memiliki: validator (fungsi), message (pesan error)
     */
    const validationRules = {
      name: [
        {
          validator: (v) => v.trim().length > 0,
          message: 'Nama tidak boleh kosong.'
        },
        {
          validator: (v) => v.trim().length >= 3,
          message: 'Nama minimal 3 karakter.'
        }
      ],
      email: [
        {
          validator: (v) => v.trim().length > 0,
          message: 'Email tidak boleh kosong.'
        },
        {
          validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: 'Format email tidak valid.'
        }
      ],
      subject: [
        {
          validator: (v) => v.trim().length > 0,
          message: 'Subjek tidak boleh kosong.'
        },
        {
          validator: (v) => v.trim().length >= 5,
          message: 'Subjek minimal 5 karakter.'
        }
      ],
      message: [
        {
          validator: (v) => v.trim().length > 0,
          message: 'Pesan tidak boleh kosong.'
        },
        {
          validator: (v) => v.trim().length >= 20,
          message: 'Pesan minimal 20 karakter.'
        }
      ]
    };

    /**
     * Validasi satu field berdasarkan aturannya
     * @param {string} fieldName - Nama field ('name', 'email', dst)
     * @returns {boolean} true jika valid
     */
    function validateField(fieldName) {
      const input    = document.getElementById(fieldName);
      const errorEl  = document.getElementById(`${fieldName}Error`);
      const rules    = validationRules[fieldName];
      const value    = input.value;

      // Cek setiap aturan secara berurutan
      for (const rule of rules) {
        if (!rule.validator(value)) {
          // Tampilkan error: kelas + pesan
          input.classList.add('error');
          errorEl.textContent = rule.message;
          return false;
        }
      }

      // Hapus error jika valid
      input.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }

    /**
     * Validasi seluruh form
     * @returns {boolean} true jika semua field valid
     */
    function validateForm() {
      const fields  = ['name', 'email', 'subject', 'message'];
      let   isValid = true;

      fields.forEach(field => {
        // Jalankan semua validasi; jangan pakai short-circuit agar
        // semua pesan error langsung muncul sekaligus
        if (!validateField(field)) isValid = false;
      });

      return isValid;
    }

    // Validasi real-time saat user mengetik (blur event)
    ['name', 'email', 'subject', 'message'].forEach(fieldName => {
      const input = document.getElementById(fieldName);

      // Validasi saat meninggalkan field
      input.addEventListener('blur', () => validateField(fieldName));

      // Hapus error saat user mulai mengetik kembali
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(fieldName);
        }
      });
    });

    // Handle submit form
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();   // Cegah reload halaman

      // Jalankan validasi penuh
      if (!validateForm()) return;

      // ── Loading state ──
      submitBtn.classList.add('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Mengirim...';
      submitBtn.querySelector('.btn-icon').textContent  = '⏳';

      /**
       * Simulasi pengiriman data (ganti dengan fetch() ke server nyata)
       * Contoh fetch ke API:
       *
       * const response = await fetch('/api/contact', {
       *   method : 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   body   : JSON.stringify({ name, email, subject, message })
       * });
       */
      await simulateDelay(1800);

      // ── Sukses ──
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Terkirim! ✓';
      submitBtn.querySelector('.btn-icon').textContent  = '';
      submitBtn.style.background = '#16a34a';

      // Tampilkan pesan sukses
      formSuccess.style.display = 'block';

      // Reset form setelah 3 detik
      setTimeout(() => {
        contactForm.reset();
        submitBtn.querySelector('.btn-text').textContent = 'Kirim Pesan';
        submitBtn.querySelector('.btn-icon').textContent  = '→';
        submitBtn.style.background = '';
        formSuccess.style.display  = 'none';
      }, 3000);
    });
  }

  /**
   * Helper: menunda eksekusi selama `ms` milidetik
   * @param {number} ms - Durasi jeda dalam milidetik
   * @returns {Promise}
   */
  function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  /* ──────────────────────────────────────────────────────────
     8. PROGRAM CARD — Efek hover dinamis pada kartu
        (tambahan micro-interaction)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Sedikit rotasi kecil yang terasa menyenangkan
      const index = parseInt(card.getAttribute('data-index'), 10);
      const rotate = index % 2 === 0 ? 0.5 : -0.5;
      card.style.transform = `translateY(-6px) rotate(${rotate}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ──────────────────────────────────────────────────────────
     9. BACK TO TOP — Kembali ke atas saat logo navbar diklik
        (sudah di-handle href="#hero", ini sebagai fallback)
  ────────────────────────────────────────────────────────── */
  document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ──────────────────────────────────────────────────────────
     10. KEYBOARD ACCESSIBILITY — Tutup menu mobile dengan Escape
  ────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });


  /* ──────────────────────────────────────────────────────────
     INISIALISASI SELESAI
  ────────────────────────────────────────────────────────── */
  console.log('%c🚀 Portofolio berhasil dimuat!', 'color:#1e5fb5;font-weight:bold;font-size:14px;');

}); // END DOMContentLoaded
