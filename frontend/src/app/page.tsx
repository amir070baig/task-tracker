// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:5000/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id: number, completed: boolean) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">📝 Task Tracker</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
          >
            <span
              onClick={() => toggleTask(task.id, task.completed)}
              className={`cursor-pointer ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
