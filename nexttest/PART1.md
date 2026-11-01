# Next.js Basics: Static, Cached, Dynamic in 4 Steps

*One tiny project, one slow third-party API, three kinds of content*

**The one sentence to remember:** static is built once, cached is fetched once and reused, and dynamic is fetched on every visit. We use `dummyjson.com`, a free third-party API with a `delay` parameter, so the slowness is real and every concept is something you can see with your own eyes.

## Setup

```bash
npx create-next-app@latest basic-demo --ts --app
```

Turn on Cache Components, which makes every page dynamic by default and lets you opt in to caching:

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = { cacheComponents: true };
export default nextConfig;
```

Then add one helper that calls the slow API. The `delay=2000` part makes the server take 2 seconds to answer:

```ts
// lib/api.ts
export type Product = { id: number; title: string; price: number };

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    'https://dummyjson.com/products?limit=5&select=title,price&delay=2000'
  );
  const data = await res.json();
  return data.products;
}
```

## Step 1: Streaming with Suspense

```tsx
// app/page.tsx
import { Suspense } from 'react';
import { getProducts } from '@/lib/api';

async function Products() {
  const products = await getProducts();
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.title} — ${p.price}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main>
      <h1>My Shop</h1>
      <Suspense fallback={<p>Loading products…</p>}>
        <Products />
      </Suspense>
    </main>
  );
}
```

Run `npm run dev` and open the page. The heading appears instantly, and the list pops in about 2 seconds later. Refresh and you wait 2 seconds again.

**Explain it as:** Suspense means show what you have now, and stream the slow part when it is ready.

**Try this:** remove `<Suspense>`. Next.js shows an error telling you to wrap the slow part or cache it. It forces you to decide.

## Step 2: Caching with `'use cache'`

Add two lines at the top of `Products()`, plus one import:

```tsx
import { cacheLife } from 'next/cache';

async function Products() {
  'use cache';
  cacheLife('minutes');

  const products = await getProducts();
  return (/* same list as before */);
}
```

The first visit takes 2 seconds. Refresh and the list is **instant**, because Next.js remembers the result.

**Explain it as:** `'use cache'` means don't ask the API again, reuse the answer.

## Step 3: Dynamic content (changes every visit)

Add a clock that must run on every request:

```tsx
// add to app/page.tsx
import { connection } from 'next/server';

async function Clock() {
  await connection(); // "run this on every request"
  return <p>Server time: {new Date().toLocaleTimeString()}</p>;
}
```

Put it under the heading, inside its own `Suspense`:

```tsx
<Suspense fallback={<p>…</p>}>
  <Clock />
</Suspense>
```

Refresh a few times. The time changes every time, but the product list stays instant. Now one page holds all three kinds of content:

| Part | Kind | On refresh |
| --- | --- | --- |
| `<h1>My Shop</h1>` | Static | Always instant |
| Products | Cached | Slow once, then instant |
| Clock | Dynamic | Always fresh |

## Step 4: Refreshing the cache (revalidation)

Give the cache a name (a tag), then add a button that throws it away.

```tsx
// in Products(), under cacheLife
import { cacheLife, cacheTag } from 'next/cache';
cacheTag('products');
```

```ts
// app/actions.ts
'use server';
import { updateTag } from 'next/cache';

export async function refreshProducts() {
  updateTag('products');
}
```

```tsx
// in app/page.tsx, below the list
import { refreshProducts } from './actions';

<form action={refreshProducts}>
  <button>Refresh products</button>
</form>
```

Click the button and you wait about 2 seconds again, because the old cache was thrown away and the API was called again.

**Explain it as:** cache until I say otherwise, and the tag is the name I use to say it.

## Your 20-second explanation

> Next.js splits a page into three kinds of content. **Static** is built once. **Cached** is fetched once and reused with `'use cache'`. **Dynamic** is fetched on every visit. **Suspense** lets the page show instantly while the slow parts stream in. And when the data changes, I clear the cache by its **tag**.
