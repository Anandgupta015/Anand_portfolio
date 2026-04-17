/* =============================================
   ANAND GUPTA — PORTFOLIO JAVASCRIPT
   Features: Hamburger menu, smooth scroll,
   active nav, scroll reveal, skill bars,
   form validation, dark/light toggle
   ============================================= */

(function () {
  'use strict';

  /* ==============================
     ELEMENTS
  ============================== */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle.querySelector('.theme-icon');
  const contactForm = document.getElementById('contactForm');

  /* ==============================
     MOBILE HAMBURGER MENU
  ============================== */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on nav-link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  /* ==============================
     NAVBAR SCROLL SHADOW
  ============================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==============================
     ACTIVE NAV LINK ON SCROLL
  ============================== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + (window.innerHeight * 0.35);
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < bottom) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run on load

  /* ==============================
     SCROLL REVEAL
  ============================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ==============================
     SKILL BAR ANIMATION
  ============================== */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width + '%';
        // Small delay so reveal animation plays first
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ==============================
     DARK / LIGHT THEME TOGGLE
  ============================== */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
    localStorage.setItem('ag-theme', theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('ag-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ==============================
     CONTACT FORM VALIDATION
  ============================== */
  if (contactForm) {
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError    = document.getElementById('nameError');
    const emailError   = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess  = document.getElementById('formSuccess');

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function clearErrors() {
      [nameInput, emailInput, messageInput].forEach(el => el.classList.remove('error'));
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formSuccess.textContent = '';
    }

    function validateField(input, errorEl, condition, message) {
      if (!condition) {
        input.classList.add('error');
        errorEl.textContent = message;
        return false;
      }
      return true;
    }

    // Real-time feedback on blur
    nameInput.addEventListener('blur', () => {
      if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('error');
        nameError.textContent = 'Please enter your name.';
      } else {
        nameInput.classList.remove('error');
        nameError.textContent = '';
      }
    });

    emailInput.addEventListener('blur', () => {
      if (!isValidEmail(emailInput.value)) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter a valid email address.';
      } else {
        emailInput.classList.remove('error');
        emailError.textContent = '';
      }
    });

    messageInput.addEventListener('blur', () => {
      if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        messageError.textContent = 'Message must be at least 10 characters.';
      } else {
        messageInput.classList.remove('error');
        messageError.textContent = '';
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const nameVal    = nameInput.value.trim();
      const emailVal   = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      let valid = true;

      valid = validateField(nameInput, nameError, nameVal.length >= 2, 'Please enter your name (at least 2 characters).') && valid;
      valid = validateField(emailInput, emailError, isValidEmail(emailVal), 'Please enter a valid email address.') && valid;
      valid = validateField(messageInput, messageError, messageVal.length >= 10, 'Message must be at least 10 characters.') && valid;

      if (!valid) return;

      // Simulate send (no backend)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';
        setTimeout(() => {
          formSuccess.textContent = '';
        }, 5000);
      }, 1200);
    });
  }

  /* ==============================
     SMOOTH SCROLL POLYFILL
     (for browsers without CSS support)
  ============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
