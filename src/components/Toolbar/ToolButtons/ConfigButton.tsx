import { assets } from "@kaplayjs/crew";
import ToolbarButton from "../ToolbarButton";

export const ConfigButton = () => {
    const handleModalOpenClick = () => {
        document.querySelector<HTMLDialogElement>("#config")
            ?.showModal();
    };

    return (
        <ToolbarButton
            onClick={handleModalOpenClick}
            icon={assets.config.outlined}
            text={"Config"}
            tip="Config"
        />
    );
};
