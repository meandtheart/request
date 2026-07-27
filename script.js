// =========================================================================
// 1. INTERACTIVE WHEEL ROTATION CONTROL
// =========================================================================
const container = document.getElementById('wheelContainer');
const wheel = document.getElementById('spinningWheel');
let currentRotation = 0;
let lastTouchY = 0;

function applyWheelRotation() {
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    // Every gondola reads this custom property to counter-rotate itself
    // by the same live amount, keeping images/labels upright (Ferris wheel effect).
    wheel.style.setProperty('--rotation', `${currentRotation}deg`);
}

if (container && wheel) {
    // Desktop mouse wheel scroll rotation
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        currentRotation += e.deltaY * 0.2;
        applyWheelRotation();
    }, { passive: false });

    // Mobile touch controls start track
    container.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
    }, { passive: true });

    // Mobile drag swipe rotation logic
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const currentTouchY = e.touches[0].clientY;
        const deltaY = lastTouchY - currentTouchY;
        currentRotation += deltaY * 0.5;
        applyWheelRotation();
        lastTouchY = currentTouchY;
    }, { passive: false });
}


// =========================================================================
// 2. SHOPPING CART LIVE QUANTITY TRACKER
// =========================================================================
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const totalItems = cart.reduce((sum, item) => {
        return sum + (item.quantity || 1);
    }, 0);

    const badge = document.getElementById('cartCount');

    if (!badge) return;

    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'flex';
        badge.style.opacity = '1';
    } else {
        badge.textContent = '';
        badge.style.display = 'none';
        badge.style.opacity = '0';
    }
}


// =========================================================================
// 3. PAGE INITIALIZATION LISTENER
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// 3D STACK CAROUSEL & POP-UP MODAL LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('stackContainer');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');

    if (!container) return;

    let slots = ['slot-far-left', 'slot-mid-left', 'slot-center', 'slot-mid-right', 'slot-far-right'];
    const cards = Array.from(container.querySelectorAll('.stack-card'));

    function updateCardPositions() {
        cards.forEach((card, index) => {
            card.className = `stack-card ${slots[index]}`;
        });
    }

    function rotateRight() {
        slots.unshift(slots.pop());
        updateCardPositions();
    }

    function rotateLeft() {
        slots.push(slots.shift());
        updateCardPositions();
    }

// CLICK ANY CARD TO SLIDE IT IN & SCATTER OTHERS
cards.forEach((card) => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img && modal && modalImg) {
            modalImg.src = img.src;
            modal.style.display = 'flex';
            
            // ⬇️ THIS LINE scatters the background images away!
            container.classList.add('modal-active');
        }
    });
});

// CLOSE POP-UP AND RESET BACKGROUND CARDS
if (modal) {
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
        
        // ⬇️ THIS LINE brings the background images back to normal!
        container.classList.remove('modal-active');
    });
}
    // SWIPE GESTURES
    let startX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 30) {
            if (diffX > 0) rotateRight();
            else rotateLeft();
        }
        isDragging = false;
    }, { passive: true });

    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        const diffX = startX - e.clientX;
        if (Math.abs(diffX) > 30) {
            if (diffX > 0) rotateRight();
            else rotateLeft();
        }
        isDragging = false;
    });
});
