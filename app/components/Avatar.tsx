import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";

interface AvatarProps {
    src?: string | null | undefined;
}

const Avatar = ({ src }: AvatarProps) => {
    if (src) {
        return (
            <Image 
                src={src}
                alt="Avatar"
                className="rounded-full"
                height="30"
                width="30"
                sizes="100%"
            />
        ) 
    }
    return <CiUser size={24} />
};

export default Avatar;