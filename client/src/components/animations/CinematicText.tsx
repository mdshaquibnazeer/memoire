'use client';

import { motion } from 'framer-motion';

interface CinematicTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

export default function CinematicText({
  text,
  className = '',
  delay = 0,
  staggerChildren = 0.04,
}: CinematicTextProps) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -30,
      filter: 'blur(4px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`${className} overflow-hidden`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          variants={child}
          style={{ perspective: '800px' }}
        >
          <span className="text-gradient">{word}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}
