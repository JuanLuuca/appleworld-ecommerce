"use client"

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
import { ThreeDots } from "react-loader-spinner";

interface LoginFormProps {
    currentUser: SafeUser | null
}

const LoginForm = ({ currentUser }: LoginFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: ""
        }
    }); 

    const router = useRouter();

    useEffect(() => {
        if(currentUser) {
            router.push("/cart");
            router.refresh();
        }
    }, [])

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);
            if(callback?.ok) {
                router.push("/cart");
                router.refresh();
                toast.success("Logado");

                console.log(callback?.ok);
            }

            if(callback?.error) {
                toast.error(callback.error);
            }
        });
    };

    if(currentUser) {
        return <p className="text-center">Logado. Redirecionando...</p>
    };

    return (
        <>
            <Heading title="Bem-vindo ao Apple World" />
            <Button 
                outline
                label="Entrar com a conta Google"
                icon={AiOutlineGoogle}
                onClick={() => {
                    signIn('google')
                }}
            />
            <hr className="bg-slate-300 w-full h-px" />
            <Input 
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="email"
            />
            <Input 
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="password"
            />
            {isLoading ? (
                <ThreeDots visible={true} height="60" width="60" color="#111111" radius="9" ariaLabel="three-dots-loading" />
            ) : (
                <Button label="Entrar" onClick={handleSubmit(onSubmit)} />
            )}
            <p className="text-sm">Não tem conta ainda?  
                <Link href={"/register"} className="underline ml-2">Criar conta</Link>
            </p>
        </>
    );
};

export default LoginForm;