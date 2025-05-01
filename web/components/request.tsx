"use client";

import { LucideLoader2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiRequestSnippit, CodeData } from "@/components/ui/code-snippit";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HeadersType = Record<string, string>;

interface RequestProps {
  endpoint: string;
  code: CodeData[];
  method?: HttpMethod;
  headers?: HeadersType;
  body?: object;
  model?: CodeData[];
  children?: React.ReactNode;
}

export function Request({
  endpoint,
  code,
  method = "GET",
  headers = {},
  body,
  model,
  children,
}: RequestProps) {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);
    setData(null);
    setError(null);

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

  return (
    <div>
      <div className="mb-4 flex flex-row items-center gap-4">
        <Badge variant={getBadgeVariant(method)} className="uppercase">
          {method}
        </Badge>
        <p className="text-muted-foreground overflow-hidden text-sm font-semibold break-words">
          {endpoint.split(/(run|global|com)/)[2]}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {children}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRequest}
              disabled={loading}
              className="mt-2"
            >
              {loading && (
                <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
              )}
              Send Request
            </Button>
          </div>
          {model && (
            <ApiRequestSnippit title="Model" code={model} language="js" />
          )}
        </div>
        <div className="flex h-full flex-col gap-4">
          <ApiRequestSnippit code={code} endpoint={endpoint} language="js" />
          {(data || error) && (
            <ApiRequestSnippit
              code={[{ title: "JS", language: "js", code: data }]}
              title="Response"
            />
          )}
        </div>
      </div>
    </div>
  );
}
