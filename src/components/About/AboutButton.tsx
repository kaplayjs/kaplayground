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
            >
                <span>About</span>
                <img
                    src={aboutIcon.src}
                    alt="About's Icon"
                    className="w-4"
                />
            </ToolbarButton>
        </>
    );
};

export default AboutButton;
