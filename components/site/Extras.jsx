'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-orange" />;
}

export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const move = (e) => { x.set(e.clientX - 250); y.set(e.clientY - 250); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,106,19,.07),transparent_60%)]"
    />
  );
}

export function WhatsAppFab({ brand }) {
  if (!brand?.whatsapp) return null;
  return (
    <motion.a
      href={`https://wa.me/${brand.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 3, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,.5)]"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
