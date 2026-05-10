import React from "react";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/contexts/ThemeProvider";

type CodeBlockProps = {
  language: string;
  code: string;
  rowHeight?: number;
  maxLines?: number;
};

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Editor
        height={"50vh"}
        defaultLanguage={language}
        defaultValue={code}
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        options={{
          readOnly: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default CodeBlock;
