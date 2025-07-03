"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupaBaseKoneksi";
import NotifikasiCard from "@/components/ui/notifikasi-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotifikasiPage() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      const { data, error } = await supabase
        .from("notifikasi")
        .select("*")
        .order("waktu", { ascending: false });

      if (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } else {
        setNotifikasi(data);
      }
      setIsLoading(false);
    };

    fetchNotifikasi();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6">🔔 Notification</h1>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded shadow-sm border">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))
        ) : notifikasi.length === 0 ? (
          <p className="text-gray-500">Belum ada notifikasi.</p>
        ) : (
          notifikasi.map((notif) => (
            <NotifikasiCard key={notif.id_notifikasi} notif={notif} />
          ))
        )}
      </div>
    </div>
  );
}
