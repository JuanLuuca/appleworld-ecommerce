"use client"

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuatity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdCheckCircle } from "react-icons/md";

interface ProductDetailsProps {
    product: any
}

export type CartProductType = {
    id: string,
    name: string,
    description: string,
    category: string,
    brand: string,
    selectedImg: SelectedImgType,
    quantity: number,
    price: number
}

export type SelectedImgType = {
    color: string,
    colorCode: string,
    image: string
}

export const Horizontal = () => {
    return <hr className="w-[30%] my-2" />
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const productRating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    const {handleAddProductToCart, cartProducts} = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);
    const [cartProduct, setCartProduct] = useState<CartProductType>({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        selectedImg: {...product.images[0]},
        quantity: 1,
        price: product.price
    });

    const router = useRouter();

    console.log(cartProducts);

    useEffect(() => {
        setIsProductInCart(false);

        if (cartProducts) {
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if (existingIndex > -1) {
                setIsProductInCart(true);
            }
        }
    }, [cartProducts]);

    const handleColorSelect = useCallback((value: SelectedImgType) => {
        setCartProduct((prev) => {
            return { ...prev, selectedImg: value };
        })
    }, [cartProduct.selectedImg]);

    const handleQtyIncrease = useCallback(() => {
        if (cartProduct.quantity === 99) {
            return;
        }

        setCartProduct((prev) => {
            return { ...prev, quantity: ++prev.quantity};
        });
    }, [cartProduct]);

    const handleQtyDecrease = useCallback(() => {
        if (cartProduct.quantity === 1) {
            return;
        }

        setCartProduct((prev) => {
            return { ...prev, quantity: --prev.quantity};
        });
    }, [cartProduct]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
            <div className="flex flex-col gap-1 text-slate-500 text-sm">
                <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly />
                    <div className="text-justify">{product.reviews.length} Avaliações</div>
                </div>
                <Horizontal />
                <div className="text-justify">{product.description}</div>
                <Horizontal />
                <div>
                    <span className="font-semibold">Categoria:</span> {product.category}
                </div>
                <div>
                    <span className="font-semibold">Porcentagem Bateria:</span> {product.brand}
                </div>
                <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>{product.inStock ? 'Em estoque' : 'Fora de estoque'}</div>
                <Horizontal />
                {isProductInCart ? <>
                    <p className="mb-2 text-slate-500 flex items-center gap-1">
                        <MdCheckCircle className="text-teal-400" size={20} />
                        <span>Produto adicionado ao carrinho</span>
                    </p>
                    <div className="max-w-[300px]">
                        <Button label="Visualizar Carrinho" outline onClick={() => router.push('/cart')} />
                    </div>
                </> : <>
                    {product.inStock ? 
                        <>
                            <Horizontal />
                            <SetColor 
                            cartProduct={cartProduct}
                            images={product.images}
                            handleColorSelect={handleColorSelect}
                            />
                            <Horizontal />
                            <SetQuatity 
                                cartProduct={cartProduct}
                                handleQtyDecrease={handleQtyDecrease}
                                handleQtyIncrease={handleQtyIncrease}
                            />
                            <div className="max-w-[300px] mt-2">
                                <Button label="Adicionar ao Carrinho" onClick={() => handleAddProductToCart(cartProduct)} />
                            </div> 
                        </>
                    : 
                        <></>
                    } 
                </>}
            </div>
        </div>
    );
}

export default ProductDetails;