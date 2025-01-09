"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function AnimatedBackground() {
  // Generate fixed positions for the orbs
  const orbPositions = useMemo(() => {
    return Array(3)
      .fill(0)
      .map((_, i) => ({
        initialX: (i + 1) * 30,
        initialY: (i + 1) * 25,
        moveX: (i + 1) * 40 - 60,
        moveY: (i + 1) * 35 - 50,
      }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {orbPositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute h-[40vh] w-[40vh] rounded-full"
          initial={{
            x: position.initialX,
            y: position.initialY,
          }}
          style={{
            background: `radial-gradient(circle at center, rgba(var(--primary-rgb), 0.${
              i + 1
            }) 0%, transparent 70%)`,
            top: "30%",
            left: "30%",
          }}
          animate={{
            x: [
              position.initialX,
              position.initialX + position.moveX,
              position.initialX,
            ],
            y: [
              position.initialY,
              position.initialY + position.moveY,
              position.initialY,
            ],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
