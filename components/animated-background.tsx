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

function generateStraightPath(startX: number) {
  // Create a simple straight vertical path
  return `M ${startX},0 L ${startX},100`;
}

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [paths, setPaths] = useState<
    Array<{ id: number; d: string; color: string }>
  >([]);

  useEffect(() => {
    const colors = resolvedTheme === "dark" ? COLORS.dark : COLORS.light;

    // Generate multiple paths (e.g., 5 lines)
    const generateMultiplePaths = () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: Math.random(),
        d: generateStraightPath(Math.random() * 100), // Random start position for each line
        color: colors[i % colors.length],
      }));

    // Generate initial paths
    setPaths(generateMultiplePaths());

    // Update paths every 1.5 seconds
    const interval = setInterval(() => {
      setPaths(generateMultiplePaths());
    }, 1500);

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
        {paths.map((path) => (
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
              duration: 2.5, // Lightning strike duration
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
