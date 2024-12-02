"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "Requests",
  },
  requests: {
    label: "Requests",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export interface ChartData {
  date: string;
  requests: number;
}

export function RequestsChart({ data }: { data: ChartData[] }) {
  const total = React.useMemo(
    () => ({
      requests: data.reduce((acc, curr) => acc + curr.requests, 0),
    }),
    [data],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-dashed p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-2">
          <CardTitle>Portfolio Requests</CardTitle>
          <CardDescription className="text-xs">
            Showing total requests by the hour
          </CardDescription>
        </div>
        <div className="relative z-30 flex flex-none flex-col justify-center gap-1 border-t border-dashed bg-muted/50 px-6 py-2 text-left even:border-l sm:border-l sm:border-t-0">
          <span className="text-xs text-muted-foreground">
            {chartConfig.requests.label}
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {total.requests.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[125px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(`${value}:00:00+00:00`);
                return date.toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="requests"
                  labelFormatter={(value) => {
                    return new Date(`${value}:00:00+00:00`).toLocaleDateString(
                      "en-US",
                      {
                        timeZone: "UTC",
                        hour12: false,
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      },
                    );
                  }}
                />
              }
            />
            <Area
              dataKey="requests"
              type="step"
              fill="var(--color-requests)"
              fillOpacity={0.4}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
