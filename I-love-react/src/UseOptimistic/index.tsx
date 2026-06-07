import { useState, useOptimistic } from "react";

// 1. A fake server function that takes 1.5 seconds to resolve
const saveTodoToDatabase = async (todoText:string) => {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  return todoText;
};

export function Optimistic() {
  // 2. The real database state (Source of Truth)
  const [todos, setTodos] = useState(["Buy groceries", "Walk the dog"]);

  // 3. The Optimistic state hook
  // It takes the real 'todos' and a function explaining how to instantly update them
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [...currentTodos, `${newTodo} (Sending...)`]
  );

  // 4. Form handler using React's native 'action' attribute
  const handleAction = async (formData:any) => {
    const newTodo = formData.get("todo");

    // STEP A: Instantly update the UI with the pending text
    addOptimisticTodo(newTodo);

    try {
      // STEP B: Send data to the fake server and wait
      const savedTodo = await saveTodoToDatabase(newTodo);

      // STEP C: Update the real state.
      // As soon as 'todos' updates, the optimistic state is automatically wiped out.
      setTodos((prev) => [...prev, savedTodo]);
    } catch (error) {
      console.error("Failed to save:", error);
      // If an error happens, we simply don't update 'setTodos'.
      // The "(Sending...)" item will automatically vanish on its own!
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "400px" }}>
      <h2>Easy useOptimistic Demo</h2>
      
      {/* Notice we use 'action' instead of 'onSubmit' */}
      <form action={handleAction} style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          name="todo" 
          placeholder="Type something and press Enter..." 
          required 
          style={{ padding: "8px", width: "70%" }}
        />
        <button type="submit" style={{ padding: "8px", marginLeft: "5px" }}>Add</button>
      </form>

      {/* CRUCIAL: We map over optimisticTodos, NOT the regular todos */}
      <ul style={{ lineHeight: "2" }}>
        {optimisticTodos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}