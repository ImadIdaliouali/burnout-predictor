"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  CheckCircle,
  LightbulbIcon,
  Moon,
  TrendingUp,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const sleepData = [
  { day: "Mon", hours: 7.5 },
  { day: "Tue", hours: 6.8 },
  { day: "Wed", hours: 7.2 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 7.5 },
  { day: "Sat", hours: 8.5 },
  { day: "Sun", hours: 7.8 },
];

const stressData = [
  { day: "Mon", level: 65 },
  { day: "Tue", level: 59 },
  { day: "Wed", level: 80 },
  { day: "Thu", level: 81 },
  { day: "Fri", level: 56 },
  { day: "Sat", level: 55 },
  { day: "Sun", level: 40 },
];

const burnoutRiskData = [
  { name: "Low", value: 30 },
  { name: "Moderate", value: 45 },
  { name: "High", value: 25 },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("weekly");
  const userName = "Imad"; // This should be dynamically set based on the logged-in user

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container px-4 py-4 mx-auto">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Burnout Predictor
            </Link>
            <Button
              variant="destructive"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container p-4 mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="text-primary">{userName}!</span>
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your well-being metrics
            </p>
          </div>
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SleepScoreCard score={78} insight="Good Sleep Quality" />
          <StressScoreCard score={65} insight="Moderate Stress" />
          <BurnoutRiskMeter risk={0.4} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TrendChart
            title="Sleep Trend"
            data={sleepData}
            dataKey="hours"
            timeframe={timeframe}
            color="hsl(var(--primary))"
          />
          <TrendChart
            title="Stress Trend"
            data={stressData}
            dataKey="level"
            timeframe={timeframe}
            color="hsl(var(--destructive))"
          />
        </div>

        <InsightsSection />
      </main>
    </div>
  );
}

function TimeframeSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SleepScoreCard({ score, insight }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Sleep Score</CardTitle>
        <Moon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}/100</div>
        <p className="text-xs text-muted-foreground">{insight}</p>
        <div className="h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepData}>
              <Area
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function StressScoreCard({ score, insight }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Stress Score</CardTitle>
        <Brain className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}/100</div>
        <p className="text-xs text-muted-foreground">{insight}</p>
        <div className="h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stressData}>
              <Bar dataKey="level" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function BurnoutRiskMeter({ risk }) {
  const riskPercentage = Math.round(risk * 100);
  const riskLevel = risk < 0.3 ? "Low" : risk < 0.7 ? "Moderate" : "High";
  const riskColor =
    risk < 0.3
      ? "hsl(var(--success))"
      : risk < 0.7
      ? "hsl(var(--warning))"
      : "hsl(var(--destructive))";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Burnout Risk</CardTitle>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: riskColor }}>
          {riskLevel}
        </div>
        <p className="text-xs text-muted-foreground">
          Current Risk: {riskPercentage}%
        </p>
        <div className="h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burnoutRiskData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={riskColor}
                fill={riskColor}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendChart({ title, data, dataKey, timeframe, color }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Line type="monotone" dataKey={dataKey} stroke={color} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function InsightsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <LightbulbIcon className="w-6 h-6 text-yellow-500" />
        <CardTitle>Personalized Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <InsightItem>Take a 15-minute walk to reduce stress.</InsightItem>
          <InsightItem>Aim for 7-8 hours of sleep tonight.</InsightItem>
          <InsightItem>
            Practice deep breathing exercises before bed to improve sleep
            quality.
          </InsightItem>
          <InsightItem>
            Consider scheduling short breaks throughout your workday to prevent
            burnout.
          </InsightItem>
        </ul>
      </CardContent>
    </Card>
  );
}

function InsightItem({ children }) {
  return (
    <li className="flex items-center space-x-2">
      <CheckCircle className="w-5 h-5 text-primary" />
      <span>{children}</span>
    </li>
  );
}
