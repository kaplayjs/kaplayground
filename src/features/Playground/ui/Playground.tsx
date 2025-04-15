import { Slide, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { PlaygroundProjectLayout } from "./PlaygroundProjectLayout.tsx";

export const Playground = () => {
    return (
        <>
            <PlaygroundProjectLayout
                editorIsLoading={false}
                isPortrait={false}
            />
            <ToastContainer position="bottom-right" transition={Slide} />
            <Tooltip id="global" />
        </>
    );
};
