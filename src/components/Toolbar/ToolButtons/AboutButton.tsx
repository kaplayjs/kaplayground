import { assets } from "@kaplayjs/crew";
import { ToolbarButton } from "../ToolbarButton";

export const AboutButton = () => {
    const handleModalOpenClick = () => {
        document.querySelector<HTMLDialogElement>("#about-dialog")
            ?.showModal();
    };

    return (
        <ToolbarButton
            onClick={handleModalOpenClick}
            icon={assets.question_mark.outlined}
            text={"About"}
            tip="About"
        />
    );
};
