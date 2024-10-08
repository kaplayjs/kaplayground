import Playground from "./components/Playground/Playground";
import "react-toastify/dist/ReactToastify.css";
import "allotment/dist/style.css";
import "./styles/index.css";
import "./styles/toast.css";
import "./util/hotkeys.js";

export const dynamicConfig = {
    useFile: Boolean(import.meta.env.VITE_USE_FILE),
};

export const App = () => {
    return <Playground />;
};
