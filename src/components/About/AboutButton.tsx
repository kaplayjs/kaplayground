import aboutIcon from "../../assets/about_icon.png";

const AboutButton = () => {
    const handleModalOpenClick = () => {
        document.querySelector<HTMLDialogElement>("#my_modal_1")
            ?.showModal();
    };

    return (
        <>
            <button
                className="btn btn-xs btn-info"
                onClick={handleModalOpenClick}
            >
                <span>About</span>
                <img
                    src={aboutIcon.src}
                    alt="About's Icon"
                    className="w-4"
                />
            </button>
        </>
    );
};

export default AboutButton;
