"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const COLORS = {
  light: [
    "rgba(147, 51, 234, 0.8)",
    "rgba(59, 130, 246, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(34, 197, 94, 0.8)",
  ],
  dark: [
    "rgba(167, 139, 250, 0.6)",
    "rgba(96, 165, 250, 0.6)",
    "rgba(244, 114, 182, 0.6)",
    "rgba(74, 222, 128, 0.6)",
  ],
};

function generatePath(startX: number) {
  const points = [];
  const segments = 2; // Fewer points for a more lightning-like look

  // Generate a zigzag path from top to bottom
  for (let i = 0; i <= segments; i++) {
    const y = (i / segments) * 100; // Progress evenly from top to bottom
    const amplitude = 1 + Math.random() * 12; // Slightly irregular zigzag amplitude
    const x = startX + (Math.random() > 0.1 ? amplitude : -amplitude); // Irregular zigzag
    points.push(`${x},${y}`);
  }

  return `M ${points.join(" L ")}`;
}

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [paths, setPaths] = useState<
    Array<{ id: number; d: string; color: string }>
  >([]);

  useEffect(() => {
    const colors = resolvedTheme === "dark" ? COLORS.dark : COLORS.light;

    // Generate initial paths
    const newPaths = Array.from({ length: 1 }, (_, i) => ({
      id: i,
      d: generatePath(Math.random() * 100), // Random start position
      color: colors[i % colors.length],
    }));
    setPaths(newPaths);

    const interval = setInterval(() => {
      setPaths([
        {
          id: Math.random(),
          d: generatePath(Math.random() * 100), // Random start position for each line
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
    }, 1500); // New line every 1.5 seconds

    return () => clearInterval(interval);
  }, [resolvedTheme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted opacity-80" />

      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth="0.1" // Reduced line width
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 1, 1, 0], // Fade out after appearing
            }}
            transition={{
              duration: 1.5, // Lightning strike duration
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
