/**
 * NEXORA - College Technology Club
 * Main JavaScript Application Script
 * Features: Dynamic API integration, Canvas Particles, Animated Counters, Lightbox, Modals, Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticleCanvas();
  initCounterAnimation();
  initScrollReveal();
  initEventsModule();
  initRegistrationModal();
  initContactForm();
  initGalleryLightbox();
  initBackToTop();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect for navbar glass darkening
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      } );
    });
  }

  // Active link highlighter based on current URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. INTERACTIVE PARTICLES CANVAS (Hero Background)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let width, height;

  function setDimensions() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  setDimensions();
  window.addEventListener('resize', setDimensions);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(139, 92, 246, 0.7)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  particlesArray = Array.from({ length: particleCount }, () => new Particle());

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.25;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS (Intersection Observer)
   ========================================================================== */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '+';
        let count = 0;
        const duration = 2000;
        const stepTime = 30;
        const increment = targetValue / (duration / stepTime);

        const counter = setInterval(() => {
          count += increment;
          if (count >= targetValue) {
            target.textContent = `${targetValue}${suffix}`;
            clearInterval(counter);
          } else {
            target.textContent = `${Math.floor(count)}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach((stat) => observer.observe(stat));
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   5. DYNAMIC EVENTS MODULE (Fetch from Backend REST API)
   ========================================================================== */
let allFetchedEvents = [];

async function initEventsModule() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;

  // Show skeleton loading placeholders
  eventsContainer.innerHTML = Array(3)
    .fill(0)
    .map(
      () => `
      <div class="event-skeleton"></div>
    `
    )
    .join('');

  try {
    const response = await fetch('/api/events');
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      allFetchedEvents = result.data;
      renderEvents(allFetchedEvents);
      setupEventFilters();
    } else {
      eventsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary);">No events found currently. Stay tuned for upcoming announcements!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching events from API:', error);
    eventsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; border: var(--border-glass); border-radius: var(--radius-lg);">
        <p style="color: var(--accent-pink); margin-bottom: 12px;"><i class="fas fa-exclamation-triangle"></i> Unable to load events from backend server.</p>
        <button class="btn btn-secondary btn-sm" onclick="initEventsModule()"><i class="fas fa-redo"></i> Retry Loading</button>
      </div>
    `;
  }
}

function renderEvents(eventsToRender) {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;

  if (eventsToRender.length === 0) {
    eventsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fas fa-calendar-times" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 16px;"></i>
        <p style="color: var(--text-secondary); font-size: 1.1rem;">No events match your current filter or search criteria.</p>
      </div>
    `;
    return;
  }

  eventsContainer.innerHTML = eventsToRender
    .map(
      (ev) => `
    <div class="event-card reveal active" data-category="${ev.category || 'General'}">
      <div class="event-image-wrap">
        <img src="${ev.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(ev.title)}" class="event-image" loading="lazy" />
        <span class="event-badge">${escapeHtml(ev.category || 'General')}</span>
      </div>
      <div class="event-body">
        <div>
          <div class="event-meta">
            <span><i class="far fa-calendar-alt"></i> ${escapeHtml(ev.date)}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location || 'Tech Lab')}</span>
          </div>
          <h3 class="event-title">${escapeHtml(ev.title)}</h3>
          <p class="event-desc">${escapeHtml(ev.description)}</p>
        </div>
        <div class="event-footer">
          <span class="event-seats"><i class="fas fa-users"></i> ${ev.seatsLeft || 50} Seats Open</span>
          <button class="btn btn-primary btn-sm register-event-btn" data-event-title="${escapeHtml(ev.title)}">
            Register <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  // Attach event listener to all dynamic register buttons
  document.querySelectorAll('.register-event-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventTitle = btn.getAttribute('data-event-title');
      openRegistrationModal(eventTitle);
    });
  });
}

function setupEventFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('event-search');

  function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allFetchedEvents.filter((ev) => {
      const matchesCategory = activeFilter === 'all' || (ev.category && ev.category.toLowerCase() === activeFilter.toLowerCase());
      const matchesSearch =
        ev.title.toLowerCase().includes(searchQuery) ||
        ev.description.toLowerCase().includes(searchQuery) ||
        (ev.location && ev.location.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    renderEvents(filtered);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

/* ==========================================================================
   6. EVENT REGISTRATION MODAL & SUBMISSION
   ========================================================================== */
function initRegistrationModal() {
  const modalOverlay = document.getElementById('registration-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const regForm = document.getElementById('event-registration-form');

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Handle registration form submit
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = regForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const event = document.getElementById('reg-event').value.trim();
      const year = document.getElementById('reg-year')?.value || '1st Year';
      const department = document.getElementById('reg-dept')?.value || 'CSE';

      if (!name || !email || !event) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, event, year, department })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast('Registration Successful! Check your email for event details.', 'success');
          regForm.reset();
          modalOverlay?.classList.remove('active');
        } else {
          showToast(result.message || 'Registration failed. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Registration API Error:', err);
        showToast('Network error during registration. Please verify server connection.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

function openRegistrationModal(eventTitle = '') {
  const modalOverlay = document.getElementById('registration-modal');
  const eventInput = document.getElementById('reg-event');

  if (modalOverlay) {
    if (eventInput && eventTitle) {
      eventInput.value = eventTitle;
    }
    modalOverlay.classList.add('active');
  }
}

// Expose openRegistrationModal globally for inline onclick triggers
window.openRegistrationModal = openRegistrationModal;

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject')?.value.trim() || 'General Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please provide your name, email, and message.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Message sent successfully! NEXORA team will reach out soon.', 'success');
        contactForm.reset();
      } else {
        showToast(result.message || 'Failed to send message. Please retry.', 'error');
      }
    } catch (err) {
      console.error('Contact API Error:', err);
      showToast('Error sending message. Check server status.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ==========================================================================
   8. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || 'NEXORA Club Moment';
      const tag = item.querySelector('.gallery-tag')?.textContent || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${escapeHtml(title)}</strong> ${tag ? `— <span style="color: var(--primary-cyan);">${escapeHtml(tag)}</span>` : ''}`;
        }
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-message">${escapeHtml(message)}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger smooth entrance animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

// Utility to escape HTML and prevent XSS injection
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
