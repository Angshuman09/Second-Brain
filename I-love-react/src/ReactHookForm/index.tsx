import React from "react";
import { useState } from "react";
import { useForm, type SubmitHandler, type Path, type UseFormRegister } from "react-hook-form";
type Inputs = {
  example: string;
  exampleRequired: string;
};

const HookForm = () => {
    const {register, handleSubmit, watch, formState: {errors}} = useForm<Inputs>();
    const onsubmit: SubmitHandler<Inputs> = (data)=> console.log(data);

    console.log(watch("example"))
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div className="flex flex-col items-center justify-center gap-10">
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4">
      {/* register your input into the hook by invoking the "register" function */}
      <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="test" {...register("example")}/>

      {/* include validation with required or other standard HTML validation rules */}
      <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("exampleRequired", {required: true})}/>
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span className="text-red-500">This field is required</span>}

      <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit" />
    </form>
    <NormalForm/>
    <InfoForm/>
    <AnotherInfoForm/>
    </div>
  )
};

export default HookForm;

const NormalForm = ()=>{
    const [example, setExample] = useState("test");
    const [exampleRequired, setExampleRequired] = useState("");
    const [errors, setErrors] = useState<{exampleRequired?: string}>({});
    const OnSubmit = (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        if(!example || !exampleRequired){ 
            setErrors({
                exampleRequired: "This field is required"
            });
            return;
        }
        console.log({example, exampleRequired});
    };

    const handleTestChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setExample(e.target.value);
        console.log(e.target.value);
    }
    return(
        <form className="flex flex-col gap-4" onSubmit={OnSubmit}>
           <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value = {example} onChange={handleTestChange} />           <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value = {exampleRequired} onChange={(e) => setExampleRequired(e.target.value)} />
           {errors.exampleRequired && <span className="text-red-500">{errors.exampleRequired}</span>}
           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit">
             submit
           </button>
        </form>
    )
}

interface Info {
    firstname: string,
    lastname: string,
    age: number
}
const InfoForm = ()=>{
    const {register, watch, handleSubmit, formState:{errors}} = useForm<Info>();
    const OnSubmit: SubmitHandler<Info> = (data)=> console.log(data);
    console.log(watch("firstname"));
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(OnSubmit)}>
            <input placeholder="Firstname" className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("firstname", {required: true})}/>
            {errors.firstname && <span className="text-red-500">Firstname is required</span>}
            <input placeholder="Lastname" className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("lastname", {required: true, minLength: 2, maxLength: 100})}/>
            {errors.lastname && <span className="text-red-500">Lastname must be between 2 and 100 characters</span>}
            <input placeholder="Age" className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("age", {required: true, min: 18, max: 99})}/>
            {errors.age && <span className="text-red-500">Age must be between 18 and 99</span>}

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit">
                submit
            </button>
        </form>
    )
}

interface IFormValues {
  "First Name": string
  Age: number
}

type InputProps = {
  label: Path<IFormValues>
  register: UseFormRegister<IFormValues>
  required: boolean
}

// The following component is an example of your existing Input Component
const Input = ({ label, register, required }: InputProps) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register(label, { required })} />
  </>
)

// you can use React.forwardRef to pass the ref too
const Select = React.forwardRef<
  HTMLSelectElement,
  { label: string } & ReturnType<UseFormRegister<IFormValues>>
>(({ onChange, onBlur, name, label }, ref) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <select className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
      <option value="20">20</option>
      <option value="30">30</option>
    </select>
  </>
))

const AnotherInfoForm = ()=>{
  const { register, handleSubmit } = useForm<IFormValues>()

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    alert(JSON.stringify(data))
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input register={register} required label={"First Name"}/>
      <Select label={""} {...register("Age")} />
      <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit" />
    </form>
  )
}