import { Code } from "@/components/ui/code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface CodeData {
  title: string;
  code: string | null;
  language: string;
}

export function ApiRequestSnippit({
  code,
  title = "Request",
  endpoint,
}: {
  code: CodeData[];
  language?: string;
  title?: string;
  endpoint?: string;
}) {
  return (
    <article className="overflow-hidden rounded-xl border">
      <Tabs defaultValue={code[0].title} className="w-full gap-0">
        <header className="flex items-center justify-between py-1 pr-2 pl-4">
          <p className="text-sm font-bold">{title}</p>
          <TabsList className="bg-transparent hover:bg-transparent">
            {code.map((x, index) => (
              <TabsTrigger
                key={index}
                value={x.title}
                className="data-[state=active]:border-foreground rounded-none border-0 border-b-2 border-transparent pt-5.5 pb-5 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:dark:bg-transparent"
              >
                {x.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </header>
        {endpoint && (
          <div className="bg-muted/50 text-foreground/70 border-y p-2 px-4">
            <p className="flex gap-2 text-xs font-semibold">
              <span className="font-semibold text-green-600">GET</span>
              {endpoint.split(/(run|global)/)[2]}
            </p>
          </div>
        )}
        {code.map((x, index) => (
          <TabsContent key={index} value={x.title}>
            <Code code={x.code} language={x.language} />
          </TabsContent>
        ))}
      </Tabs>
    </article>
  );
}
