'use client'
import { IconCircleX } from "@tabler/icons-react";

export default function ToDoCard({ todo, onStatusChange }) {
  const deadlinePassed =
    new Date(todo.due_date) < new Date() && !todo.is_completed;

  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-4 py-3 text-left break-words w-1/4 max-w-xs">
        {todo.title}
      </td>
      <td className="border px-4 py-3 text-left break-words w-2/4 max-w-md">
        {todo.description}
      </td>
      <td className="border px-4 py-3 text-center w-1/8">
        {deadlinePassed ? (
          <span className="text-red-700 font-semibold flex items-center justify-center gap-1 text-sm">
            <IconCircleX className="size-4" />
            Gagal
          </span>
        ) : (
          <select
            value={todo.is_completed ? "Selesai" : "Belum"}
            onChange={(e) => onStatusChange(todo.id_todo, e.target.value)}
            className={`rounded px-2 py-1 border text-sm ${
              todo.is_completed ? "text-green-600" : "text-red-500"
            }`}
          >
            <option value="Belum">❌ Belum</option>
            <option value="Selesai">✅ Selesai</option>
          </select>
        )}
      </td>
      <td className="border px-4 py-3 text-center w-1/8 text-sm">
        {todo.due_date}
      </td>
    </tr>
  );
}
