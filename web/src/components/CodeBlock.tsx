import React from "react";

import Editor from "@monaco-editor/react";

type CodeBlockProps = {
  language: string;
  code: string;
  rowHeight?: number;
  maxLines?: number;
};

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Editor
        height={"50vh"}
        defaultLanguage={language}
        defaultValue={code}
        options={{
          readOnly: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default CodeBlock;
