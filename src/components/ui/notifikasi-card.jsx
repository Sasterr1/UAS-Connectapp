'use client'
export default function NotifikasiCard({ notif }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-sm border">
      <div className="text-base break-words">{notif.pesan}</div>
      <div className="text-sm text-gray-500">
        {new Date(notif.waktu).toLocaleString("id-ID")}
      </div>
    </div>
  )
}
