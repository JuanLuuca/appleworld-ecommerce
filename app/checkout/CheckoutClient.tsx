// "use client"

// import { useCart } from "@/hooks/useCart";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// const CheckoutClient = () => {
//     const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(false);

//     const router = useRouter();

//     useEffect(() => {
//         if(cartProducts) {
//             setLoading(true);
//             setError(true);

//             fetch('/api/create-payment-intent', {
//                 method: 'POST',
//                 headers: {'Content-Type':'application/json'},
//                 body: JSON.stringify({
//                     items: cartProducts,
//                     payment_intent_id: paymentIntent,
//                 })
//             }).then((res) => {
//                 setLoading(false);
//                 if(res.status === 401) {
//                     return router.push('/login')
//                 }

//                 return res.json();
//             }).then((data) => {
//                 handleSetPaymentIntent(data.paymentIntent.id); 
//             }).catch((error) => {
//                 setError(true);
//             })
//         }
//     }, [cartProducts, paymentIntent]);

//     return (
//         <div className="w-full">
//             {loading && <div className="text-center">Carregando...</div>}
//             {/* {error && <div className="text-center text-rose-500">Algo deu errado...</div>}
//             {paymentSuccess && (
//                 <div className="flex items-center flex-col gap-4">
//                     <div className="text-teal-500 text-center">Pagamento com sucesso</div>
//                     <div className="max-w-[220px] w-full">
//                         <Button label="Visualizar seus pedidos" onClick={() => router.push('/order')} />
//                     </div>
//                 </div>
//             )} */}
//             {/* <Checkout /> */}
//         </div>
//     );
// };

// export default CheckoutClient;



"use client"

import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CartProductType } from "@prisma/client";
import { formatPrice } from "@/utils/formatPrice";
import { Horizontal } from "../product/[productId]/ProductDetails";

const CheckoutClient = () => {
    const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const {cartTotalAmount} = useCart();

    const router = useRouter();

    useEffect(() => {
        if (cartProducts) {
            setLoading(true);
            setError(true);

            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent,
                })
            }).then((res) => {
                setLoading(false);
                if (res.status === 401) {
                    return router.push('/login')
                }

                return res.json();
            }).then((data) => {
                handleSetPaymentIntent(data.paymentIntent.id);
            }).catch((error) => {
                sendWhatsAppMessage(cartProducts);
            })
        }
    }, [cartProducts, paymentIntent]);

    const sendWhatsAppMessage = async (products: CartProductType[]) => {
        try {
            const to = '5592984769634';
            const messageBody = `
                🌟 *Tenho interesse no seu Produto* 🌟\n
                Olá! Estou interessado nos seguintes produtos:\n
                ${products.map(product => `
                    *Nome:* ${product.name}\n
                    *Preço:* ${formatPrice(product.price)}\n
                    *Bateria:* ${product.brand}\n
                    *Cor:* ${product.selectedImg.color}\n
                    *Descrição:* ${product.description}\n
                    *Quantidade:* ${product.quantity}\n
                    ------------------- // ------------------------
                `).join('\n')}

                *Total:* ${formatPrice(cartTotalAmount)}\n
                🎉 Vamos finalizar essa compra juntos?
            `;

            const apiUrl = `https://api.whatsapp.com/send?phone=${to}&text=${encodeURIComponent(messageBody)}`;

            window.open(apiUrl);

            toast.success('Mensagem enviada com sucesso para o WhatsApp!');
            router.push('/orders');
            router.refresh();
        } catch (err) {
            console.error('Erro ao enviar mensagem para o WhatsApp:', err);
        }
    };

    return (
        <div className="w-full">
            {loading && <div className="text-center">Carregando...</div>}
            {/* {error && <div className="text-center text-rose-500">Algo deu errado...</div>} */}
            {/* {paymentSuccess && (
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