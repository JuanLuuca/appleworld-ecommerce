import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { MdFacebook } from "react-icons/md";
import { AiFillInstagram } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-slate-200 text-xs mt-16">
            <Container>
                <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Categorias</h3>
                        <a  href="#">IPhone</a>
                        <a  href="#">MacBook</a>
                        <a  href="#">Apple Watch</a>
                        <a  href="#">teste</a>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Serviços</h3>
                        <a  href="#">Contato</a>
                        <a  href="#">Politica de Vendas</a>
                        <a  href="#">teste</a>
                        <a  href="#">teste</a>
                    </FooterList>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-base font-bold mb-2">Sobre Nós</h3>
                        <p className="mb-2">
                            is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting
                         </p>
                         <p>&copy; {new Date().getFullYear()} Apple World - Todos os direitos reservados.</p>
                    </div>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Redes Sociais</h3>
                        <div className="flex gap-2">
                            <a  href="">
                                <MdFacebook size={24}/>
                            </a>
                            <a  href="">
                                <AiFillInstagram size={24}/>
                            </a>
                            <a  href="">
                                <RiWhatsappFill size={24}/>
                            </a>
                        </div>
                    </FooterList>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;