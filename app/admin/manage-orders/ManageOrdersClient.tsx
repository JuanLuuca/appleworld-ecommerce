"use client"

import ActionBtn from "@/app/components/ActionBtn";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { formatPrice } from "@/utils/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Order, User } from "@prisma/client";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";

interface ManageOrdersClientProps {
    orders: ExtendedOrder[]
}

type ExtendedOrder = Order & {
    user: User
}

const ManageOrdersClient = ({ orders }: ManageOrdersClientProps) => {
    let rows: any = [];
    const router = useRouter();

    if(orders) {
        rows = orders.map((order) => {{
            return {
                id: order.id,
                customer: order.user.name,
                price: formatPrice(order.amount / 100),
                paymentStatus: order.status,
                date: moment(order.createDate).fromNow(),
                deliveryStatus: order.deliveryStatus,
            }
        }});
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'customer', headerName: 'Nome do Cliente', width: 130 },
        {
            field: "amount",
            headerName: "Quantidade",
            width: 130,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.amount}</div>
                );
            },
        },
        {
            field: "paymentStatus",
            headerName: "Status Pagamento",
            headerAlign: 'center',
            width: 130,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.paymentStatus === "pendente" ? (
                            <Status 
                                text="Pendente" 
                                icon={MdAccessTimeFilled} 
                                bg="bg-slate-200" 
                                color="text-slate-700" 
                            /> 
                        ) : params.row.paymentStatus === "completo" ? (
                            <Status 
                                text="Completo" 
                                icon={MdDone} 
                                bg="bg-green-200" 
                                color="text-green-700" 
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
        {
            field: "deliveryStatus",
            headerName: "Status Pedido",
            headerAlign: 'center',
            width: 130,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.deliveryStatus === "pendente" ? (
                            <Status 
                                text="Pendente" 
                                icon={MdAccessTimeFilled} 
                                bg="bg-slate-200" 
                                color="text-slate-700" 
                            /> 
                        ) : params.row.deliveryStatus === "despachado" ? (
                            <Status 
                                text="Despachado" 
                                icon={MdDeliveryDining} 
                                bg="bg-purple-200" 
                                color="text-purple-700" 
                            />
                        ) : params.row.deliveryStatus === "entregue" ? (
                            <Status 
                                text="Entregue" 
                                icon={MdDone} 
                                bg="bg-green-200" 
                                color="text-green-700" 
                            />
                        ) :  (
                            <></>
                        )}
                    </div>
                );
            },
        },
        {
            field: "date",
            headerName: "Date",
            width: 130
        },
        {
            field: "action",
            headerName: "Ação",
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-evenly gap-4 w-full">
                        <ActionBtn icon={MdDeliveryDining} onClick={() => {
                            handleDispatch(params.row.id);
                        }} />
                        <ActionBtn icon={MdDone} onClick={() => {
                            handleDeliver(params.row.id);
                        }} />
                        <ActionBtn icon={MdRemoveRedEye} onClick={() => {
                            router.push(`order/${params.row.id}`);
                        }} />
                    </div>
                );
            },
        },
    ];

    const handleDispatch = useCallback((id: string) => {
        axios.put("/api/order", {
            id,
            deliveryStatus: "despachado"
        })
        .then((res) => {
            toast.success("Pedido despachado");
            router.refresh();
        })
        .catch((err) => {
            toast.error("Ops! Algo deu errado");
        })
    }, []);

    const handleDeliver = useCallback((id: string) => {
        axios.put("/api/order", {
            id,
            deliveryStatus: "entregue"
        })
        .then((res) => {
            toast.success("Pedido entregue");
            router.refresh();
        })
        .catch((err) => {
            toast.error("Ops! Algo deu errado");
        })
    }, []);

    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Gerenciar Pedidos" center />
            </div>
            <div style={{ height: 600, width: "100%" }}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 9 },
                        },
                    }}
                    pageSizeOptions={[9, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
};

export default ManageOrdersClient;