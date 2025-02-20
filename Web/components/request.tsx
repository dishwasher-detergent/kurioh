"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LucideLoader2 } from "lucide-react";
import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export function Request({
  endpoint,
  code,
}: {
  endpoint: string;
  code: string;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    const res = await fetch(endpoint);
    const data = await res.json();
    setData(data);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-start gap-2 overflow-hidden">
            <Badge variant="get" className="text-white uppercase">
              GET
            </Badge>
            <p className="overflow-hidden text-sm break-words">{endpoint}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="code bg-background mb-2 rounded-xl border border-dashed pt-2">
            <SyntaxHighlighter
              language="javascript"
              style={coy}
              showLineNumbers={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" onClick={getData} disabled={loading}>
            {loading && (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            )}
            Try it!
          </Button>
        </CardFooter>
      </Card>
      {data && (
        <Card className="bg-muted/25 h-full w-full">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Badge variant="get" className="text-white uppercase">
                Status 200
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="text-foreground mb-2 ml-2 text-sm font-semibold">
              Body
            </h4>
            <div className="code bg-background rounded-xl border border-dashed pt-2">
              <SyntaxHighlighter
                language="js"
                style={coy}
                showLineNumbers={true}
              >
                {JSON.stringify(data, null, 2)}
              </SyntaxHighlighter>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
