// @ts-ignore
import Allproducts from "@/components/products"
import { Suspense } from "react"
import { refreshProducts } from "./action"
const ProductListing = () => {
    return (
        <div>
            <h1>My Shop:</h1>
            <Suspense fallback={<p>product is loading...</p>}>
                <Allproducts />
            </Suspense>
            <form action={refreshProducts}>
                <button className="bg-pink-300 text-black p-3">refresh</button>
            </form>
        </div>
    )
}

export default ProductListing