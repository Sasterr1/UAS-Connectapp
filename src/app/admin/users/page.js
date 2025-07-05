'use client';
import { useState } from "react";
import UserCard from "@/components/ui/user-card";
import {
  IconPlus,
} from "@tabler/icons-react";
import useSWR from "swr";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const {
    data: users,
    error,
    isLoading
  } = useSWR('https://jsonplaceholder.typicode.com/users', fetcher);

  if (isLoading) {
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Gagal Mengambil Data</p>
      </div>
    );
  }

  // Filter berdasarkan nama atau email
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="container" className="flex h-screen justify-center">
      <section id="content" className="bg-white w-[100%] p-5">
        <input
          placeholder="Cari user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex w-[98%] h-[5vh] mb-5 p-4 text-sm border border-gray-300 rounded-[7px]"
        />

        {filteredUsers.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            email={user.email}
            roles={user.username}

          />
        ))}
      </section>
      <button className="fixed bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center ">
        <IconPlus />
      </button>
    </section>
  );
}
