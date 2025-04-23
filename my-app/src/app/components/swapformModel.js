"use client";
import { useState } from "react";

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}) {
  const [taskName, setTaskName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = () => {
    onSubmit({
      recipient,
      taskName,
      timeRequired,
      description,
      deadline,
      priority,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Swap Details</h2>

        <label className="block mb-2">
          <span className="text-sm font-medium">Exchange User</span>
          <input
            type="text"
            value={recipient}
            readOnly
            className="w-full p-2 rounded bg-gray-100"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Task Name</span>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Time Required</span>
          <input
            type="text"
            value={timeRequired}
            onChange={(e) => setTimeRequired(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Deadline</span>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
