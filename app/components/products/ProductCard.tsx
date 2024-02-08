"use client"

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight, FaHeart, FaStar } from "react-icons/fa";

interface ProductCardProps {
    data: any 
}

const ProductCard = ({ data }: ProductCardProps) => {

    const router = useRouter();
    const productRating = data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / data.reviews.length

    return (
        // <div className="p-6 bg-white rounded-md text-center relative shadow-md">
        //     <div className="h-64 mb-4 w-56 relative left-6 lg:h-56 lg:w-full lg:left-0">
        //         <Image 
        //             fill
        //             sizes="100%"
        //             src={data.images[0].image}
        //             className="max-w-full max-h-full inline-block absolute bottom-0 mx-auto left-0 right-0" 
        //             alt={""}                    
        //         />
        //     </div>
        //     <div className="box-border">
        //         <h4 className="mb-1">{truncateText(data.name)}</h4>
        //         <Rating value={productRating} readOnly />
        //         <p className="mb-1 text-sm p-1">
        //             {data.reviews.length} Avaliações
        //         </p>
        //         <div className="mb-3 font-semibold">
        //             {formatPrice(data.price)}
        //         </div>
        //         <div onClick={() => router.push(`/product/${data.id}`)} className="cursor-pointer text-neutral-900 text-xs uppercase font-bold border border-neutral-900 px-6 py-2 mt-5 rounded-full hover:bg-neutral-900 hover:text-white transition">Visualizar produto</div>
        //     </div>
        // </div>

        <div className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm">
           <div className="flex flex-col items-center w-full gap-1">
                <div className="aspect-square overflow-hidden relative w-full">
                    <Image 
                        fill
                        sizes="100%"
                        alt="image card"
                        src={data.images[0].image}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="mt-4">
                    {truncateText(data.name)}
                </div>
                <div>
                    <Rating value={productRating} readOnly />
                </div>
                <div>
                    {data.reviews.length} Avaliações
                </div>
                <div className="font-semibold">
                    {formatPrice(data.price)}
                </div>
                <div onClick={() => router.push(`/product/${data.id}`)} className="cursor-pointer text-neutral-900 text-xs uppercase font-bold border border-neutral-900 px-4 py-1 lg:px-6 md:py-2 mt-5 mb-2 rounded-full hover:bg-neutral-900 hover:text-white transition">Visualizar</div>
            </div> 
        </div>
    );
}

export default ProductCard;