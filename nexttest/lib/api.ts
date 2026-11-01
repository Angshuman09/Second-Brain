export type Product = {id: number, title: string, price: number};

export async function getProducts(): Promise<Product[]>{
    const res = await fetch('https://dummyjson.com/products?limit=5&select=title,price&delay=2000');

    const data = await res.json();

    return data.products
}