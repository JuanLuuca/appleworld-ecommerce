import { Container } from "@mui/material";
import FormWrap from "../components/FormWrap";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Login = async () => {
    const currentUser = await getCurrentUser();

    console.log("teste current ", currentUser);

    return (
        <Container>
            <FormWrap>
                <LoginForm currentUser={currentUser} />
            </FormWrap>
        </Container>
    );
};

export default Login;