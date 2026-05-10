import React, { useState, ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

const Accordion = ({ title, children, defaultOpen }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={toggleAccordion}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:bg-accent"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-foreground">{title}</span>
        {isOpen ? (
          <FaChevronUp className="text-muted-foreground" size={12} />
        ) : (
          <FaChevronDown className="text-muted-foreground" size={12} />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-border bg-card p-4">{children}</div>
      )}
    </div>
  );
};

export default Accordion;
