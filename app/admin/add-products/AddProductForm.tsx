"use client"

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from "axios";
import { useRouter } from "next/navigation";
import InputMask from 'react-input-mask';

export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null;
}

export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AddProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated] = useState(false); 
    const router = useRouter();

    const {register, handleSubmit, setValue, watch, reset, formState: { errors }} = useForm<FieldValues>({
        defaultValues: {
            name: '',
            description: '',
            brand: '',
            category: '',
            inStock: false,
            images: [],
            price: ''
        }
    });

    useEffect(() => {
        setCustomValue('images', images);
    }, [images]);

    useEffect(() => {
        if(isProductCreated) {
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        let uploadedImages: UploadedImageType[] = [];

        if(!data.category) {
            setIsLoading(false);
            return toast.error("Categoria não foi selecionado");
        }

        if(!data.images || data.images.length === 0) {
            setIsLoading(false);
            return toast.error("Imagem não selecionada!");
        }

        const handleImageUploads = async () => {
            toast("Criando produto, por favor espere...");
            try {
                for(const item of data.images) {
                    if(item.image) {
                        const fileName = new Date().getTime() + '-' + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload is ' + progress + '% done');
                                    switch (snapshot.state) {
                                    case 'paused':
                                        console.log('Upload is paused');
                                        break;
                                    case 'running':
                                        console.log('Upload is running');
                                        break;
                                    }
                                },
                                (error) => {
                                    console.log("error upload a imagem", error)
                                    reject(error)
                                },
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                                        uploadedImages.push({
                                            ...item,
                                            image: downloadUrl
                                        });
                                        console.log("imagem de arquivo", downloadUrl);
                                        resolve()
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    }) 
                                }
                            )
                        })
                    }
                }
            } catch(error) {
                setIsLoading(false);
                console.log("erro ao fazer o upload da imagem");
                return toast.error("Erro ao fazer o upload da imagem");
            }
        };

        await handleImageUploads();
        const productData = { ...data, images: uploadedImages };
        
        axios.post('/api/product', productData).then(() => {
            toast.success("Produto criado.");
            setIsProductCreated(true);
            router.refresh();
        }).catch((error) => {
            toast.error("Algo deu errado ao salvar imagem selecionada");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const category = watch('category');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    };

    const addImageToState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if(!prev) {
                return [value];
            }

            return [...prev, value];
        })
    }, []);

    const removeImageFromState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if(!prev) {
                return [value];
            }

            return [...prev, value];
        })
    }, []);

    return (
        <>
            <Heading title="Adicionar um Produto" center />
            <Input 
                id="name"
                label="Nome"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="price"
                label="Preço"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                required
            />
            <Input 
                id="brand"
                label="Porcentagem Bateria"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <TextArea 
                id="description"
                label="Descrição"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <CustomCheckBox 
                id="inStock" 
                register={register}
                label="Este produto tem estoque?" 
            />
            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Selecione a Categoria</div>
                <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] overflow-y-auto">
                    {categories.map((data) => {
                        if(data.label === "Todos") {
                            return null;
                        }

                        return (
                            <div key={data.label} className="col-span">
                                <CategoryInput 
                                    onClick={(category) => setCustomValue('category', category)}
                                    selected={category === data.label}
                                    label={data.label}
                                    icon={data.icon}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Selecione o produto disponível as cores e coloque as imagens
                    </div>
                    <div>
                        Você deve enviar uma imagem para cada cor selecionada, caso contrário sua seleção de cores será ignorada
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => {
                        return (
                            <SelectColor 
                                key={index}
                                item={item}
                                addImageToState={addImageToState}
                                removeImageFromState={removeImageFromState}
                                isProductCreated={false}
                            />
                        )
                    })}
                </div>
            </div>
            <Button label={isLoading ? 'Loading...' : 'Adicionar Produto'} onClick={handleSubmit(onSubmit)} />
        </>
    );
};

export default AddProductForm;

