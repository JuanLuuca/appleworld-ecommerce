"use client"

import ActionBtn from "@/app/components/ActionBtn";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import firebaseApp from "@/libs/firebase";
import { formatPrice } from "@/utils/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Product } from "@prisma/client";
import axios from "axios";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";

interface ManageProductsClientProps {
    products: Product[]
}

const ManageProductsClient = ({ products }: ManageProductsClientProps) => {
    let rows: any = [];
    const router = useRouter();
    const storage = getStorage(firebaseApp);

    if(products) {
        rows = products.map((product) => {{
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            }
        }});
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Nome', width: 220 },
        {
            field: "price",
            headerName: "Preço",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.price}</div>
                );
            },
        },
        { field: 'category', headerName: 'Categoria', width: 100 },
        { field: 'brand', headerName: 'Bateria', width: 60 },
        {
            field: "inStock",
            headerName: "Estoque",
            headerAlign: 'center',
            width: 120,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.inStock === true ? 
                            <Status 
                                text="Em estoque" 
                                icon={MdDone} 
                                bg="bg-teal-200" 
                                color="text-teal-700" 
                            /> 
                        : 
                            <Status 
                                text="Fora de estoque" 
                                icon={MdClose} 
                                bg="bg-rose-200" 
                                color="text-rose-700" 
                            /> 
                        }
                    </div>
                );""
            },
        },
        {
            field: "action",
            headerName: "Ação",
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-evenly gap-4 w-full">
                        <ActionBtn icon={MdCached} onClick={() => {
                            handleToggleStock(params.row.id, params.row.inStock);
                        }} />
                        <ActionBtn icon={MdDelete} onClick={() => {
                            handleDelete(params.row.id, params.row.images);
                        }} />
                        <ActionBtn icon={MdRemoveRedEye} onClick={() => {
                            router.push(`/product/${params.row.id}`);
                        }} />
                    </div>
                );
            },
        },
    ];

    const handleToggleStock = useCallback((id: string, inStock: boolean) => {
        axios.put("/api/product", {
            id,
            inStock: !inStock
        })
        .then((res) => {
            toast.success("Status do produto atualizado");
            router.refresh();
        })
        .catch((err) => {
            toast.error("Ops! Algo deu errado");
        })
    }, []);

    const handleDelete = useCallback(async(id: string, images: any[]) => {
        toast("Deletando produto, por favor espere...");

        // const handleImageDelete = async () => {
        //     try {
        //         for(const item of images) {
        //             if(item.image) {
        //                 const imageRef = ref(storage, item.image);
        //                 await deleteObject(imageRef);
        //             }
        //         }
        //     } catch (error) {
        //         return console.log("deleção de imagem deu erro", error);
        //     }
        // };

        // await handleImageDelete();

        // axios.delete(`/api/review/65c565844e131c8e3710f570`)
        // .then((res) => {
        //     toast.success("review deletado.");
        //     router.refresh();
        // })
        // .catch((err) => {
        //     toast.error("Falha ao deletar o produto.");
        //     console.log("erro ao deletar produto ", err);
        // })

        axios.delete(`/api/product/${id}`)
        .then((res) => {
            toast.success("Produto deletado.");
            router.refresh();
        })
        .catch((err) => {
            toast.error("Falha ao deletar o produto.");
            console.log("erro ao deletar produto ", err);
        });
    }, []);

    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Gerenciar Produtos" center/>
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

export default ManageProductsClient;