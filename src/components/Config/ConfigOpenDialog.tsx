import { assets } from "@kaplayjs/crew";
import ToolbarButton from "../Toolbar/ToolbarButton";

const ConfigOpenDialog = () => {
    const handleModalOpenClick = () => {
        document.querySelector<HTMLDialogElement>("#config")
            ?.showModal();
    };

    return (
        <>
            <ToolbarButton
                onClick={handleModalOpenClick}
                icon={assets.config.outlined}
                text={"Config"}
                tip="Config"
            />
        </>
    );
};

export default ConfigOpenDialog;
