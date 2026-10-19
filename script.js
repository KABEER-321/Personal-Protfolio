/**
 * MOHAMMED KABEER — PERSONAL DEVELOPER PORTFOLIO
 * Modular Vanilla JavaScript (ES6+)
 * 
 * Modules:
 * 1. Mobile Navigation & Scroll Header
 * 2. Reading Progress Indicator
 * 3. Section Scrollspy
 * 4. Project Category Filtering
 * 5. GitHub Repositories REST Integration
 * 6. PDF Modals (Resume & Certifications with Mobile Fallback)
 * 7. FormSubmit AJAX Contact Form
 * 8. Screenshot Lightbox Modal
 * 9. Scroll to Top & Current Year
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVIGATION & SCROLL HEADER
       ========================================================================== */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Sticky Header Border & Elevation
    const handleScrollHeader = () => {
        if (!header) return;
        if (window.scrollY >= 40) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    };
    window.addEventListener('scroll', handleScrollHeader, { passive: true });

    // Mobile Menu Drawer Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    }

    const closeNavMenu = () => {
        if (!navMenu) return;
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    };

    if (navClose) {
        navClose.addEventListener('click', closeNavMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeNavMenu);
    });

    /* ==========================================================================
       2. READING PROGRESS INDICATOR
       ========================================================================== */
    const scrollBar = document.getElementById('scroll-bar');
    const updateScrollProgress = () => {
        if (!scrollBar) return;
        const scrollTotal = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrollPercentage = (scrollTotal / height) * 100;
            scrollBar.style.width = `${scrollPercentage}%`;
        }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /* ==========================================================================
       3. SECTION SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const handleScrollspy = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav__menu a[href*="#${sectionId}"]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active-link');
                } else {
                    targetLink.classList.remove('active-link');
                }
            }
        });
    };
    window.addEventListener('scroll', handleScrollspy, { passive: true });

    /* ==========================================================================
       4. PROJECT CATEGORY FILTERING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active-filter'));
                btn.classList.add('active-filter');

                const filterValue = btn.getAttribute('data-filter');

                projectItems.forEach(item => {
                    const categories = item.getAttribute('data-category') || '';
                    if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
                        item.classList.remove('hidden-project');
                    } else {
                        item.classList.add('hidden-project');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       5. GITHUB REPOSITORIES REST INTEGRATION
       ========================================================================== */
    const fetchGitHubRepos = async () => {
        const repoContainer = document.getElementById('repo-container');
        if (!repoContainer) return;

        try {
            const response = await fetch('https://api.github.com/users/KABEER-321/repos?sort=updated&per_page=6');
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

            const repos = await response.json();
            repoContainer.innerHTML = '';

            const validRepos = repos.filter(repo => !repo.fork);

            if (validRepos.length === 0) {
                repoContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: var(--text-sm);">No public repositories found.</div>`;
                return;
            }

            validRepos.forEach(repo => {
                const item = document.createElement('div');
                item.className = 'repo-item';

                const topDiv = document.createElement('div');
                const h4 = document.createElement('h4');
                h4.className = 'repo-item-title';
                
                const icon = document.createElement('i');
                icon.className = 'far fa-folder-open';
                h4.appendChild(icon);

                const a = document.createElement('a');
                a.href = repo.html_url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = repo.name;
                h4.appendChild(document.createTextNode(' '));
                h4.appendChild(a);

                const desc = document.createElement('p');
                desc.className = 'repo-item-desc';
                desc.textContent = repo.description || 'Public repository on GitHub.';

                topDiv.appendChild(h4);
                topDiv.appendChild(desc);
                item.appendChild(topDiv);

                const stats = document.createElement('div');
                stats.className = 'repo-item-stats';

                if (repo.language) {
                    const langSpan = document.createElement('span');
                    const langDot = document.createElement('i');
                    langDot.className = 'fas fa-circle';
                    langDot.style.fontSize = '7px';
                    langDot.style.color = 'var(--accent)';
                    langSpan.appendChild(langDot);
                    langSpan.appendChild(document.createTextNode(' ' + repo.language));
                    stats.appendChild(langSpan);
                }

                const starSpan = document.createElement('span');
                const starIcon = document.createElement('i');
                starIcon.className = 'far fa-star';
                starSpan.appendChild(starIcon);
                starSpan.appendChild(document.createTextNode(' ' + repo.stargazers_count));
                stats.appendChild(starSpan);

                const forkSpan = document.createElement('span');
                const forkIcon = document.createElement('i');
                forkIcon.className = 'fas fa-code-branch';
                forkSpan.appendChild(forkIcon);
                forkSpan.appendChild(document.createTextNode(' ' + repo.forks_count));
                stats.appendChild(forkSpan);

                item.appendChild(stats);
                repoContainer.appendChild(item);
            });
        } catch (error) {
            console.warn('Unable to load GitHub repositories:', error);
            repoContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface);">
                    <p style="margin-bottom: 0.5rem;">Repository feed currently unavailable via GitHub API.</p>
                    <a href="https://github.com/KABEER-321" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                        <i class="fab fa-github"></i> View Profile on GitHub
                    </a>
                </div>
            `;
        }
    };
    fetchGitHubRepos();

    /* ==========================================================================
       6. PDF MODALS (RESUME & CERTIFICATES WITH MOBILE FALLBACK)
       ========================================================================== */
    const resumeModal = document.getElementById('resume-modal');
    const openResumeBtn = document.getElementById('open-resume');
    const openResumeNavBtn = document.getElementById('open-resume-nav');
    const openResumeFooter = document.querySelector('.open-resume-footer');
    const closeResumeBtn = document.getElementById('close-resume');
    const resumeIframe = document.getElementById('resume-iframe');
    const resumeFallback = document.getElementById('resume-fallback');

    // Check if browser natively renders inline iframed PDFs
    const checkPdfSupport = () => {
        if (typeof navigator.pdfViewerEnabled !== 'undefined') {
            return navigator.pdfViewerEnabled;
        }
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const openModalHelper = (modal, iframe, fallback, pdfUrl) => {
        if (!modal) return;
        const supportsPdf = checkPdfSupport();

        if (supportsPdf) {
            if (iframe) {
                iframe.src = pdfUrl;
                iframe.style.display = 'block';
            }
            if (fallback) fallback.style.display = 'none';
        } else {
            if (iframe) {
                iframe.src = '';
                iframe.style.display = 'none';
            }
            if (fallback) fallback.style.display = 'block';
        }
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden';
    };

    const closeModalHelper = (modal, iframe) => {
        if (!modal) return;
        modal.classList.remove('show-modal');
        if (iframe) iframe.src = '';
        document.body.style.overflow = '';
    };

    // Resume triggers
    const triggerOpenResume = (e) => {
        if (e) e.preventDefault();
        openModalHelper(resumeModal, resumeIframe, resumeFallback, 'assets/resume/Mohammed_Kabeer_Resume.pdf');
    };

    if (openResumeBtn) openResumeBtn.addEventListener('click', triggerOpenResume);
    if (openResumeNavBtn) openResumeNavBtn.addEventListener('click', triggerOpenResume);
    if (openResumeFooter) openResumeFooter.addEventListener('click', triggerOpenResume);
    if (closeResumeBtn) closeResumeBtn.addEventListener('click', () => closeModalHelper(resumeModal, resumeIframe));

    // Certificate Modal
    const certModal = document.getElementById('cert-modal');
    const closeCertBtn = document.getElementById('close-cert');
    const certIframe = document.getElementById('cert-iframe');
    const certFallback = document.getElementById('cert-fallback');
    const certModalTitle = document.getElementById('cert-modal-title');
    const downloadCertBtn = document.getElementById('download-cert');
    const viewNewTabBtn = document.getElementById('view-new-tab');
    const openCertBtns = document.querySelectorAll('.open-cert-btn');

    openCertBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const certPath = btn.getAttribute('data-cert');
            const title = btn.getAttribute('data-title') || 'Certificate Preview';

            if (certModalTitle) certModalTitle.textContent = title;
            if (downloadCertBtn) downloadCertBtn.href = certPath;
            if (viewNewTabBtn) viewNewTabBtn.href = certPath;

            openModalHelper(certModal, certIframe, certFallback, certPath);
        });
    });

    if (closeCertBtn) closeCertBtn.addEventListener('click', () => closeModalHelper(certModal, certIframe));

    // Global Modal Backdrop & Escape Key Handlers
    window.addEventListener('click', (e) => {
        if (resumeModal && e.target === resumeModal) closeModalHelper(resumeModal, resumeIframe);
        if (certModal && e.target === certModal) closeModalHelper(certModal, certIframe);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModalHelper(resumeModal, resumeIframe);
            closeModalHelper(certModal, certIframe);
            closeNavMenu();
        }
    });

    /* ==========================================================================
       7. FORMSUBMIT AJAX CONTACT FORM
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-project').value.trim();
            const honeyInput = contactForm.querySelector('input[name="_honey"]');
            const honey = honeyInput ? honeyInput.value : '';

            // Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                return;
            }

            if (name.length < 2 || message.length < 5 || subject.length < 2) {
                formMessage.textContent = 'Please complete all required fields.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending Message... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

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

                if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
                    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Server responded with an error.');
                }
            } catch (err) {
                console.error('Contact Form Submission Error:', err);
                formMessage.textContent = 'Unable to send message right now. Please email directly at mdkabeermm786786@gmail.com.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } finally {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 8000);
            }
        });
    }

    /* ==========================================================================
       8. SCREENSHOT LIGHTBOX (CASE STUDY PAGES)
       ========================================================================== */
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const screenshotWrappers = document.querySelectorAll('.screenshot-img__wrapper, .screenshot-card');

    if (lightbox && lightboxImg) {
        const openLightbox = (img, captionText) => {
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
            if (lightboxCaption) lightboxCaption.innerHTML = captionText || img.alt || '';
            requestAnimationFrame(() => lightbox.classList.add('show'));
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
                document.body.style.overflow = '';
            }, 250);
        };

        screenshotWrappers.forEach(wrapper => {
            wrapper.style.cursor = 'pointer';
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('img');
                if (!img) return;
                const title = wrapper.querySelector('h3') ? wrapper.querySelector('h3').textContent : '';
                const desc = wrapper.querySelector('p') ? wrapper.querySelector('p').textContent : '';
                const caption = title ? `<strong>${title}</strong><br>${desc}` : img.alt;
                openLightbox(img, caption);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') closeLightbox();
        });
    }

    /* ==========================================================================
       9. SCROLL TO TOP & DYNAMIC COPYRIGHT YEAR
       ========================================================================== */
    const scrollUpBtn = document.getElementById('scroll-up');
    const handleScrollUpBtn = () => {
        if (!scrollUpBtn) return;
        if (window.scrollY >= 350) {
            scrollUpBtn.classList.add('show-scroll');
        } else {
            scrollUpBtn.classList.remove('show-scroll');
        }
    };
    window.addEventListener('scroll', handleScrollUpBtn, { passive: true });

    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

});
