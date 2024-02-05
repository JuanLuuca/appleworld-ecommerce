"use client"

import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CheckoutClient = () => {
    const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(cartProducts) {
            setLoading(true);
            setError(true);

            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent,
                })
            }).then((res) => {
                setLoading(false);
                if(res.status === 401) {
                    return router.push('/login')
                }

                return res.json();
            }).then((data) => {
                handleSetPaymentIntent(data.paymentIntent.id); 
            }).catch((error) => {
                setError(true);
                toast.error("Algo deu errado");
            })
        }
    }, [cartProducts, paymentIntent]);

    return (
        <div className="w-full">
            {loading && <div className="text-center">Carregando...</div>}
            {/* {error && <div className="text-center text-rose-500">Algo deu errado...</div>}
            {paymentSuccess && (
                <div className="flex items-center flex-col gap-4">
                    <div className="text-teal-500 text-center">Pagamento com sucesso</div>
                    <div className="max-w-[220px] w-full">
                        <Button label="Visualizar seus pedidos" onClick={() => router.push('/order')} />
                    </div>
                </div>
            )} */}
            {/* <Checkout /> */}
        </div>
    );
};

export default CheckoutClient;