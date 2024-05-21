import { StrictMode } from "react";
import Playground from "./Playground";
import "react-toastify/dist/ReactToastify.css";
import "allotment/dist/style.css";
import "@/styles/toast.css";

const PlaygroundApp = () => {
    return (
        <StrictMode>
            <Playground />
        </StrictMode>
    );
};

export default PlaygroundApp;
