// script.js

document.addEventListener('DOMContentLoaded', () => {
    // パーティクルアニメーション
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.svg = document.querySelector('.particles');
            if (!this.svg) return;
            this.init();
        }

        init() {
            this.createParticles();
            this.animate();
        }

        createParticles() {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                const particle = {
                    element: this.createParticleElement(),
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    speed: Math.random() * 1 + 0.5,
                    angle: Math.random() * Math.PI * 2,
                    spin: Math.random() * 0.2 - 0.1,
                    radius: Math.random() * 3 + 1
                };
                this.particles.push(particle);
            }
        }

        createParticleElement() {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.classList.add('particle');
            circle.setAttribute('r', Math.random() * 3 + 1);
            this.svg.appendChild(circle);
            return circle;
        }

        animate() {
            this.particles.forEach(particle => {
                particle.angle += particle.spin;
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed;

                // Wrap around screen edges
                if (particle.x < 0) particle.x = window.innerWidth;
                if (particle.x > window.innerWidth) particle.x = 0;
                if (particle.y < 0) particle.y = window.innerHeight;
                if (particle.y > window.innerHeight) particle.y = 0;

                particle.element.setAttribute('cx', particle.x);
                particle.element.setAttribute('cy', particle.y);
                particle.element.setAttribute('r', particle.radius * (1 + Math.sin(particle.angle) * 0.1));
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // 背景シェイプアニメーション
    class BackgroundAnimation {
        constructor() {
            this.shapes = document.querySelectorAll('.background-shapes path');
            if (this.shapes.length === 0) return;
            this.init();
        }

        init() {
            this.shapes.forEach((shape, index) => {
                gsap.to(shape, {
                    duration: 20 + index * 5,
                    rotate: 360,
                    transformOrigin: 'center center',
                    repeat: -1,
                    ease: 'none'
                });
            });
        }
    }

    // ヘッダーコントローラー
    class HeaderController {
        constructor() {
            this.header = document.querySelector('.header');
            this.mobileMenuButton = document.querySelector('.mobile-menu-button');
            this.mobileMenu = document.querySelector('.mobile-menu');
            this.lastScrollPosition = 0;
            this.ticking = false;

            if (!this.header) {
                console.error('Header element not found');
                return;
            }

            this.init();
        }

        init() {
            this.setupScrollHandler();
            if (this.mobileMenuButton && this.mobileMenu) {
                this.setupMobileMenu();
            }
            this.setupSmoothScroll();
            this.setupNavAnimation();
        }

        setupScrollHandler() {
            window.addEventListener('scroll', () => {
                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.handleScroll();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }, { passive: true });
        }

        handleScroll() {
            const currentScrollPosition = window.pageYOffset;
            const scrollDirection = currentScrollPosition > this.lastScrollPosition ? 'down' : 'up';

            if (currentScrollPosition > 100) {
                if (scrollDirection === 'down' && !this.header.classList.contains('hide')) {
                    this.header.classList.add('hide');
                } else if (scrollDirection === 'up' && this.header.classList.contains('hide')) {
                    this.header.classList.remove('hide');
                }
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled', 'hide');
            }

            this.lastScrollPosition = currentScrollPosition;
        }

        setupMobileMenu() {
            this.mobileMenuButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            document.addEventListener('click', (e) => {
                if (!this.mobileMenu.contains(e.target) && 
                    !this.mobileMenuButton.contains(e.target) && 
                    this.mobileMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.mobileMenuButton.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');

            const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-list li');
            menuItems.forEach((item, index) => {
                item.style.setProperty('--item-index', index);
            });
        }

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        if (this.mobileMenu.classList.contains('active')) {
                            this.toggleMobileMenu();
                        }
                    }
                });
            });
        }

        setupNavAnimation() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const en = link.querySelector('.nav-link-en');
                    gsap.to(en, {
                        y: -3,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                link.addEventListener('mouseleave', () => {
                    const en = link.querySelector('.nav-link-en');
                    gsap.to(en, {
                        y: 0,
                        opacity: 0.7,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                });
            });
        }
    }

    // スクロールアニメーションコントローラー
    class ScrollAnimationController {
        constructor() {
            this.elements = document.querySelectorAll('.animate-on-scroll');
            if (this.elements.length === 0) return;
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
            this.setupGSAPAnimations();
        }

        setupIntersectionObserver() {
            const options = {
                threshold: 0.2,
                rootMargin: '0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.elements.forEach(element => {
                observer.observe(element);
            });
        }

        setupGSAPAnimations() {
            gsap.registerPlugin(ScrollTrigger);

            // Service Cards Animation
            document.querySelectorAll('.service-card').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none reverse'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: 'power3.out'
                });
            });

            // Section Titles Animation
            document.querySelectorAll('h2:not(.hero-title)').forEach(title => {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: title,
                        start: 'top bottom-=100'
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        }
    }

    // テキストアニメーション
    class TextAnimationController {
        constructor() {
            this.animateHeroText();
            this.setupTextAnimations();
        }

        animateHeroText() {
            const heroTitle = document.querySelector('.hero-title-main');
            const heroSubtitle = document.querySelector('.hero-title-sub');
            
            if (heroTitle && heroSubtitle) {
                const splitTitle = new SplitType(heroTitle, { types: 'chars' });
                const splitSubtitle = new SplitType(heroSubtitle, { types: 'chars' });

                gsap.from(splitTitle.chars, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: 'power3.out'
                });

                gsap.from(splitSubtitle.chars, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.01,
                    delay: 0.5,
                    ease: 'power3.out'
                });
            }
        }

        setupTextAnimations() {
            document.querySelectorAll('.animate-text').forEach(element => {
                gsap.from(element, {
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom-=100'
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        }
    }

    // Swiperの初期化
    var swiper = new Swiper('.mySwiper', {
        loop: true, // ループの有効化
        autoplay: {
            delay: 5000, // 自動再生の遅延時間（ミリ秒）
            disableOnInteraction: false, // ユーザー操作後も自動再生を続行
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // ページネーションのクリックを有効化
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // レスポンシブ設定
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 40,
            },
        },
    });

    // 初期化
    try {
        new ParticleSystem();
        new BackgroundAnimation();
        // new SliderController(); // 削除済み
        new HeaderController();
        new ScrollAnimationController();
        new TextAnimationController();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});