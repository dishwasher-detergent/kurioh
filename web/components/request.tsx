"use client";

import {
  LucideAlertCircle,
  LucideCheckCircle,
  LucideClipboard,
  LucideLoader2,
} from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HeadersType = Record<string, string>;

interface RequestProps {
  endpoint: string;
  code: string;
  method?: HttpMethod;
  headers?: HeadersType;
  body?: object;
  model?: string;
  modelLanguage?: string;
}

export function Request({
  endpoint,
  code,
  method = "GET",
  headers = {},
  body,
  model,
  modelLanguage = "typescript",
}: RequestProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedModel, setCopiedModel] = useState(false);

  async function handleRequest() {
    setLoading(true);
    setData(null);
    setError(null);
    setStatus(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          ...headers,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      const res = await fetch(endpoint, options);
      setStatus(res.status);

      try {
        const responseData = await res.json();
        setData(responseData);
      } catch {
        const text = await res.text();
        setData(text || "No response body");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, setter: (value: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const getBadgeVariant = (method: HttpMethod) => {
    const variants: Record<
      HttpMethod,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      GET: "secondary",
      POST: "default",
      PUT: "outline",
      DELETE: "destructive",
      PATCH: "secondary",
    };
    return variants[method];
  };

  const getStatusBadgeVariant = (status: number | null) => {
    if (!status) return "secondary";
    if (status >= 200 && status < 300) return "default";
    if (status >= 400) return "destructive";
    return "secondary";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col h-full gap-4">
        <article className="sticky top-30">
          <header className="mb-2">
            <h3 className="text-sm font-medium">Request</h3>
          </header>
          <div className="flex flex-row items-start gap-2 overflow-hidden mb-2">
            <Badge variant={getBadgeVariant(method)} className="uppercase">
              {method}
            </Badge>
            <p className="overflow-hidden text-sm break-words font-semibold">
              {endpoint.split("appwrite.global")[1]}
            </p>
          </div>
          <div className="code bg-background mb-2 overflow-hidden rounded-xl relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-2 z-10"
                    onClick={() => copyToClipboard(code, setCopied)}
                  >
                    {copied ? (
                      <LucideCheckCircle className="h-4 w-4" />
                    ) : (
                      <LucideClipboard className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SyntaxHighlighter
              language="javascript"
              style={coy}
              showLineNumbers={true}
              customStyle={{
                padding: "1rem",
                paddingInline: 0,
                paddingBlock: 0,
                margin: 0,
                marginBottom: 0,
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
          <footer className="p-0 mt-2">
            <Button size="sm" onClick={handleRequest} disabled={loading}>
              {loading && (
                <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
              )}
              Try it!
            </Button>
          </footer>
        </article>
      </div>
      <div className="flex flex-col h-full gap-4">
        {model && (
          <article>
            <header className="mb-2">
              <h3 className="text-sm font-medium">Model</h3>
            </header>
            <div className="code bg-background overflow-hidden rounded-xl relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2 z-10"
                      onClick={() => copyToClipboard(model, setCopiedModel)}
                    >
                      {copiedModel ? (
                        <LucideCheckCircle className="h-4 w-4" />
                      ) : (
                        <LucideClipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedModel ? "Copied!" : "Copy model"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <SyntaxHighlighter
                language={modelLanguage}
                style={coy}
                showLineNumbers={true}
                customStyle={{
                  padding: "1rem",
                  paddingInline: 0,
                  paddingBlock: 0,
                  margin: 0,
                  marginBottom: 0,
                }}
              >
                {model}
              </SyntaxHighlighter>
            </div>
          </article>
        )}
        {(data || error) && (
          <article>
            <header className="mb-2">
              <h4 className="text-sm font-medium">
                {error ? "Error Details" : "Response Body"}
              </h4>
            </header>
            <div>
              <Badge
                variant={getStatusBadgeVariant(status)}
                className="uppercase mb-2"
              >
                {error ? "Error" : `Status ${status}`}
              </Badge>
              {error ? (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-xl border-destructive">
                  <LucideAlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="code bg-background overflow-hidden rounded-xl relative">
                  {data && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="absolute right-2 top-2 z-10"
                            variant="secondary"
                            size="icon"
                            onClick={() =>
                              copyToClipboard(
                                typeof data === "string"
                                  ? data
                                  : JSON.stringify(data, null, 2),
                                setCopiedResponse
                              )
                            }
                          >
                            {copiedResponse ? (
                              <LucideCheckCircle className="h-4 w-4" />
                            ) : (
                              <LucideClipboard className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedResponse ? "Copied!" : "Copy response"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <SyntaxHighlighter
                    language="json"
                    style={coy}
                    showLineNumbers={true}
                    customStyle={{
                      padding: "1rem",
                      paddingInline: 0,
                      paddingBlock: 0,
                      margin: 0,
                      marginBottom: 0,
                    }}
                  >
                    {typeof data === "string"
                      ? data
                      : JSON.stringify(data, null, 2)}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
