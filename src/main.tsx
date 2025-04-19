import { init } from "@neutralinojs/lib";
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
    <App />,
);

if (!import.meta.env.VITE_BROWSER) {
    init();
}
