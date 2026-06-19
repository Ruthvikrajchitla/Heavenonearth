document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Navigation & Header scrolled effect
    // ==========================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    // ==========================================
    // 2. Active Section Highlighting in Navbar
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightNav = () => {
        let scrollPosition = window.scrollY + 120; // Offset for header height
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // ==========================================
    // 3. Mobile Navigation Menu Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    mobileToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealOnScroll.observe(el));

    // ==========================================
    // 5. Gallery Filtering
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to this
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                
                // Add fade-out state
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === itemType) {
                        item.style.display = 'block';
                        // Add fade-in state
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // ==========================================
    // 6. Lightbox Modal logic (Photos & Videos)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let activeGalleryItems = [];
    let currentIdx = 0;
    
    // Open Lightbox
    const openLightbox = (item) => {
        // Collect current active elements in grid (visible ones)
        activeGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        currentIdx = activeGalleryItems.indexOf(item);
        
        updateLightboxContent();
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    };
    
    // Update Lightbox Display
    const updateLightboxContent = () => {
        const item = activeGalleryItems[currentIdx];
        if (!item) return;
        
        const type = item.getAttribute('data-type');
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');
        
        lightboxCaption.textContent = caption;
        
        if (type === 'photo') {
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.src = '';
            
            lightboxImg.style.display = 'block';
            lightboxImg.src = src;
        } else if (type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxImg.src = '';
            
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = src;
            lightboxVideo.load();
            lightboxVideo.play();
        }
    };
    
    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImg.src = '';
    };
    
    // Navigate Lightbox
    const prevMedia = (e) => {
        e.stopPropagation();
        currentIdx = (currentIdx === 0) ? activeGalleryItems.length - 1 : currentIdx - 1;
        updateLightboxContent();
    };
    
    const nextMedia = (e) => {
        e.stopPropagation();
        currentIdx = (currentIdx === activeGalleryItems.length - 1) ? 0 : currentIdx + 1;
        updateLightboxContent();
    };
    
    // Add Click listeners to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });
    
    // Lightbox Controls listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevMedia);
    lightboxNext.addEventListener('click', nextMedia);
    
    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Key bindings (Escape, Arrow Left, Arrow Right)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentIdx = (currentIdx === 0) ? activeGalleryItems.length - 1 : currentIdx - 1;
            updateLightboxContent();
        } else if (e.key === 'ArrowRight') {
            currentIdx = (currentIdx === activeGalleryItems.length - 1) ? 0 : currentIdx + 1;
            updateLightboxContent();
        }
    });

    // ==========================================
    // 7. Contact Form Handling
    // ==========================================
    const bookingForm = document.getElementById('booking-form');
    const formStatus = document.getElementById('form-status');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading status
            formStatus.className = 'form-message';
            formStatus.textContent = 'Sending your booking inquiry. Please wait...';
            formStatus.style.display = 'block';
            
            const submitBtn = bookingForm.querySelector('.form-submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Mock network call
            setTimeout(() => {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                // Show success status
                formStatus.classList.add('success');
                formStatus.innerHTML = `<strong>Success!</strong> Thank you for reaching out to Unusual Worship. Our ministry coordinator will contact you shortly to confirm dates and details. God bless you!`;
                
                // Reset form
                bookingForm.reset();
                
                // Fade out message after 8 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.style.opacity = '1';
                    }, 500);
                }, 8000);
                
            }, 1800);
        });
    }

    // ==========================================
    // 8. Background Video Autoplay Optimization
    // ==========================================
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Attempt to play on user interaction if browser blocked it
        const forcePlayVideo = () => {
            if (heroVideo.paused) {
                heroVideo.play().catch(err => {
                    console.log("Autoplay was prevented, retrying on action...", err);
                });
            }
            document.removeEventListener('click', forcePlayVideo);
            document.removeEventListener('touchstart', forcePlayVideo);
        };
        document.addEventListener('click', forcePlayVideo);
        document.addEventListener('touchstart', forcePlayVideo);
    }
});
