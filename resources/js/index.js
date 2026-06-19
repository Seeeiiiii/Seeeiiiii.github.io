window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spaceCanvas');
    const STEP = 2000;

    const canvasCenterX = 6000 / 2;
    const canvasCenterY = 6000 / 2;

    let offsetX = canvasCenterX - (window.innerWidth / 2);
    let offsetY = canvasCenterY - (window.innerHeight / 2);

    const homeX = offsetX;
    const homeY = offsetY;

    const CANVAS_SIZE = 6000;

    function applyPosition() {
        const maxX = CANVAS_SIZE - window.innerWidth;
        const maxY = CANVAS_SIZE - window.innerHeight;
        offsetX = Math.max(0, Math.min(offsetX, maxX));
        offsetY = Math.max(0, Math.min(offsetY, maxY));
        canvas.style.transform = `translate(-${offsetX}px, -${offsetY}px)`;
    }

    applyPosition();

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

    // ==========================================================================
    // 3D STACK LAYER CAROUSEL CONTROLLER
    // ==========================================================================
    const track = document.getElementById('carouselTrack');
    const prevArrow = document.querySelector('.arrow-left');
    const nextArrow = document.querySelector('.arrow-right');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    let currentSlideIndex = 1; // Default to E-Commerce center focus

    function updateStackLayout(activeIndex) {
        if (!track) return;
        const cards = track.querySelectorAll('.main-card');
        const totalCards = cards.length;

        cards.forEach((card, i) => {
            // Clean up old positional layout classes
            card.classList.remove('active', 'prev', 'next');

            // Calculate loop wrapping indices safely
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

        // Sync indicator tracking dots
        indicatorDots.forEach(dot => dot.classList.remove('active'));
        if (indicatorDots[activeIndex]) {
            indicatorDots[activeIndex].classList.add('active');
        }

        currentSlideIndex = activeIndex;
    }

    // Initialize layout position tracking
    updateStackLayout(currentSlideIndex);

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Stops event from drifting your layout canvas
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

let isDragging = false;
let startX, startY;
let initialOffsetX, initialOffsetY;

// Add this to your DOMContentLoaded block
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    // Capture initial mouse position
    startX = e.clientX;
    startY = e.clientY;
    // Capture the state of the canvas offsets at the moment of click
    initialOffsetX = offsetX;
    initialOffsetY = offsetY;
    
    canvas.style.cursor = 'grabbing';
});

