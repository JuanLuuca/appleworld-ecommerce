"use client"

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
    currentUser: SafeUser | null
}

const RegisterForm = ({ currentUser }: RegisterFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
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

        axios.post("/api/register", data).then(() => {
            toast.success("Conta criada com sucesso");
            
            signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false
            }).then((callback) => {
                if(callback?.ok) {
                    router.push("/cart");
                    router.refresh();
                    toast.success("Logado");
                }

                if(callback?.error) {
                    toast.error(callback.error);
                }
            });
        }).catch(() => toast.error("Algo deu errado")).finally(() =>
            setIsLoading(false)
        );
    };

    if(currentUser) {
        return <p className="text-center">Logado. Redirecionando...</p>
    };

    return (
        <>
            <Heading title="Registrar conta ao Apple World" />
            <Button 
                outline
                label="Entrar com a conta Google"
                icon={AiOutlineGoogle}
                onClick={() => {
                    signIn("google");
                }}
            />
            <hr className="bg-slate-300 w-full h-px" />
            <Input 
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
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
            <Button label={isLoading ? "Loading" : "Cadastrar"} onClick={handleSubmit(onSubmit)} />
            <p className="text-sm">Já tem uma conta? 
                <Link href={"/login"} className="underline ml-2">Entrar</Link>
            </p>
        </>
    );
};

export default RegisterForm;