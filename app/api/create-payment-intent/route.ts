import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;

        return acc + itemTotal;
    }, 0);

    const price: any = Math.floor(totalPrice);

    return price;
};

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.json({ error: "Unathorized" }, { status: 401 })
    }

    const rand = () => {
        return Math.random().toString(36).substr(2);
    };

    const token = () => {
        return rand() + rand();
    };

    const body = await request.json();
    const { items } = body
    const total = calculateOrderAmount(items) * 100
    const orderData = {
        user: { connect: { id: currentUser.id }},
        amount: total,
        currency: 'brl',
        status: "pendente",
        deliveryStatus: "pendente",
        paymentIntentId: token(),
        products: items
    }
    
    const paymentIntent = await prisma.order.create({
        data: orderData,
    });

    return paymentIntent;
}