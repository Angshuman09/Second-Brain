import { useMemo, useState } from "react";

export function UseMemo() {
    const [countA, setCountA] = useState(0);
    const [countB, setCountB] = useState(0);
  
    // This only re-runs when countA changes
    const result = useMemo(() => {
      console.log("⚡ expensive calc running!");
      let total = 0;
      for (let i = 0; i <= countA * 1000; i++) total += i;
      return total;
    }, [countA]); // <-- dependency array
  
    return (
      <>
        <p>Result: {result}</p>
        <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 active:scale-95 transition" onClick={() => setCountA(c => c + 1)}>Increment A</button>
        <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 active:scale-95 transition" onClick={() => setCountB(c => c + 1)}>Increment B</button>
      </>
    );
  }