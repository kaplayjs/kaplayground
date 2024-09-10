import { assets } from "@kaplayjs/crew";
import ToolbarButton from "../Toolbar/ToolbarButton";

const AboutButton = () => {
    const handleModalOpenClick = () => {
        document.querySelector<HTMLDialogElement>("#my_modal_1")
            ?.showModal();
    };

    return (
        <>
            <ToolbarButton
                onClick={handleModalOpenClick}
                icon={assets.question_mark.outlined}
                text={"About"}
                tip="About"
            />
        </>
    );
};

export default AboutButton;
