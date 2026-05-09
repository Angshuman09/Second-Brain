import { useState } from "react";

const State = () => {
  const [value, setValue] = useState<number>(0);

  const handleClick = () => {
    setValue(prev => prev + 1); //asynchronous process
    console.log(value); // as setValue is asynchronous so it gives old values
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-5xl font-bold text-gray-800">
        value: {value}
      </p>

      <button
        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 active:scale-95 transition"
        onClick={handleClick}
      >
        Click
      </button>
    </div>
  );
};

export default State;
