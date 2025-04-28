import Playground from "./components/Playground/Playground";
import "react-toastify/dist/ReactToastify.css";
import "allotment/dist/style.css";
import "./styles/index.css";
import "./styles/toast.css";
import "@fontsource-variable/outfit";
import "@fontsource/dm-mono";
import { Route, Routes } from "react-router-dom";

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Playground />} />
            {/* <Route path="/demo/:demoName" element={<Playground />} /> */}
        </Routes>
    );
};
