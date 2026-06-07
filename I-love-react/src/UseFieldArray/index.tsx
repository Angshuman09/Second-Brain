import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type FormData = {
  numbers: { value: number }[];
};

function UseFieldArray() {
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      numbers: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "numbers" });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">useFieldArray (React Hook Form)</h2>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <span key={field.id} className="bg-gray-100 px-3 py-1 rounded">
            [{index}]{" "}
            <input
              {...register(`numbers.${index}.value`, { valueAsNumber: true })}
              type="number"
              className="w-16 bg-transparent outline-none"
            />
          </span>
        ))}
      </div>

      {/* Add */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter a number"
            className="border border-gray-300 rounded py-2 px-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                append({ value: Number((e.target as HTMLInputElement).value) });
                (e.target as HTMLInputElement).value = "";
              }
            }}
            ref={(el) => el}
            id="rhf-add-input"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("rhf-add-input") as HTMLInputElement;
              if (input.value !== "") {
                append({ value: Number(input.value) });
                input.value = "";
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Remove by index */}
        <div className="flex gap-2">
          <input
            id="rhf-remove-input"
            type="number"
            placeholder="Enter index to remove"
            className="border border-gray-300 rounded py-2 px-3"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("rhf-remove-input") as HTMLInputElement;
              const idx = Number(input.value);
              if (input.value !== "" && idx >= 0 && idx < fields.length) {
                remove(idx);
                input.value = "";
              }
            }}
            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Remove
          </button>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Submit
        </button>
      </form>
    </div>
  );
}

function NormalWay() {
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4, 5]);
  const [number, setNumber] = useState<number | "">("");
  const [removeIndex, setRemoveIndex] = useState<number | "">("");

  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Normal useState Way</h2>

      <div className="flex flex-wrap gap-2">
        {numbers.map((num, i) => (
          <span key={i} className="bg-gray-100 px-3 py-1 rounded">
            [{i}] {num}
          </span>
        ))}
      </div>

      {/* Add */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter a number"
          value={number}
          onChange={(e) => setNumber(e.target.value === "" ? "" : Number(e.target.value))}
          className="border border-gray-300 rounded py-2 px-3"
        />
        <button
          onClick={() => {
            if (number !== "") {
              setNumbers([...numbers, number]);
              setNumber("");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Remove by index */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter index to remove"
          value={removeIndex}
          onChange={(e) => setRemoveIndex(e.target.value === "" ? "" : Number(e.target.value))}
          className="border border-gray-300 rounded py-2 px-3"
        />
        <button
          onClick={() => {
            if (removeIndex !== "" && removeIndex >= 0 && removeIndex < numbers.length) {
              setNumbers(numbers.filter((_, i) => i !== removeIndex));
              setRemoveIndex("");
            }
          }}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function FieldLogic() {
  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8">
      <UseFieldArray />
      <NormalWay />
      <IsDirty/>
    </div>
  );
}

type SimpleData = {
  name: string;
};

function IsDirty() {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<SimpleData>({
    defaultValues: {
      name: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input className="border-gray-300 bg-pink-100 text-black rounded py-2 px-3" {...register("name")} placeholder="Name" />

      <p className="bg-red-100 text-black">Form dirty: {isDirty ? "Yes" : "No"}</p>

      <button type="submit">Submit</button>
    </form>
  );
}