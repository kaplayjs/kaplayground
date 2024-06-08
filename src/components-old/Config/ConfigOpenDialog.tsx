import icon from "@/assets/toolbar/config.png";
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
                icon={icon.src}
                text={"Config"}
                tip="Config"
            />
        </>
    );
};

export default ConfigOpenDialog;
