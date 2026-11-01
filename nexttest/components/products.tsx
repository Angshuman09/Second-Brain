import { getProducts } from "@/lib/api"
import { cacheLife, cacheTag } from "next/cache";

const Allproducts = async () => {
    'use cache'
    cacheLife("minutes")
    cacheTag("products")
    const products = await getProducts();
    return (
        <>
            <ul>{
                products.map((p) => (
                    <li key={p.id}>
                        <div>{p.title}</div>
                        <div>{p.price}</div>
                    </li>
                ))
            }</ul>
        </>
    )
}

export default Allproducts