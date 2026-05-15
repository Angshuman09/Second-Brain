import './App.css'
import {Callback} from './UseCallBack'
import { useContext, useState } from 'react'
import { ThemeContext } from './UseContext';
import useRouter
function App() {

  const [theme, setTheme] = useState(useContext(ThemeContext));

  console.log(theme);

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white w-full h-screen flex flex-col justify-center items-center gap-10" : "bg-amber-100 text-black w-full h-screen flex justify-center items-center flex-col gap-10"}>
      <button onClick={()=>setTheme(theme  === "dark" ? "light" : "dark")} className={`text-black bg-amber-500 px-4 py-2 rounded`}>magic</button>
      <Callback/>
      {/* <State/> */}
      {/* <Effect/> */}
      <p onClick={} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>open</p>
    </div>
  )
}

export default App
