import { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time listener for user's tasks (fires after user is set)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribeTasks = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTasks(data);
      },
      (error) => {
        console.error("onSnapshot error:", error);
      }
    );

    return () => unsubscribeTasks();
  }, [user]);

  // Add new task
  const addTask = async () => {
    if (!taskText.trim() || !user) return;
    try {
      const tasksRef = collection(db, "users", user.uid, "tasks");
      await addDoc(tasksRef, {
        title: taskText.trim(),
        completed: false,
        createdAt: serverTimestamp()
      });
      setTaskText("");
    } catch (err) {
      console.error("addTask error:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "tasks", id));
    } catch (err) {
      console.error("deleteTask error:", err);
    }
  };

  // Toggle completion
  const toggleComplete = async (id, currentStatus) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (err) {
      console.error("toggleComplete error:", err);
    }
  };

  // Sign in/out helpers (with error logging)
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("signIn error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("signOut error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "640px", margin: "auto" }}>
      <h1>My Tasks</h1>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>Welcome, {user.displayName}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>

          <div style={{ marginTop: "18px", display: "flex", gap: "8px" }}>
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="New task..."
              style={{ flex: 1, padding: "8px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />
            <button onClick={addTask}>Add</button>
          </div>

          <ul style={{ marginTop: "20px", padding: 0, listStyle: "none" }}>
            {tasks.length === 0 ? (
              <li>No tasks yet.</li>
            ) : (
              tasks.map((task) => (
                <li
                  key={task.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "8px",
                    border: "1px solid #eee",
                    borderRadius: "6px"
                  }}
                >
                  <span
                    onClick={() => toggleComplete(task.id, !!task.completed)}
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    {task.title}
                  </span>
                  <div style={{ marginLeft: "12px", display: "flex", gap: "8px" }}>
                    <button onClick={() => toggleComplete(task.id, !!task.completed)}>
                      {task.completed ? "Undo" : "Done"}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>❌</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      ) : (
        <div>
          <p style={{ marginTop: 0 }}>Please sign in to manage your tasks.</p>
          <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
