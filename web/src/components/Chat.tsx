import { useLLM } from "@/contexts/useLLM";
import React, { useEffect, useState, FormEvent, useRef } from "react";
import { FaComments, FaPaperPlane, FaSpinner, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const {
    messages,
    sendMessage,
    isLoading,
    isReady,
    progress,
    showChat,
    setShowChat,
    enableLLM,
    initializeLLM,
  } = useLLM();
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const toggleChat = () => {
    if (!enableLLM) {
      setShowChat(true);
      return;
    }

    if (!isReady) return;

    setShowChat((prev) => !prev);
    if (!showChat) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
      setShowChat(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowChat(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-3 right-3 transition-all ${
        showChat ? "z-50" : "z-10"
      }`}
    >
      {!showChat && (
        <button
          onClick={toggleChat}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Open Infectio AI chat"
        >
          {!enableLLM ? (
            <FaComments size={20} />
          ) : isReady ? (
            <FaComments size={20} />
          ) : (
            <div className="flex items-center space-x-1.5 px-2">
              {progress && (
                <span className="text-xs font-medium">
                  {(progress.progress * 100).toFixed()}%
                </span>
              )}
              <FaSpinner className="animate-spin" size={16} />
            </div>
          )}
        </button>
      )}

      {showChat && (
        <div
          ref={chatRef}
          className="mt-2 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
          style={{ width: 400, maxHeight: "80vh" }}
        >
          <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              Infectio AI
            </span>
            <button
              onClick={toggleChat}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close chat"
            >
              <FaTimes size={16} />
            </button>
          </header>

          {!enableLLM ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <FaComments size={48} className="mb-4 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Enable AI Assistant
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                The AI assistant can help you with malware analysis questions.
                It requires downloading a ~1.5GB language model that runs
                locally in your browser.
              </p>
              <button
                onClick={() => {
                  initializeLLM();
                }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Enable AI Assistant
              </button>
            </div>
          ) : !isReady ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <FaSpinner className="mb-4 animate-spin text-primary" size={48} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Loading AI Model...
              </h3>
              {progress && (
                <div className="w-full max-w-xs">
                  <div className="mb-2 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${progress.progress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(progress.progress * 100).toFixed(0)}% - {progress.text}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((msg, index) => {
                  if (msg.role === "system") {
                    return null;
                  }

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs break-words rounded-lg px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t border-border bg-card p-3"
              >
                <input
                  type="text"
                  ref={inputRef}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
