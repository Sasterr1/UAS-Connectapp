"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupaBaseKoneksi";
import HistoryCard from "@/components/ui/history-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const [todos, setriwayat] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase.from("riwayat").select("*");

      if (error) {
        console.error("Gagal fetch:", error);
      } else {
        console.log("Data berhasil diambil:", data);
        setriwayat(data);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  const filteredTodos = todos.filter((item) => {
    if (filterStatus === "Semua") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📃 History</h1>
      </div>

      <div className="mb-4 flex gap-2">
        {["Semua", "Selesai", "Gagal"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded border ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-base border border-gray-300 rounded-lg">
  <thead className="bg-gray-100">
    <tr>
      <th className="text-center px-4 py-3 font-bold border w-1/4 break-words">
        Judul Tugas
      </th>
      <th className="text-center px-4 py-3 font-bold border w-2/5 break-words">
        Deskripsi
      </th>
      <th className="text-center px-4 py-3 font-bold border w-1/6 break-words">
        Status
      </th>
      <th className="text-center px-4 py-3 font-bold border w-1/6 break-words">
        Deadline
      </th>
    </tr>
  </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 25 }).map((_, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                  <td className="border px-4 py-2">
                    <Skeleton className="h-4 w-5/6" />
                  </td>
                  <td className="border px-4 py-2">
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </td>
                  <td className="border px-4 py-2">
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </td>
                </tr>
              ))
            ) : filteredTodos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak ada riwayat dengan status "{filterStatus}".
                </td>
              </tr>
            ) : (
              filteredTodos.map((riwayat) => (
                <HistoryCard key={riwayat.id_riwayat} riwayat={riwayat} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
