
import { useNavigate } from 'react-router-dom';
function Open() {

  const navigate = useNavigate();

  return (
      <div className='flex gap-4 items-center justify-center'>
      <p onClick={()=>navigate('/usestate')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>usestate</p>
      <p onClick={()=>navigate('/useeffect')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>useeffect</p>
      <p onClick={()=>navigate('/usecallback')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>usecallback</p>
      <p onClick={()=>navigate('/useoptimistic')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>useoptimistic</p>
      <p onClick={()=>navigate('/usememo')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>usememo</p>
      <p onClick={()=>navigate('/outsidebutton')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>outside button</p>
      <p onClick={()=>navigate('/hookform')} className='text-blue-500 underline cursor-pointer hover:text-blue-800'>react hook form</p>
      
      </div>
  )
}

export default Open
