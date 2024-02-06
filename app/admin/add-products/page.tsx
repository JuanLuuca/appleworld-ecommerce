import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddProductForm from "./AddProductForm";
import NullData from "@/app/components/NullData";

const AddProducts = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser || currentUser.role !== 'ADMIN') {
        return <NullData title="Ooops! Você não tem acesso" />
    }

    return (
        <div className="p-8">
            <Container>
                <FormWrap>
                    <AddProductForm />
                </FormWrap>
            </Container>
        </div>  
    );
};

export default AddProducts;