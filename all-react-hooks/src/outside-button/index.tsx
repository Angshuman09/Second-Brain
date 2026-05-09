
import { useRef, useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");
  let formref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
  };
  return (
    <div>
      <form ref={formref} onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

      </form>

      <button onClick={()=>formref.current?.requestSubmit()}>submit</button>
    </div>
  );
}