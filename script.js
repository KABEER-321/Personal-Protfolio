/* ================= ON LOAD ACTIONS ================= */
window.addEventListener('load', () => {
    // 1. Hide Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.visibility = 'hidden', 600);
    }, 1500);

    // 2. Initialize AOS Animations
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 20,
            disable: 'mobile' // Disable scroll animations on mobile devices for smooth performance
        });
    }


    // 4. Fetch GitHub Repos
    fetchGitHubRepos();
});

/* ================= SCROLL PROGRESS BAR ================= */
window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById('scroll-bar');
    const scrollTotal = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTotal / height) * 100;
    scrollBar.style.width = scrollPercentage + '%';
});

/* ================= HEADER BACKGROUND & NAV ================= */
function scrollHeader() {
    const header = document.getElementById('header');
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close'),
      navLinks = document.querySelectorAll('.nav__link');

if(navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if(navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
navLinks.forEach(n => n.addEventListener('click', () => navMenu.classList.remove('show-menu')));

/* ================= SCROLL ACTIVE LINK ================= */
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 100,
              sectionId = current.getAttribute('id');
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/* ================= TYPING EFFECT ================= */
const typingText = document.querySelector('.typing-text');
const words = ["Full-Stack Developer", "Python Developer", "AI Enthusiast", "Open Source Learner"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if(!typingText) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}
setTimeout(typeEffect, 2000);

/* ================= ANIMATE SKILL BARS ON SCROLL ================= */
const skillSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.skill__percentage');

function showSkills() {
    if(!skillSection) return;
    const sectionPos = skillSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if(sectionPos < screenPos) {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
        window.removeEventListener('scroll', showSkills); // Trigger only once
    }
}
window.addEventListener('scroll', showSkills);

/* ================= RESUME MODAL ================= */
const modal = document.getElementById('resume-modal');
const openBtn = document.getElementById('open-resume');
const openBtnFooter = document.querySelector('.open-resume-footer');
const closeBtn = document.querySelector('.close-modal');

function openModal(e) {
    if(e) e.preventDefault();
    modal.classList.add('show-modal');
}

function closeModal() {
    if(modal) modal.classList.remove('show-modal');
}

if(openBtn) openBtn.addEventListener('click', openModal);
if(openBtnFooter) openBtnFooter.addEventListener('click', openModal);
if(closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if(modal && e.target == modal) closeModal();
});

/* ================= CERTIFICATE MODAL ================= */
const certModal = document.getElementById('cert-modal');
const openCertBtns = document.querySelectorAll('.open-cert-btn');
const closeCertBtn = certModal ? certModal.querySelector('.close-modal') : null;
const certIframe = document.getElementById('cert-iframe');
const certFallback = document.getElementById('cert-fallback');
const certTitle = document.getElementById('cert-modal-title');
const downloadCertBtn = document.getElementById('download-cert');

function openCertModal(e) {
    if (e) e.preventDefault();
    if (!certModal || !certIframe || !certFallback || !certTitle || !downloadCertBtn) return;
    
    const btn = e.currentTarget;
    const certPath = btn.getAttribute('data-cert');
    const title = btn.getAttribute('data-title');
    
    certTitle.textContent = title;
    downloadCertBtn.href = certPath;
    
    // Check if browser supports inline PDF viewing
    const supportsPdf = (typeof navigator.pdfViewerEnabled !== 'undefined') ? navigator.pdfViewerEnabled : !/Mobi|Android/i.test(navigator.userAgent);
    
    if (supportsPdf) {
        certIframe.src = certPath;
        certIframe.style.display = 'block';
        certFallback.style.display = 'none';
    } else {
        certIframe.src = '';
        certIframe.style.display = 'none';
        certFallback.style.display = 'block';
    }
    
    certModal.classList.add('show-modal');
}

function closeCertModal() {
    if (certModal) certModal.classList.remove('show-modal');
    if (certIframe) certIframe.src = '';
}

if (openCertBtns.length > 0) {
    openCertBtns.forEach(btn => {
        btn.addEventListener('click', openCertModal);
    });
}

if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertModal);

window.addEventListener('click', (e) => {
    if (certModal && e.target == certModal) closeCertModal();
});

// Support Escape key to close modals
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCertModal();
    }
});

/* ================= PROJECT FILTERING ================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        // Add active class to clicked button
        btn.classList.add('active-filter');

        const filterValue = btn.getAttribute('data-filter');

        let visibleCount = 0;

        projectItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            
            if(filterValue === 'all' || categories.includes(filterValue)) {
                item.classList.remove('hidden-project');
                visibleCount++;
            } else {
                item.classList.add('hidden-project');
            }
        });
    });
});

/* ================= FETCH GITHUB REPOS ================= */
async function fetchGitHubRepos() {
    const container = document.getElementById('repo-container');
    if(!container) return;

    try {
        const response = await fetch('https://api.github.com/users/KABEER-321/repos?sort=updated&per_page=6');
        if(!response.ok) throw new Error('Network response was not ok');
        
        const repos = await response.json();
        container.innerHTML = ''; // Clear loading text

        repos.forEach(repo => {
            if(repo.fork) return; // Skip forks if desired
            
            const repoEl = document.createElement('div');
            repoEl.classList.add('repo-card', 'glass-card', 'hover-glow');
            repoEl.innerHTML = `
                <h4 class="repo-title">
                    <i class="far fa-folder-open"></i> 
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </h4>
                <p class="repo-desc">${repo.description || 'No description available.'}</p>
                <div class="repo-stats">
                    ${repo.language ? `<span><i class="fas fa-circle" style="color: var(--first-color); font-size: 8px;"></i> ${repo.language}</span>` : ''}
                    <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            `;
            container.appendChild(repoEl);
        });
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = `<div class="text-center w-100">Unable to load repositories at this time.</div>`;
    }
}

/* ================= CONTACT FORM VALIDATION & SUBMISSION ================= */
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-project').value.trim();
        const honey = contactForm.querySelector('input[name="_honey"]').value;

        // Simple Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            formMessage.textContent = 'Please enter a valid email address.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        if(name.length < 2 || message.length < 5 || subject.length < 2) {
            formMessage.textContent = 'Please fill out all fields properly.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        // Send to FormSubmit via AJAX
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
            const response = await fetch('https://formsubmit.co/ajax/mdkabeermm786786@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _honey: honey,
                    _captcha: false
                })
            });

            const result = await response.json();

            if(response.ok && result.success) {
                formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Server error');
            }
        } catch (error) {
            console.error('FormSubmit Error:', error);
            formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;

            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
}

/* ================= SCROLL UP & YEAR ================= */
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    if(this.scrollY >= 350) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

const yearEl = document.getElementById('current-year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= PARTICLES JS CONFIGURATION ================= */
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 30, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#00f2fe" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.2, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#00f2fe", "opacity": 0.1, "width": 1 },
            "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                "push": { "particles_nb": 3 }
            }
        },
        "retina_detect": true
    });
}

/* ================= LIGHTBOX FUNCTIONALITY ================= */
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const screenshotWrappers = document.querySelectorAll('.screenshot-img__wrapper');
    const screenshotImgs = document.querySelectorAll('.screenshot-img');

    if (lightbox && lightboxImg && closeBtn) {
        // Helper function to show lightbox
        const openLightbox = (img, parent) => {
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
            
            if (parent) {
                const title = parent.querySelector('h3') ? parent.querySelector('h3').textContent : '';
                const desc = parent.querySelector('p') ? parent.querySelector('p').textContent : '';
                lightboxCaption.innerHTML = `<strong>${title}</strong><br>${desc}`;
            } else {
                lightboxCaption.textContent = img.alt || '';
            }
            
            setTimeout(() => lightbox.classList.add('show'), 50);
        };

        // Attach click handlers to wrappers if they exist, else directly to images
        if (screenshotWrappers.length > 0) {
            screenshotWrappers.forEach(wrapper => {
                wrapper.style.cursor = 'pointer';
                wrapper.addEventListener('click', () => {
                    const img = wrapper.querySelector('.screenshot-img');
                    if (img) {
                        openLightbox(img, wrapper.closest('.screenshot-card'));
                    }
                });
            });
        } else {
            screenshotImgs.forEach(img => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    openLightbox(img, img.closest('.screenshot-card'));
                });
            });
        }

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === closeBtn) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }
});

/* ================= CUSTOM CURSOR IMPLEMENTATION ================= */
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        let cursorVisible = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorVisible) {
                cursorDot.style.opacity = '1';
                cursorOutline.style.opacity = '1';
                cursorVisible = true;
            }
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth trailing effect using requestAnimationFrame
        const animateOutline = () => {
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);

        // Hover animations
        const updateInteractiveHover = () => {
            const targets = document.querySelectorAll('a, button, .btn, .open-cert-btn, .screenshot-img__wrapper, .filter-btn, .projects__card');
            targets.forEach(target => {
                target.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.backgroundColor = 'rgba(0, 242, 254, 0.05)';
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
                });
                target.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.backgroundColor = 'transparent';
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        };
        
        updateInteractiveHover();
        
        // Re-run hover binds when project filtering happens
        const filterBtnsList = document.querySelectorAll('.filter-btn');
        filterBtnsList.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(updateInteractiveHover, 100);
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
            cursorVisible = false;
        });
    }
});
