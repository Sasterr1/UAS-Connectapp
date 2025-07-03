"use client";

import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { supabase } from "@/lib/SupaBaseKoneksi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatistikCard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { data: riwayatData, error: riwayatError } = await supabase
        .from("riwayat")
        .select("*");

      const { data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*");

      if (riwayatError || todosError) {
        console.error("Gagal fetch data:", riwayatError || todosError);
        setIsLoading(false);
        return;
      }

      const semuaData = [
        ...riwayatData,
        ...(isFuture
          ? todosData.map((todo) => ({
              ...todo,
              status: "Belum",
              completed_at: todo.due_date,
            }))
          : []),
      ];

      setChartData(semuaData);
      setIsLoading(false);
    };

    fetchData();
  }, [timeRange]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate = new Date(today);
  let endDate = new Date(today);
  let isFuture = false;

  switch (timeRange) {
    case "7d":
      startDate.setDate(today.getDate() - 6);
      break;
    case "30d":
      startDate.setDate(today.getDate() - 29);
      break;
    case "7d-future":
      endDate.setDate(today.getDate() + 6);
      isFuture = true;
      break;
    case "30d-future":
      endDate.setDate(today.getDate() + 29);
      isFuture = true;
      break;
  }

  function generateDateRange(startDate, endDate) {
    const dateArray = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dateArray.push(current.toLocaleDateString("sv-SE"));
      current.setDate(current.getDate() + 1);
    }
    return dateArray;
  }

  const dateRange = generateDateRange(startDate, endDate);
  const grouped = {};

  chartData.forEach((item) => {
    if (!item.completed_at) return;
    const dateObj = new Date(item.due_date);
    if (isNaN(dateObj.getTime())) return;

    const date = dateObj.toLocaleDateString("sv-SE");
    if (!dateRange.includes(date)) return;

    if (!grouped[date]) {
      grouped[date] = { date, selesai: 0, gagal: 0, belum: 0 };
    }

    if (item.status === "Selesai") {
      grouped[date].selesai += 1;
    } else {
      if (isFuture) {
        grouped[date].belum += 1;
      } else {
        grouped[date].gagal += 1;
      }
    }
  });

  const fullData = dateRange.map((date) => ({
    date,
    selesai: grouped[date]?.selesai || 0,
    gagal: isFuture ? 0 : grouped[date]?.gagal || 0,
    belum: isFuture ? grouped[date]?.belum || 0 : 0,
  }));

  const chartConfig = {
    selesai: { label: "Selesai", color: "#bfdbfe" },
    gagal: { label: "Gagal", color: "#fecaca" },
    belum: { label: "Belum", color: "#fef08a" },
  };

  if (isLoading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60 mt-2" />
          </div>
          <Skeleton className="h-10 w-[160px] hidden sm:flex rounded-md" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Statistik Tugas</CardTitle>
          <CardDescription>
            Jumlah tugas selesai dan {isFuture ? "belum" : "gagal"} berdasarkan
            tanggal
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] sm:flex">
            <SelectValue placeholder="Pilih Rentang Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
            <SelectItem value="7d-future">7 Hari Mendatang</SelectItem>
            <SelectItem value="30d-future">30 Hari Mendatang</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={fullData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />
            <Area
              dataKey="selesai"
              type="monotone"
              stroke="#4ade80"
              fill="#4ade80"
              fillOpacity={0.3}
              stackId="a"
            />
            {!isFuture && (
              <Area
                dataKey="gagal"
                type="monotone"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                stackId="a"
              />
            )}
            {isFuture && (
              <Area
                dataKey="belum"
                type="monotone"
                stroke="#fb923c"
                fill="#fb923c"
                fillOpacity={0.3}
                stackId="a"
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
