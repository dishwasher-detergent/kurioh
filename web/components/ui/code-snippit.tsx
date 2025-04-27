import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Badge } from "@/components/ui/badge";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";

export function ApiRequestSnippit({
  code,
  language,
  title = "Request",
  endpoint,
}: {
  code: string | null;
  language?: string;
  title?: string;
  endpoint?: string;
}) {
  return (
    <article className="overflow-hidden rounded-xl border">
      <header className="flex items-center justify-between p-2 pl-4">
        <p className="text-sm font-bold">{title}</p>
        {language && (
          <Badge variant="secondary" className="uppercase">
            {language}
          </Badge>
        )}
      </header>
      {endpoint && (
        <div className="bg-muted/50 text-foreground/70 border-y p-2 px-4">
          <p className="flex gap-2 text-xs font-semibold">
            <span className="font-semibold text-green-600">GET</span>
            {endpoint.split(/(run|global)/)[2]}
          </p>
        </div>
      )}
      <div className="code bg-background group relative overflow-hidden border-t">
        {code && (
          <CopyToClipboard
            data={code}
            className="absolute top-1 right-5 opacity-0 transition group-hover:opacity-100"
          />
        )}
        <SyntaxHighlighter
          language="js"
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
    </article>
  );
}
