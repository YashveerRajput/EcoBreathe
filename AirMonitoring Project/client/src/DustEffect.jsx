import { useEffect, useRef } from 'react';

export default function DustEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const PARTICLE_COUNT = 150;
    const MOUSE_RADIUS = 150;

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const createParticle = (randomizePos = true) => {
      return {
        x: randomizePos ? Math.random() * canvas.width : Math.random() * canvas.width,
        y: randomizePos ? Math.random() * canvas.height : canvas.height + 10,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5 - 0.2, // slightly upward drift
        state: 'dust',
        alpha: Math.random() * 0.5 + 0.1,
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(true));
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.state === 'dust') {
          ctx.fillStyle = `rgba(180, 175, 165, ${p.alpha})`; // Light dust
        } else {
          ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`; // Clean cyan air
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Update Position
        if (p.state === 'dust') {
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap around edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          // Check mouse collision
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS) {
            p.state = 'clean';
            p.speedY = -(Math.random() * 2 + 2); // Accelerate upwards
            p.speedX = (Math.random() - 0.5) * 2; // Scatter slightly
            p.alpha = 1; // Brighten up
          }
        } else if (p.state === 'clean') {
          p.x += p.speedX;
          p.y += p.speedY;
          p.alpha -= 0.015; // Fade out rapidly

          if (p.alpha <= 0) {
            // Respawn as new dust
            particles[i] = createParticle(false);
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resize);
    resize();
    drawParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
