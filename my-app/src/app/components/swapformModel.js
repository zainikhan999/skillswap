"use client";
import { useEffect, useState } from "react";

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  currentUser, // still available if needed, but not used here now
  onSubmit,
}) {
  const [taskName, setTaskName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUserFromStorage(parsedUser.userName || ""); // Get userName
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, []); // run only once on mount
  const handleSubmit = () => {
    onSubmit({
      currentUser: currentUserFromStorage, // send stored user
      recipient,
      taskName,
      timeRequired,
      description,
      deadline,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Swap Details</h2>

        <label className="block mb-2">
          <span className="text-sm font-medium">You (Sender)</span>
          <input
            type="text"
            value={currentUserFromStorage}
            readOnly
            className="w-full p-2 rounded bg-gray-100"
          />
        </label>

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
          <span className="text-sm font-medium">Time Required (in hours)</span>
          <input
            type="number"
            min="0"
            step="0.5"
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

        <label className="block mb-4">
          <span className="text-sm font-medium">Deadline</span>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
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
