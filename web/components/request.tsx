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
  const [data, setData] = useState<string | null>(null);
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
      "get" | "post" | "put" | "patch" | "delete"
    > = {
      GET: "get",
      POST: "post",
      PUT: "put",
      PATCH: "patch",
      DELETE: "delete",
    };
    return variants[method];
  };

  const getStatusBadgeVariant = (status: number | null) => {
    if (!status) return "secondary";
    if (status >= 200 && status < 300) return "secondary";
    if (status >= 400) return "destructive";
    return "secondary";
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <article>
          <div className="flex flex-row items-center justify-between gap-2 overflow-hidden">
            <div className="flex flex-row items-center gap-2">
              <Badge variant={getBadgeVariant(method)} className="uppercase">
                {method}
              </Badge>
              <p className="overflow-hidden text-sm font-semibold break-words">
                {endpoint.split("appwrite.run")[1]}
              </p>
            </div>
            <Button size="sm" onClick={handleRequest} disabled={loading}>
              {loading && (
                <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
              )}
              Send
            </Button>
          </div>
        </article>
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
                className="mb-2 uppercase"
              >
                {error ? "Error" : `Status ${status}`}
              </Badge>
              {error ? (
                <div className="bg-destructive/10 text-destructive border-destructive flex items-start gap-2 rounded-xl p-3">
                  <LucideAlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="code bg-background relative overflow-hidden rounded-xl border">
                  {data && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="absolute top-2 right-2 z-10"
                            variant="secondary"
                            size="icon"
                            onClick={() =>
                              copyToClipboard(
                                typeof data === "string"
                                  ? data
                                  : JSON.stringify(data, null, 2),
                                setCopiedResponse,
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
      <div className="flex h-full flex-col gap-4">
        <article>
          <header className="mb-2">
            <Badge variant="secondary">JavaScript</Badge>
          </header>
          <div className="code bg-background relative mb-2 overflow-hidden rounded-xl border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
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
        </article>
        {model && (
          <article>
            <header className="mb-2">
              <Badge variant="secondary">STATUS 200</Badge>
            </header>
            <div className="code bg-background relative overflow-hidden rounded-xl border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
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
      </div>
    </div>
  );
}
