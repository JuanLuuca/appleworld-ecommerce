import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { useState, createContext, useContext, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

type CartContextType = {
    cartTotalQty: number;
    cartTotalAmount: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrease: (product: CartProductType) => void;
    handleClearCart: () => void;
    paymentIntent: string | null;
    handleSetPaymentIntent: (val: string | null) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);

    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

    useEffect(() => {
        const cItems: any = localStorage.getItem("CartItems");
        const cProducts: CartProductType[] | null = JSON.parse(cItems);
        const ShopPaymentIntent: any = localStorage.getItem("CartItems");
        const paymentIntent: string | null = JSON.parse(ShopPaymentIntent);

        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    }, []);

    useEffect(() => {
        const getTotals = () => {
            if(cartProducts) {
                const { total, qty } = cartProducts?.reduce((acc, item) => {
                    const itemTotal = item.price * item.quantity
    
                    acc.total += itemTotal
                    acc.qty += item.quantity
    
                    return acc;
                }, {
                    total: 0,
                    qty: 0
                });

                setCartTotalQty(qty);
                setCartTotalAmount(total);
            };
        };

        getTotals();

    }, [cartProducts]);

    const handleAddProductToCart = useCallback((product: CartProductType) => {
        setCartProducts((prev) => {
            let updatedCart;

            if (prev) {
                updatedCart = [...prev, product];
            } else {
                updatedCart = [product];
            }

            toast.success("Produto adicionado no carrinho");
            localStorage.setItem("CartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    }, []);

    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        if(cartProducts) {
            const filteredProducts = cartProducts.filter((item) => {
                return item.id != product.id
            })

            setCartProducts(filteredProducts);
            toast.success("Produto removido");
            localStorage.setItem("CartItems", JSON.stringify(filteredProducts));
        }
    }, [cartProducts]);

    const handleCartQtyIncrease = useCallback((product: CartProductType) => {
        let updatedCart;

        if(product.quantity === 5) {
            return toast.error("Ooooops! Maximo número de pedidos")
        }

        if(cartProducts) {
            updatedCart = [...cartProducts];

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1) {
                updatedCart[existingIndex].quantity = ++updatedCart[existingIndex].quantity;
            }

            setCartProducts(updatedCart);
            localStorage.setItem("CartItems", JSON.stringify(updatedCart));
        }

    }, [cartProducts]);

    const handleCartQtyDecrease = useCallback((product: CartProductType) => {
        let updatedCart;

        if(product.quantity === 1) {
            return toast.error("Ooooops! Mínimo número de pedidos")
        }

        if(cartProducts) {
            updatedCart = [...cartProducts];

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1) {
                updatedCart[existingIndex].quantity = --updatedCart[existingIndex].quantity;
            }

            setCartProducts(updatedCart);
            localStorage.setItem("CartItems", JSON.stringify(updatedCart));
        }

    }, [cartProducts]);

    const handleClearCart = useCallback(() => {
        setCartProducts(null);
        setCartTotalQty(0);
        localStorage.setItem("CartItems", JSON.stringify(null));
    }, [cartProducts]);

    const handleSetPaymentIntent = useCallback((val: string | null) => {
        setPaymentIntent(val);
        localStorage.setItem("CartItems", JSON.stringify(val));
    }, [paymentIntent]);

    const value ={
        cartTotalQty,
        cartProducts,
        cartTotalAmount,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        handleSetPaymentIntent,
        paymentIntent
    };

    return <CartContext.Provider value={value} {...props} />
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartContextProvider");
    }

    return context;
}