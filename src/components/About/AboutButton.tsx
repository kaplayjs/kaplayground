import aboutIcon from "@/assets/toolbar/about.png";
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
                icon={aboutIcon.src}
                text={"About"}
                tip="About"
            />
        </>
    );
};

export default AboutButton;
