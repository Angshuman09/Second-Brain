"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function Callback() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleCount = useCallback(() => {
    console.log("count:", count);
  }, [count]); // only recreates when count changes

  // 👇 Store the previous function reference
  const prevRef = useRef<typeof handleCount | null>(null);

  useEffect(() => {
    if (prevRef.current === null) {
      console.log("🟡 First render — function created for the first time");
    } else if (prevRef.current === handleCount) {
      console.log("✅ Same function reference — NOT recreated");
    } else {
      console.log("🔴 New function reference — RECREATED");
    }

    // Update ref to current function
    prevRef.current = handleCount;
  });  // 👈 no dependency array = runs after every render

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <button className="bg-red-400 p-3 rounded-xl" onClick={() => setCount(c => c + 1)}>
        Change Count: {count}
      </button>
      <input
      className="bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here (won't recreate function)"
      />
    </div>
  );
}