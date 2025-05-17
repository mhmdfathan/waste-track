'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Loading from './loading';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { date: '2024-04-01', daurUlang: 222, nonDaurUlang: 150 },
  { date: '2024-04-02', daurUlang: 97, nonDaurUlang: 180 },
  { date: '2024-04-03', daurUlang: 167, nonDaurUlang: 120 },
  { date: '2024-04-04', daurUlang: 242, nonDaurUlang: 260 },
  { date: '2024-04-05', daurUlang: 373, nonDaurUlang: 290 },
  { date: '2024-04-06', daurUlang: 301, nonDaurUlang: 340 },
  { date: '2024-04-07', daurUlang: 245, nonDaurUlang: 180 },
  { date: '2024-04-08', daurUlang: 409, nonDaurUlang: 320 },
  { date: '2024-04-09', daurUlang: 59, nonDaurUlang: 110 },
  { date: '2024-04-10', daurUlang: 261, nonDaurUlang: 190 },
  { date: '2024-04-11', daurUlang: 327, nonDaurUlang: 350 },
  { date: '2024-04-12', daurUlang: 292, nonDaurUlang: 210 },
  { date: '2024-04-13', daurUlang: 342, nonDaurUlang: 380 },
  { date: '2024-04-14', daurUlang: 137, nonDaurUlang: 220 },
  { date: '2024-04-15', daurUlang: 120, nonDaurUlang: 170 },
  { date: '2024-04-16', daurUlang: 138, nonDaurUlang: 190 },
  { date: '2024-04-17', daurUlang: 446, nonDaurUlang: 360 },
  { date: '2024-04-18', daurUlang: 364, nonDaurUlang: 410 },
  { date: '2024-04-19', daurUlang: 243, nonDaurUlang: 180 },
  { date: '2024-04-20', daurUlang: 89, nonDaurUlang: 150 },
  { date: '2024-04-21', daurUlang: 137, nonDaurUlang: 200 },
  { date: '2024-04-22', daurUlang: 224, nonDaurUlang: 170 },
  { date: '2024-04-23', daurUlang: 138, nonDaurUlang: 230 },
  { date: '2024-04-24', daurUlang: 387, nonDaurUlang: 290 },
  { date: '2024-04-25', daurUlang: 215, nonDaurUlang: 250 },
  { date: '2024-04-26', daurUlang: 75, nonDaurUlang: 130 },
  { date: '2024-04-27', daurUlang: 383, nonDaurUlang: 420 },
  { date: '2024-04-28', daurUlang: 122, nonDaurUlang: 180 },
  { date: '2024-04-29', daurUlang: 315, nonDaurUlang: 240 },
  { date: '2024-04-30', daurUlang: 454, nonDaurUlang: 380 },
  { date: '2024-05-01', daurUlang: 165, nonDaurUlang: 220 },
  { date: '2024-05-02', daurUlang: 293, nonDaurUlang: 310 },
  { date: '2024-05-03', daurUlang: 247, nonDaurUlang: 190 },
  { date: '2024-05-04', daurUlang: 385, nonDaurUlang: 420 },
  { date: '2024-05-05', daurUlang: 481, nonDaurUlang: 390 },
  { date: '2024-05-06', daurUlang: 498, nonDaurUlang: 520 },
  { date: '2024-05-07', daurUlang: 388, nonDaurUlang: 300 },
  { date: '2024-05-08', daurUlang: 149, nonDaurUlang: 210 },
  { date: '2024-05-09', daurUlang: 227, nonDaurUlang: 180 },
  { date: '2024-05-10', daurUlang: 293, nonDaurUlang: 330 },
  { date: '2024-05-11', daurUlang: 335, nonDaurUlang: 270 },
  { date: '2024-05-12', daurUlang: 197, nonDaurUlang: 240 },
  { date: '2024-05-13', daurUlang: 197, nonDaurUlang: 160 },
  { date: '2024-05-14', daurUlang: 448, nonDaurUlang: 490 },
  { date: '2024-05-15', daurUlang: 473, nonDaurUlang: 380 },
  { date: '2024-05-16', daurUlang: 338, nonDaurUlang: 400 },
  { date: '2024-05-17', daurUlang: 499, nonDaurUlang: 420 },
  { date: '2024-05-18', daurUlang: 315, nonDaurUlang: 350 },
  { date: '2024-05-19', daurUlang: 235, nonDaurUlang: 180 },
  { date: '2024-05-20', daurUlang: 177, nonDaurUlang: 230 },
  { date: '2024-05-21', daurUlang: 82, nonDaurUlang: 140 },
  { date: '2024-05-22', daurUlang: 81, nonDaurUlang: 120 },
  { date: '2024-05-23', daurUlang: 252, nonDaurUlang: 290 },
  { date: '2024-05-24', daurUlang: 294, nonDaurUlang: 220 },
  { date: '2024-05-25', daurUlang: 201, nonDaurUlang: 250 },
  { date: '2024-05-26', daurUlang: 213, nonDaurUlang: 170 },
  { date: '2024-05-27', daurUlang: 420, nonDaurUlang: 460 },
  { date: '2024-05-28', daurUlang: 233, nonDaurUlang: 190 },
  { date: '2024-05-29', daurUlang: 78, nonDaurUlang: 130 },
  { date: '2024-05-30', daurUlang: 340, nonDaurUlang: 280 },
  { date: '2024-05-31', daurUlang: 178, nonDaurUlang: 230 },
  { date: '2024-06-01', daurUlang: 178, nonDaurUlang: 200 },
  { date: '2024-06-02', daurUlang: 470, nonDaurUlang: 410 },
  { date: '2024-06-03', daurUlang: 103, nonDaurUlang: 160 },
  { date: '2024-06-04', daurUlang: 439, nonDaurUlang: 380 },
  { date: '2024-06-05', daurUlang: 88, nonDaurUlang: 140 },
  { date: '2024-06-06', daurUlang: 294, nonDaurUlang: 250 },
  { date: '2024-06-07', daurUlang: 323, nonDaurUlang: 370 },
  { date: '2024-06-08', daurUlang: 385, nonDaurUlang: 320 },
  { date: '2024-06-09', daurUlang: 438, nonDaurUlang: 480 },
  { date: '2024-06-10', daurUlang: 155, nonDaurUlang: 200 },
  { date: '2024-06-11', daurUlang: 92, nonDaurUlang: 150 },
  { date: '2024-06-12', daurUlang: 492, nonDaurUlang: 420 },
  { date: '2024-06-13', daurUlang: 81, nonDaurUlang: 130 },
  { date: '2024-06-14', daurUlang: 426, nonDaurUlang: 380 },
  { date: '2024-06-15', daurUlang: 307, nonDaurUlang: 350 },
  { date: '2024-06-16', daurUlang: 371, nonDaurUlang: 310 },
  { date: '2024-06-17', daurUlang: 475, nonDaurUlang: 520 },
  { date: '2024-06-18', daurUlang: 107, nonDaurUlang: 170 },
  { date: '2024-06-19', daurUlang: 341, nonDaurUlang: 290 },
  { date: '2024-06-20', daurUlang: 408, nonDaurUlang: 450 },
  { date: '2024-06-21', daurUlang: 169, nonDaurUlang: 210 },
  { date: '2024-06-22', daurUlang: 317, nonDaurUlang: 270 },
  { date: '2024-06-23', daurUlang: 480, nonDaurUlang: 530 },
  { date: '2024-06-24', daurUlang: 132, nonDaurUlang: 180 },
  { date: '2024-06-25', daurUlang: 141, nonDaurUlang: 190 },
  { date: '2024-06-26', daurUlang: 434, nonDaurUlang: 380 },
  { date: '2024-06-27', daurUlang: 448, nonDaurUlang: 490 },
  { date: '2024-06-28', daurUlang: 149, nonDaurUlang: 200 },
  { date: '2024-06-29', daurUlang: 103, nonDaurUlang: 160 },
  { date: '2024-06-30', daurUlang: 446, nonDaurUlang: 400 },
];

const chartConfig = {
  daurUlang: {
    label: 'Daur Ulang',
    color: 'hsl(140, 74%, 44%)',
  },
  nonDaurUlang: {
    label: 'Non Daur Ulang',
    color: 'hsl(140, 74%, 44%)',
  },
} satisfies ChartConfig;

export default function StatisticsPage() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('daurUlang');

  const total = React.useMemo(
    () => ({
      daurUlang: chartData.reduce((acc, curr) => acc + curr.daurUlang, 0),
      nonDaurUlang: chartData.reduce((acc, curr) => acc + curr.nonDaurUlang, 0),
    }),
    [],
  );
  return (
    <Suspense fallback={<Loading />}>
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Statistics
          </h1>
          <p className="text-muted-foreground">
            Track and analyze your waste management data
          </p>
        </div>
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Bar Chart - Interactive</CardTitle>
              <CardDescription>
                Showing total visitors for the last 3 months
              </CardDescription>
            </div>
            <div className="flex">
              {['daurUlang', 'nonDaurUlang'].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key as keyof typeof total].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>{' '}
      </div>
    </Suspense>
  );
}
