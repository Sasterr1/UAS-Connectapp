'use client'
export default function HistoryCard({ riwayat }) {
  return (
<tr className="hover:bg-gray-50">
  <td className="border px-4 py-3 whitespace-normal break-words w-1/4">{riwayat.title}</td>
  <td className="border px-4 py-3 whitespace-normal break-words w-2/5">{riwayat.description}</td>
  <td className="border px-4 py-3 text-center whitespace-normal break-words w-1/6">
    {riwayat.status === "Gagal" ? (
      <span className="text-red-600">❌ Gagal</span>
    ) : (
      <span className="text-green-600">✅ Selesai</span>
    )}
  </td>
  <td className="border px-4 py-3 whitespace-normal break-words w-1/6 text-center">{riwayat.due_date}</td>
</tr>

  );
}
