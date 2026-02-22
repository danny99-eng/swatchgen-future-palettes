'use client';

import { useState, useRef, useCallback, useEffect, Suspense, lazy } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

// ─── Utility ────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Spotlight Component (cursor-following) ──────────────────────────────────
function Spotlight({ size = 280 }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentEl, setParentEl] = useState(null);

  const mouseX = useSpring(0, { bounce: 0 });
  const mouseY = useSpring(0, { bounce: 0 });
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) setParentEl(containerRef.current.parentElement);
  }, []);

  const onMove = useCallback((e) => {
    if (!parentEl) return;
    const { left: l, top: t } = parentEl.getBoundingClientRect();
    mouseX.set(e.clientX - l);
    mouseY.set(e.clientY - t);
  }, [parentEl, mouseX, mouseY]);

  useEffect(() => {
    if (!parentEl) return;
    parentEl.addEventListener('mousemove', onMove);
    parentEl.addEventListener('mouseenter', () => setIsHovered(true));
    parentEl.addEventListener('mouseleave', () => setIsHovered(false));
    return () => {
      parentEl.removeEventListener('mousemove', onMove);
      parentEl.removeEventListener('mouseenter', () => setIsHovered(true));
      parentEl.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [parentEl, onMove]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
    >
      <motion.div
        style={{
          position: 'absolute',
          width: size,
          height: size,
          left,
          top,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, hsl(var(--glow-primary)) 0%, transparent 70%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}

// ─── SplineScene (lazy) ───────────────────────────────────────────────────────
const SplineComp = lazy(() => import('@splinetool/react-spline'));

function SplineScene({ scene, style }) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    }>
      <SplineComp scene={scene} style={{ width: '100%', height: '100%', ...style }} />
    </Suspense>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SplineSceneThemed() {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 w-full">
      {/* Floating Background Elements inherited from Main Theme */}
      <div className="absolute inset-0 -z-10 w-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto w-full max-w-[1500px] relative z-10 flex flex-col items-center">
        <motion.div
          className="w-full relative overflow-visible"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Spotlight Effect overlay on the card */}
          <Spotlight size={400} />

          <div className="flex flex-col lg:flex-row w-full min-h-[600px] items-stretch gap-8">

            {/* ── Left: Content ── */}
            <div className="flex-1 py-8 md:py-12 lg:py-16 flex flex-col justify-center relative z-20">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI-Powered Color Intelligence</span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Design Smarter with{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Instant Color Intelligence
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  SwatchGen extracts beautiful palettes, generates gradients, recommends typography,
                  and gives designers futuristic tools to work faster.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Try SwatchGen
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex flex-wrap gap-6 sm:gap-8 mt-12 pt-8"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">500K+</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Palettes Created</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">50K+</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Designers</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">4.9/5</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Rating</span>
                </div>
              </motion.div>
            </div>

            {/* ── Vertical divider ── */}
            <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block opacity-50" />

            {/* ── Right: 3D Scene ── */}
            <div className="flex-1 relative min-h-[400px] lg:min-h-full overflow-hidden bg-black/5 dark:bg-black/20">
              {/* Subtle edge overlay blending */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-card/80 to-transparent w-24 z-10 hidden lg:block" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-card/80 to-transparent h-24 z-10 lg:hidden top-0" />

              <div className="absolute inset-0 w-full h-full lg:scale-110 origin-center transition-transform duration-1000">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                />
              </div>
            </div>

          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-sm text-muted-foreground font-medium text-center"
        >
          Ocean palette · Light & dark adaptive · Powered by Spline
        </motion.p>
      </div>
    </section>
  );
}
