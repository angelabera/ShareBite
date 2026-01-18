document.addEventListener('DOMContentLoaded', () => {
    const coords = { x: 0, y: 0 };
    const circles = [];
    
    // Theme colors matching style.css variables
    const colors = [
        '#4CAF50', // primary-color
        '#2E7D32', // primary-dark
        '#81C784', // primary-light
        '#FF6B35', // secondary-color
        '#FFC107'  // accent-color
    ];

    let isActive = localStorage.getItem('sharebite-cursor-trail') !== 'false'; // Default to true or check storage
    const cursorToggleBtn = document.getElementById('cursorToggle');

    // Initialize toggle button state
    if (cursorToggleBtn) {
        updateToggleIcon(isActive);
        cursorToggleBtn.addEventListener('click', () => {
            isActive = !isActive;
            localStorage.setItem('sharebite-cursor-trail', isActive);
            updateToggleIcon(isActive);
        });
    }

    function updateToggleIcon(active) {
        if (!cursorToggleBtn) return;
        const icon = cursorToggleBtn.querySelector('i');
        if (active) {
            cursorToggleBtn.classList.add('active');
            // If we want to change icon style when active vs inactive
            icon.style.opacity = '1';
        } else {
            cursorToggleBtn.classList.remove('active');
            icon.style.opacity = '0.5';
        }
    }

    window.addEventListener("mousemove", function(e){
        if (!isActive) return;
        
        coords.x = e.clientX;
        coords.y = e.clientY;
        
        createCircle(coords.x, coords.y);
    });

    function createCircle(x, y) {
        const circle = document.createElement("div");
        circle.classList.add("cursor-circle");
        document.body.appendChild(circle);
        
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        circle.style.backgroundColor = color;
        
        circles.push({
            element: circle,
            x: x,
            y: y,
            life: 1
        });

        // Limit number of circles to prevent performance issues
        if (circles.length > 50) {
            const oldCircle = circles.shift();
            oldCircle.element.remove();
        }
    }

    function animateCircles() {
        if (circles.length > 0) {
            for (let i = 0; i < circles.length; i++) {
                let p = circles[i];
                p.life -= 0.05; // Fade out speed
                
                p.element.style.opacity = p.life;
                p.element.style.transform = `scale(${p.life})`;
                
                if (p.life <= 0) {
                    p.element.remove();
                    circles.splice(i, 1);
                    i--;
                }
            }
        }
        requestAnimationFrame(animateCircles);
    }

    animateCircles();
});
