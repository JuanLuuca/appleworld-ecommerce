"use client"

import { useCallback, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import Avatar from "../Avatar";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";

interface UserMenuProps {
    currentUser: SafeUser | null;
}

const UserMenu = ({ currentUser }: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toogleOpen = useCallback(() => {
        setIsOpen((prev) => !prev)
    }, []);

    return (
        <>
            <div className="relative z-30">
                <div onClick={toogleOpen} className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700">
                    <Avatar />
                    <AiFillCaretDown />
                </div>
                {isOpen && (
                    <div
                        className="
                            absolute
                            rounded-md
                            shadow-md
                            w-[170px]
                            bg-white
                            overflow-hidden
                            right-0
                            top-12
                            text-sm
                            flex
                            flex-col
                            cursor-pointer
                        "
                    >
                        {currentUser?.role === "ADMIN" ? (
                            <div>
                                <Link  href="/orders">
                                    <MenuItem onClick={toogleOpen}>Seus Pedidos</MenuItem>
                                </Link>
                                <Link  href="/admin">
                                    <MenuItem onClick={toogleOpen}>Admin Dashboard</MenuItem>
                                </Link>
                                <hr />
                                <MenuItem onClick={() => { 
                                    toogleOpen(); 
                                    signOut();
                                }}>Sair</MenuItem>
                            </div>
                        ) : currentUser?.role === "USER" ? ( 
                            <div>
                                <Link  href="/orders">
                                    <MenuItem onClick={toogleOpen}>Seus Pedidos</MenuItem>
                                </Link>
                                <hr />
                                <MenuItem onClick={() => { 
                                    toogleOpen(); 
                                    signOut();
                                }}>Sair</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <Link  href="/login">
                                    <MenuItem onClick={toogleOpen}>Entrar</MenuItem>
                                </Link>
                                <Link  href="/register">
                                    <MenuItem onClick={toogleOpen}>Criar conta</MenuItem>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isOpen ? <BackDrop onClick={toogleOpen} /> : null}
        </>
    );
};

export default UserMenu;