window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spaceCanvas');
    const STEP = 2000;

    const LIMIT_WIDTH = 6000; 
    const LIMIT_HEIGHT = 6000;

    let offsetX = (6000 / 2) - (window.innerWidth / 2);
    let offsetY = (6000 / 2) - (window.innerHeight / 2);

    const homeX = offsetX;
    const homeY = offsetY;

    function applyPosition() {
        const maxX = LIMIT_WIDTH - window.innerWidth;
        const maxY = LIMIT_HEIGHT - window.innerHeight;
        

        offsetX = Math.max(0, Math.min(offsetX, maxX));
        offsetY = Math.max(0, Math.min(offsetY, maxY));
        
        canvas.style.transform = `translate(-${offsetX}px, -${offsetY}px)`;
    }

    applyPosition();

    // Two-Finger Trackpad Panning
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        offsetX += e.deltaX;
        offsetY += e.deltaY;
        applyPosition();
    }, { passive: false });

    const moves = {
        '.nav-btn-up':    () => { offsetY -= STEP; },
        '.nav-btn-down':  () => { offsetY += STEP; },
        '.nav-btn-left':  () => { offsetX -= STEP; },
        '.nav-btn-right': () => { offsetX += STEP; },
        '.nav-btn-home':  () => { offsetX = homeX; offsetY = homeY; },
    };

    Object.entries(moves).forEach(([selector, moveFn]) => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.addEventListener('click', () => {
                moveFn();
                applyPosition();
            });
        }
    });

    window.addEventListener('keydown', (e) => {
        const keyMap = {
            ArrowUp:    () => { offsetY -= STEP; },
            ArrowDown:  () => { offsetY += STEP; },
            ArrowLeft:  () => { offsetX -= STEP; },
            ArrowRight: () => { offsetX += STEP; },
        };
        if (keyMap[e.key]) {
            e.preventDefault();
            keyMap[e.key]();
            applyPosition();
        }
    });

    // --- Carousel Controller ---
    const track = document.getElementById('carouselTrack');
    const prevArrow = document.querySelector('.arrow-left');
    const nextArrow = document.querySelector('.arrow-right');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    let currentSlideIndex = 1;

    function updateStackLayout(activeIndex) {
        if (!track) return;
        const cards = track.querySelectorAll('.main-card');
        const totalCards = cards.length;

        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');
            const prevIndex = (activeIndex - 1 + totalCards) % totalCards;
            const nextIndex = (activeIndex + 1) % totalCards;

            if (i === activeIndex) {
                card.classList.add('active');
            } else if (i === prevIndex) {
                card.classList.add('prev');
            } else if (i === nextIndex) {
                card.classList.add('next');
            }
        });

        indicatorDots.forEach(dot => dot.classList.remove('active'));
        if (indicatorDots[activeIndex]) {
            indicatorDots[activeIndex].classList.add('active');
        }
        currentSlideIndex = activeIndex;
    }

    updateStackLayout(currentSlideIndex);

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const cards = track.querySelectorAll('.main-card');
            let target = (currentSlideIndex - 1 + cards.length) % cards.length;
            updateStackLayout(target);
        });

        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const cards = track.querySelectorAll('.main-card');
            let target = (currentSlideIndex + 1) % cards.length;
            updateStackLayout(target);
        });
    }

    indicatorDots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            updateStackLayout(idx);
        });
    });
});

