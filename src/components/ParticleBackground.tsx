import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Wave configuration
    const waveCount = 3;
    type WaveType = {
      amplitude: number;
      frequency: number;
      speed: number;
      yOffset: number;
      colorStart: string;
      colorEnd: string;
    };
    
    const waves: WaveType[] = [];

    // Create waves with different properties
    for (let i = 0; i < waveCount; i++) {
      const opacity = theme === 'dark' 
        ? 0.3 - (i * 0.06)  // Higher opacity for dark mode
        : 0.22 - (i * 0.05); // Lower opacity for light mode
      
      waves.push({
        amplitude: 80 + i * 50, // Wave height
        frequency: 0.006 + i * 0.003, // Wave frequency
        speed: 0.02 + i * 0.01, // Wave speed (slow)
        yOffset: (canvas.height / (waveCount + 1)) * (i + 1), // Vertical position
        colorStart: theme === 'dark' 
          ? `hsla(${217 + i * 15}, 91%, ${60 - i * 5}%, ${opacity})` // Blue gradient for dark mode
          : `hsla(${221 + i * 12}, 83%, ${53 + i * 3}%, ${opacity})`, // Blue gradient for light mode
        colorEnd: theme === 'dark'
          ? `hsla(${262 + i * 8}, 83%, ${58 - i * 3}%, ${opacity * 0.8})` // Purple gradient for dark mode
          : `hsla(${258 + i * 8}, 90%, ${66 + i * 2}%, ${opacity * 0.7})`, // Purple gradient for light mode
      });
    }

    // Reset time when theme changes
    timeRef.current = 0;

    const drawWave = (wave: WaveType, time: number) => {
      ctx.beginPath();
      ctx.moveTo(0, wave.yOffset);

      // Draw wave using sine function
      for (let x = 0; x <= canvas.width; x += 2) {
        const y =
          wave.yOffset +
          Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
        ctx.lineTo(x, y);
      }

      // Complete the path to create a fill area
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Create gradient for this wave
      const waveGradient = ctx.createLinearGradient(
        0,
        wave.yOffset - wave.amplitude,
        0,
        wave.yOffset + wave.amplitude
      );
      
      // Use the colors directly (already in HSLA format)
      waveGradient.addColorStop(0, wave.colorStart);
      waveGradient.addColorStop(0.5, wave.colorEnd);
      waveGradient.addColorStop(1, wave.colorEnd);

      ctx.fillStyle = waveGradient;
      ctx.fill();
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update time for wave animation
      timeRef.current += 0.3; // Slow animation speed

      // Draw each wave
      waves.forEach((wave) => {
        drawWave(wave, timeRef.current);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    const handleResize = () => {
      resizeCanvas();
      // Update wave yOffsets after resize
      waves.forEach((wave, i) => {
        wave.yOffset = (canvas.height / (waveCount + 1)) * (i + 1);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ 
        background: 'transparent',
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
};

export default ParticleBackground;
