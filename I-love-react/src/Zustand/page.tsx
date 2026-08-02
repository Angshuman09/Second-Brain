import { useCountStore } from '../store';

const Zustand = () => {
    const count = useCountStore((state)=>state.count);
    const increment = useCountStore((state)=>state.increment);
    const decrement = useCountStore((state)=>state.decrement);
    const asyncincrement = useCountStore((state)=> state.incrementAsync);
    const asyncdecrement = useCountStore((state)=> state.decrementAsync);
  return (
    <div>
        <h1>Zustand</h1>
        <h2>Count: {count}</h2>
        <div className='flex gap-5 flex-col'>
        <div className='flex gap-4'>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={increment}>Increment</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={decrement}>Decrement</button>
        </div>
        <div className='flex gap-4'>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={asyncincrement}>Increment async</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={asyncdecrement}>Decrement async</button>
        </div>
        </div>
    </div>
  )
}

export default Zustand