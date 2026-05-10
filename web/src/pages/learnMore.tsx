import React from "react";
import Logo from "../components/Logo";
import Accordion from "@/components/Accordion";
import { NavLink } from "react-router";
import { FaArrowLeft, FaGithub } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";

const faqs = [
  {
    question: "What is this application about?",
    answer:
      "This application provides advanced file analysis using techniques like entropy calculations, metadata extraction, and heuristic evaluations to help identify potential threats in files.",
    open: false,
  },
  {
    question: "How does file analysis work?",
    answer:
      "The application processes the file in chunks and uses worker threads to extract features such as strings, IPs, URLs, and metadata, while calculating entropy to detect anomalies.",
    open: false,
  },
  {
    question: "What file formats are supported?",
    answer:
      "Currently, the application supports analysis of DOC, DOCX, RTF, XLS, XLSX, PPT, PPTX, and PDF files.",
    open: false,
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your files are processed locally, ensuring that no sensitive data leaves your device.",
    open: false,
  },
  {
    question: "Where can I find the source code?",
    answer:
      "The project is open source and available on GitHub. You can find the source code, contribute, and report issues at: https://github.com/hernannh/infectio",
    open: false,
  },
];

const LearnMorePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/hernannh/infectio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="View on GitHub"
              aria-label="View on GitHub"
            >
              <FaGithub size={20} />
            </a>
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <FaArrowLeft size={12} />
              Go back
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-8 max-w-4xl">
        <p className="text-foreground">
          This application empowers users with advanced tools for file analysis,
          focusing on identifying potential threats through static malware
          analysis. Learn how it works and discover its key features below.
        </p>

        <section className="flex flex-col">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">FAQs</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Accordion key={index} title={faq.question} defaultOpen={false}>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearnMorePage;
