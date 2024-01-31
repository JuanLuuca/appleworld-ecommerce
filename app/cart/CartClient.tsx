"use client"

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";

const CartClient = () => {
    const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

    if(!cartProducts || cartProducts.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Seu carrinho está vazio</div>
                <div>
                    <a href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack />
                        <span>Ir para o Menu</span>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Heading title="Shopping Carrinho" center />
            <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
                <div className="col-span-2 justify-self-start">Produto</div>
                <div className="justify-self-center">Preço</div>
                <div className="justify-self-center">Quantidade</div>
                <div className="justify-self-end">Total</div>
            </div>
            <div>
                {cartProducts && cartProducts.map((item) => {
                    return <ItemContent key={item.id} item={item} />
                })}
            </div>
            <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
                <div className="w-[90px]">
                    <Button label="Limpar" onClick={() => {
                        handleClearCart()
                    }} small outline />
                </div>
                <div className="text-sm flex flex-col gap-1 items-start">
                    <div className="flex justify-between w-full text-base font-semibold">
                        <span>SubTotal</span>
                        <span>{formatPrice(cartTotalAmount)}</span>
                    </div>
                    <p className="text-slate-500">Calculados na finalização da compra</p>
                    <Button label="Entrar em contato" onClick={() => {}} />
                    <a href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack />
                        <span>Continue comprando</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CartClient;