"use client"

import { Order, Product, User } from "@prisma/client"
import { useEffect, useState } from "react"
import Heading from "../components/Heading"
import { formatPrice } from "@/utils/formatPrice"
import { formatNumber } from "@/utils/formatNumber"

interface SummaryProps {
    orders: Order[]
    products: Product[]
    users: User[]
}

type SummaruDataType = {
    [key: string]: {
        label: string;
        digit: number
    }
}

const Summary = ({ products, orders, users }: SummaryProps) => {
    const [summaryData, setSummaryData] = useState<SummaruDataType>({
        sale: {
            label: 'Total Vendido',
            digit: 0
        },
        products: {
            label: 'Total Produtos',
            digit: 0
        },
        orders: {
            label: 'Total Pedidos',
            digit: 0
        },
        paidOrders: {
            label: 'Pedidos Pagos',
            digit: 0
        },
        unpaidOrders: {
            label: 'Pedidos não pagos',
            digit: 0
        },
        users: {
            label: 'Total Usuários',
            digit: 0
        },
    })

    useEffect(() => {
        setSummaryData((prev) => {
            let tempData = {...prev}

            const totalSale = orders.reduce((acc, item) => {
                if(item.status === "completo") {
                    return acc + item.amount
                } 
                else {
                    return acc
                }
            }, 0)

            const paidOrders = orders.filter((order => {
                return order.status === "complete"
            }));

            const unpaidOrders = orders.filter((order => {
                return order.status === "pendente" 
            }));

            tempData.sale.digit = totalSale;
            tempData.orders.digit = orders.length;
            tempData.paidOrders.digit = paidOrders.length;
            tempData.unpaidOrders.digit = unpaidOrders.length;
            tempData.products.digit = products.length;
            tempData.users.digit = users.length;

            return tempData;
        })
    }, [orders, products, users]);

    const summaryKeys = Object.keys(summaryData);

    return (
        <div className="max-w-[1150px] m-auto">
            <div className="mb-4 mt-8">
                <Heading title="Status" center />
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {
                    summaryKeys && summaryKeys.map((key) => {
                        return (
                            <div key={key} className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition">
                                <div className="text-xl md:text-4xl font-bold">
                                    {
                                        summaryData[key].label === "Total Vendido" ? <>{formatPrice(summaryData[key].digit)}</> : <>{formatNumber(summaryData[key].digit)}</>
                                    }    
                                </div> 
                                <div>{summaryData[key].label}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Summary;