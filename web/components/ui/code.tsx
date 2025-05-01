import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";

export function Code({
  code,
  language = "js",
}: {
  code: string | null;
  language?: string;
}) {
  return (
    <div className="code bg-background group relative overflow-hidden border-t">
      {code && (
        <CopyToClipboard
          data={code}
          className="absolute top-1 right-5 opacity-0 transition group-hover:opacity-100"
        />
      )}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={true}
        customStyle={{
          padding: 0,
          paddingInline: 0,
          paddingBlock: 0,
          margin: 0,
          marginBottom: 0,
          height: "100%",
          width: "100%",
          borderRadius: 0,
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {typeof code === "string" ? code : JSON.stringify(code, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
}
