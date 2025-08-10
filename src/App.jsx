import { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task List</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <span
              style={{
                textDecoration: task.done ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleTask(index)}
            >
              {task.text}
            </span>
            <button onClick={() => removeTask(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
