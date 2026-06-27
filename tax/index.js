document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // NAVIGATION & MOBILE MENU
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle navbar background on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('show');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  
  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMobileMenu();
      
      // Update active state manually on click
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ==========================================
  // SCROLLSPY (Active section highlighting)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  const scrollspy = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for fixed navbar
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
        document.querySelector(`.mobile-nav a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
        document.querySelector(`.mobile-nav a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  };
  
  window.addEventListener('scroll', scrollspy);

  // ==========================================
  // SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // NUMBER COUNT-UP ANIMATION
  // ==========================================
  const countUpElements = document.querySelectorAll('.count-up');
  
  const animateCountUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);
      
      el.textContent = currentVal + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target + suffix;
      }
    };
    
    requestAnimationFrame(updateCount);
  };
  
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  countUpElements.forEach(el => countObserver.observe(el));

  // ==========================================
  // TESTIMONIALS SLIDER
  // ==========================================
  const slider = document.querySelector('.testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    };
    
    const goToSlide = (slideIndex) => {
      currentSlide = (slideIndex + totalSlides) % totalSlides;
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
      resetAutoPlay();
    };
    
    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };
    
    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto play
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000);
    };
    
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };
    
    startAutoPlay();
    
    // Touch Navigation for Mobile
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) { // Threshold
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
  }

  // ==========================================
  // CONTACT FORM VALIDATION & INTERACTION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('success-toast');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple client-side validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      const service = document.getElementById('service').value;
      
      if (!name || !email || !phone || !message) {
        alert('Please fill out all fields.');
        return;
      }
      
      // In a real application, you would send this to a backend server.
      console.log('Form Submitted successfully:', { name, email, phone, service, message });
      
      // Trigger Toast notification
      showToast();
      
      // Reset the form
      contactForm.reset();
    });
  }
  
  const showToast = () => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };
});
