import Link from "next/link";
import Container from "../Container";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Categories from "./Categories";
import SearchBar from "./SearchBar";
import Image from "next/image";

const NavBar = async () => {
    const currentUser = await getCurrentUser();

    return (
        <div className="sticky top-0 w-full bg-gradient-to-r from-zinc-50 to-zinc-100 z-30 shadow-sm">
            <div className="border-b-[1px]">
                <Container>
                    <div className="flex items-center justify-between gap-3 md:gap-0">
                        <Link href="/">
                            <Image 
                                src="/appleworld_semfundobranco.png"
                                alt="Avatar"
                                height="120"
                                width="120"
                                sizes="100%"
                            />
                        </Link>
                        <div className="hidden md:block"><SearchBar /></div>
                        <div className="flex items-center gap-8 md:gap-12">
                            <CartCount />
                            <UserMenu currentUser={currentUser}/>
                        </div>
                    </div>
                </Container>
            </div>
            <Categories />
        </div>
    );
}

export default NavBar