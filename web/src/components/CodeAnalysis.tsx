import React, { useState, useEffect } from "react";
import Accordion from "./Accordion";
import CodeBlock from "./CodeBlock";
import { FaRobot } from "react-icons/fa";
import { useLLM } from "@/contexts/useLLM";
import { ContentType } from "@/types/types";

type CodeAnalysisProps = {
  file: File;
  contentType: ContentType;
};

const CodeAnalysis = ({ file, contentType }: CodeAnalysisProps) => {
  const { sendMessage, setShowChat, isReady } = useLLM();
  const [code, setCode] = useState<string>("");

  const handleExplainCode = () => {
    const prompt = `Please analyze the following code:

\`\`\`
${code}
\`\`\`

- Provide a brief description of what the code does.
- Give a malicious score.`;
    sendMessage(prompt);
    setShowChat(true);
  };

  useEffect(() => {
    file.text().then((resolvedText) => {
      setCode(resolvedText);
    });
  }, [file]);

  const language = contentType.mime_type
    ? contentType.mime_type.split("/")[1].replace("x-", "")
    : "";

  return (
    <Accordion title="Code Analysis">
      <CodeBlock code={code} language={language} />
      {isReady && (
        <div className="flex w-full justify-end pt-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={handleExplainCode}
          >
            <FaRobot size={16} />
            Explain code
          </button>
        </div>
      )}
    </Accordion>
  );
};

export default CodeAnalysis;
