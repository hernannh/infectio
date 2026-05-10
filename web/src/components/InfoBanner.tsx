import React from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { NavLink } from "react-router";

interface InfoBannerProps {
  text: string;
  linkText: string;
  linkHref: string;
}

function InfoBanner({ text, linkText, linkHref }: InfoBannerProps) {
  return (
    <div
      role="note"
      className="w-full flex items-center justify-between gap-4 rounded-lg border border-border border-l-4 border-l-primary bg-card text-card-foreground px-5 py-4 shadow-sm"
    >
      <a
        href="https://github.com/hernannh/infectio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center text-foreground hover:text-primary transition-colors"
        aria-label="View on GitHub"
      >
        <FaGithub className="h-5 w-5" />
      </a>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
      <NavLink
        to={linkHref}
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        {linkText}
        <FaArrowRight className="h-3.5 w-3.5" />
      </NavLink>
    </div>
  );
}

export default InfoBanner;
