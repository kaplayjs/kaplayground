import loadingIcon from "../../../kaplay/assets/sprites/bag.png";

const EditorLoading = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <img
                src={loadingIcon.src}
                alt="loading"
                className="animate-spin"
            />
        </div>
    );
};

export default EditorLoading;
