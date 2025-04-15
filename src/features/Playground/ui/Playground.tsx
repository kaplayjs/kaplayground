import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { PlaygroundExampleLayout } from "./PlaygroundExampleLayout.tsx";

export const Playground = () => {
    return (
        <>
            <PlaygroundExampleLayout
                editorIsLoading={false}
                isPortrait={false}
            />
            <ToastContainer position="bottom-right" transition={Slide} />
            <Tooltip id="global" />
        </>
    );
};
