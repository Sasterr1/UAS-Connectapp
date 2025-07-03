"use client";

import React, { useEffect, useState } from "react";
import StatistikCard from "@/components/ui/statistik-diagram";
import { supabase } from "@/lib/SupaBaseKoneksi";
import { Skeleton } from "@/components/ui/skeleton";

export default function Statistik() {
  const [totalTugas, setTotalTugas] = useState(0);
  const [tugasSelesai, setTugasSelesai] = useState(0);
  const [tugasBelumSelesai, setTugasBelumSelesai] = useState(0);
  const [tugasGagal, setTugasGagal] = useState(0);
  const [persentase, setPersentase] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*");
      const { data: riwayatData, error: riwayatError } = await supabase
        .from("riwayat")
        .select("*");

      if (todosError || riwayatError) {
        console.error("Gagal mengambil data:", todosError || riwayatError);
        return;
      }

      const total = todosData.length + riwayatData.length;
      const selesai = riwayatData.filter(
        (item) => item.status === "Selesai"
      ).length;
      const gagal = riwayatData.filter(
        (item) => item.status === "Gagal"
      ).length;
      const belumSelesai = todosData.length;
      const persen = total > 0 ? Math.round((selesai / total) * 100) : 0;

      setTotalTugas(total);
      setTugasSelesai(selesai);
      setTugasGagal(gagal);
      setTugasBelumSelesai(belumSelesai);
      setPersentase(persen);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const cardData = [
    {
      label: "JUMLAH TUGAS",
      value: totalTugas,
      bg: "bg-gray-200",
    },
    {
      label: "PERSENTASE\nTUGAS SELESAI",
      value: `${persentase}%`,
      bg: "bg-green-200",
    },
    {
      label: "TUGAS SELESAI",
      value: tugasSelesai,
      bg: "bg-green-400",
    },
    {
      label: "TUGAS BELUM\nSELESAI",
      value: tugasBelumSelesai,
      bg: "bg-orange-400",
    },
    {
      label: "TUGAS GAGAL",
      value: tugasGagal,
      bg: "bg-red-500",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">📈 Statistik</h1>

      <div className="flex gap-6 flex-wrap justify-center">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-52 h-40 bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-center items-center"
              >
                <Skeleton className="h-10 w-16 mb-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          : cardData.map((card, i) => (
              <div
                key={i}
                className={`w-52 h-40 ${card.bg} text-center p-4 rounded-lg shadow`}
              >
                <div className="text-4xl font-bold">{card.value}</div>
                <div className="mt-2 text-sm font-medium tracking-wide whitespace-pre-line">
                  {card.label}
                </div>
              </div>
            ))}
      </div>

      {isLoading ? (
        <div className="mt-8">
        </div>
      ) : (
        <StatistikCard />
      )}
    </div>
  );
}
