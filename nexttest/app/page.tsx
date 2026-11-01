import Link from 'next/link';

const Home = () => {
  return (
    <main className='p-5'>
      <div className='mb-24'>
        <h1 className='text-amber-600'>Dynamic import demo</h1>
        <p className='text-pink-300'>Dynamic imports in Next.js are primarily used for lazy loading components and libraries, which breaks your JavaScript bundle into smaller chunks and loads them only when they are needed.</p>
        <ul>
          <li><Link className='text-blue-500 underline font-bold' href="/normal">/normal</Link>: static import</li>
          <li><Link className='text-blue-500 underline font-bold' href="/dynamic">/dynamic</Link>: next/dynamic import</li>
        </ul>
      </div>

      <div>
        <h1 className='text-amber-600'>Next cached</h1>
        <p className='text-pink-300'>Next.js splits a page into three kinds of content. Static is built once. Cached is fetched once and reused with 'use cache'. Dynamic is fetched on every visit. Suspense lets the page show instantly while the slow parts stream in. And when the data changes, I clear the cache by its tag.</p>
        <Link className='text-blue-500 underline font-bold' href={"/products"}>/products</Link>
      </div>
    </main>
  );
}

export default Home