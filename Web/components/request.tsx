"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent, CardHeader } from "./ui/card";

export interface RequestProps {
  timestamp: string;
  headers: string;
  body: string;
  type: "get" | "post" | "put" | "patch" | "delete";
}

export function Request({ timestamp, headers, body, type }: RequestProps) {
  const headerObj: Record<string, string> | null = headers
    ? JSON.parse(headers)
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="h-full w-full bg-muted/25">
          <CardHeader className="mb-4 flex flex-row items-center justify-between gap-2 p-2">
            <div className="flex flex-row items-center gap-2">
              <Badge variant={type} className="uppercase">
                {type}
              </Badge>
              <p className="text-xs font-semibold text-muted-foreground">
                {timestamp}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="mb-4">
              <h4 className="mb-2 ml-2 text-sm font-semibold text-foreground">
                Headers
              </h4>
              <div className="overflow-x-auto rounded-xl border border-dashed bg-background">
                {headerObj && Object.keys(headerObj).length > 0 && (
                  <Table>
                    <TableBody>
                      {Object.entries(headerObj).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="whitespace-nowrap text-xs">
                            {key}
                          </TableCell>
                          <TableCell className="text-xs">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {(headerObj == null || Object.keys(headerObj).length === 0) && (
                  <p className="p-4 text-xs font-bold text-muted-foreground">
                    No header values found.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="mb-2 ml-2 text-sm font-semibold text-foreground">
                Body
              </h4>
              <div className="code rounded-xl border border-dashed bg-background p-4">
                {body ? (
                  <SyntaxHighlighter
                    language="js"
                    style={coy}
                    showLineNumbers={true}
                  >
                    {JSON.stringify(JSON.parse(body), null, 2)}
                  </SyntaxHighlighter>
                ) : (
                  <p className="text-xs font-bold text-muted-foreground">
                    No body data found.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
