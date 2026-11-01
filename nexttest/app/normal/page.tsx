'use client'

import HeavyChart from '@/components/heavy-chart'
import { useState } from 'react'

const NormalPage = () => {
    const [show, setShow] = useState<boolean>(false);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1>Normal import</h1>
        <p>The chart code is downloaded on page load, even if you never click the button.</p>
        <button className='bg-red-300 p-3 text-black' onClick={()=>setShow((s) => !s)}> {show ? "hide chart" : "show chart"}</button>
      {show && <HeavyChart />}
    </div>
  )
}

export default NormalPage