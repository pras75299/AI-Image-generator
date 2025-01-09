import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-lg bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {/* Gradient border */}
    <div
      className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-border"
      style={{
        zIndex: -1,
        filter: "blur(1px)", // Soft blur to make it glow slightly
      }}
    ></div>
    {/* Card content */}
    <div className="relative rounded-lg bg-card text-card-foreground">
      {props.children}
    </div>
  </div>
));
Card.displayName = "Card";

export { Card };
