"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupaBaseKoneksi";
import ToDoCard from "@/components/ui/todolist-card";
import { IconPlus } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);

const simpanNotifikasi = async (pesan) => {
  const { data: existing, error } = await supabase
    .from("notifikasi")
    .select("id_notifikasi")
    .eq("pesan", pesan)
    .maybeSingle();

  if (error) {
    console.error("Gagal cek notifikasi:", error);
    return;
  }

  if (existing) return;

   const waktu = new Date().toISOString();

  const { error: insertError } = await supabase
    .from("notifikasi")
    .insert([{ pesan, waktu }]);

  if (insertError) {
    console.error("Gagal menyimpan notifikasi:", insertError);
  }
};


  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("is_completed", false);
      if (error) console.error("Gagal fetch:", error);
      else {
        setTodos(data);
        checkTaskStatus(data);
      }
      setIsLoading(false);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.title || !newTodo.due_date) {
      alert("Judul dan Deadline wajib diisi!");
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .insert([newTodo])
      .select();
    if (error) {
      console.error("Gagal menambah todo:", error);
      return;
    }

    setTodos([...todos, ...data]);
    setNewTodo({ title: "", description: "", due_date: "" });
    setShowForm(false);

    await simpanNotifikasi(
      `📌Tugas baru "${newTodo.title}" telah ditambahkan 🆕`
    );
  };

  const checkTaskStatus = async (todoList) => {
    const now = new Date();

    for (const todo of todoList) {
      const deadline = new Date(todo.due_date);
      const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);

      if (diffDays <= 2 && diffDays >= 0) {
        await simpanNotifikasi(
          `⏰ Deadline tugas "${todo.title}" tinggal ${Math.ceil(
            diffDays
          )} hari lagi!`
        );
      }
          if (diffDays < 0 && todo.status !== "selesai") {
      await simpanNotifikasi(
        `⚠️ Deadline tugas "${todo.title}" telah lewat!`,
        todo.id_todo,
        "gagal"
      );
    }

      if (deadline < now) {
        const { data: existing, error: checkError } = await supabase
          .from("riwayat")
          .select("id_todo")
          .eq("id_todo", todo.id_todo)
          .maybeSingle();

        if (checkError) {
          console.error("Gagal cek riwayat:", checkError);
          continue;
        }

        if (existing) continue;

        await supabase.from("riwayat").insert({
          id_todo: todo.id_todo,
          title: todo.title,
          description: todo.description,
          due_date: todo.due_date,
          completed_at: now.toISOString(),
          status: "Gagal",
        });

        await simpanNotifikasi(`Tugas "${todo.title}" gagal diselesaikan ❌`);
        await supabase.from("todos").delete().eq("id_todo", todo.id_todo);
        setTodos((prev) => prev.filter((t) => t.id_todo !== todo.id_todo));
      }
    }
  };

  const handleStatusChange = async (id, newValue) => {
    if (newValue === "Selesai") {
      const confirmed = window.confirm(
        "Apakah kamu yakin ingin menandai tugas ini sebagai selesai?"
      );
      if (!confirmed) return;
    }

    const { data: selectedTodo, error: fetchError } = await supabase
      .from("todos")
      .select("*")
      .eq("id_todo", id)
      .single();
    if (fetchError) {
      console.error("Gagal mengambil data:", fetchError);
      return;
    }

    const { error: insertError } = await supabase.from("riwayat").insert({
      id_todo: selectedTodo.id_todo,
      title: selectedTodo.title,
      description: selectedTodo.description,
      due_date: selectedTodo.due_date,
      completed_at: new Date().toISOString(),
      status: "Selesai",
    });

    if (insertError) {
      console.error("Gagal memindahkan ke riwayat:", insertError);
      return;
    }

    await simpanNotifikasi(
      `Tugas "${selectedTodo.title}" telah diselesaikan ✅`
    );

    const { error: deleteError } = await supabase
      .from("todos")
      .delete()
      .eq("id_todo", id);
    if (deleteError) {
      console.error("Gagal menghapus dari todos:", deleteError);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id_todo !== id));
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 To-Do List</h1>
      </div>

      <table className="w-full text-base border border-gray-300 rounded-lg table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-center px-4 py-3 font-bold border w-1/4 break-words">
              Judul Tugas
            </th>
            <th className="text-center px-4 py-3 font-bold border w-2/4 break-words">
              Deskripsi
            </th>
            <th className="text-center px-4 py-3 font-bold border w-1/8 break-words">
              Status
            </th>
            <th className="text-center px-4 py-3 font-bold border w-1/8 break-words">
              Deadline
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {[1, 2, 3, 4].map((j) => (
                  <td key={j} className="px-4 py-3 border text-center">
                    <Skeleton className="h-6 w-full mx-auto" />
                  </td>
                ))}
              </tr>
            ))
          ) : todos.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-10 text-lg text-gray-500"
              >
                🎉 HORE! Belum ada tugas yang harus dikerjakan.
              </td>
            </tr>
          ) : (
            todos.map((todo) => (
              <ToDoCard
                key={todo.id_todo}
                todo={todo}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tambah To-Do</h2>
            <input
              type="text"
              placeholder="Judul Tugas"
              className="w-full border p-2 mb-2 rounded"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
            />
            <textarea
              placeholder="Deskripsi"
              className="w-full border p-2 mb-2 rounded"
              rows={4}
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full border p-2 mb-4 rounded"
              value={newTodo.due_date}
              onChange={(e) =>
                setNewTodo({ ...newTodo, due_date: e.target.value })
              }
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddTodo}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-10 right-12 bg-black hover:bg-gray-500 text-xl w-18 h-18 rounded-full flex items-center justify-center shadow"
      >
        <IconPlus className="text-white size-9" />
      </button>
    </div>
  );
}
