
import { useRef, useState } from "react";
import OutsideForm from "../open/OutsideForm";

export default function Home() {
  const [value, setValue] = useState("");
  let formref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <OutsideForm formref={formref} handleSubmit={handleSubmit} value={value} setValue={setValue} />
      <button type="submit" form="submit-form" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        submit
      </button>
    </div>
  );
}