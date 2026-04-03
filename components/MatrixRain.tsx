"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アカサタナ◈▸◉■□▲△◆◇";
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1).map(() => Math.random() * -50);

    const draw = () => {
      ctx.fillStyle = "rgba(4, 5, 10, 0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols = Math.floor(canvas.width / fontSize);
      while (drops.length < cols) drops.push(Math.random() * -50);

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const progress = drops[i] / (canvas.height / fontSize);

        if (progress > 0.85) {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.05 + (1 - progress) * 0.12})`;
        } else if (progress > 0.6) {
          ctx.fillStyle = `rgba(0, 143, 17, ${0.04 + progress * 0.06})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.03 + progress * 0.04})`;
        }

        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.38;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}
