import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "compact" | "hero";
}

export default function Logo({ variant = "compact" }: LogoProps) {
  const isHero = variant === "hero";
  return (
    <div className={cn("flex items-center", isHero ? "gap-4" : "gap-2")}>
      <img
        className={cn(
          "drop-shadow",
          isHero ? "w-24" : "w-12"
        )}
        src="/logo.png"
        alt="Infectio logo"
      />
      <span
        className={cn(
          "font-bold tracking-tight text-foreground",
          isHero ? "text-5xl" : "text-2xl"
        )}
      >
        Infectio
      </span>
    </div>
  );
}
