import {Routes, Route} from 'react-router-dom';
import State from './UseState';
import { Effect } from './UseEffect';
import { Callback } from './UseCallBack';
import Open from './open';
import {Context} from './UseContext';
import { Optimistic } from './UseOptimistic';
import { UseMemo } from './UseMemo';
import OutsideButton from './Outside-button';
import HookForm from './ReactHookForm';
import FieldLogic from './UseFieldArray';

const App = () => {
  const {theme, setTheme} = Context();
  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white w-full flex flex-col justify-center items-center gap-10" : "bg-amber-100 text-black w-full h-screen flex justify-center items-center flex-col gap-10"}>
      <button onClick={()=>setTheme(theme  === "dark" ? "light" : "dark")} className={`text-black bg-amber-500 px-4 py-2 rounded`}>magic</button>
          <Routes>
      <Route path='/' element={<Open/>}/>
      <Route path='/usestate' element={<State/>}/>
      <Route path='/useeffect' element={<Effect/>}/>
      <Route path='/usecallback' element={<Callback/>}/>
      <Route path='/useoptimistic' element={<Optimistic/>}/>
      <Route path='/usememo' element={<UseMemo/>}/>
      <Route path='/outsidebutton' element={<OutsideButton/>}/>
      <Route path='hookform' element={<HookForm/>}/>
      <Route path='/usearray' element={<FieldLogic/>}/>
    </Routes>
    </div>

  )
}

export default App