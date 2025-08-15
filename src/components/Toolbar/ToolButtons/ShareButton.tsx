import { assets } from "@kaplayjs/crew";
import { toast } from "react-toastify";
import { useProject } from "../../../features/Projects/stores/useProject";
import { compressCode } from "../../../util/compressCode";
import { ToolbarButton } from "../ToolbarButton";

export const ShareButton = () => {
    const getMainFile = useProject((s) => s.getMainFile);

    const handleShare = () => {
        const demoKey = useProject.getState().demoKey;
        const kaplayVersion = useProject.getState().project.kaplayVersion;

        if (demoKey) {
            const exampleParam = encodeURIComponent(demoKey);

            const url = `${window.location.origin}/?example=${exampleParam}`;

            navigator.clipboard.writeText(url).then(() => {
                toast("Example shared, URL copied to clipboard!");
            });

            return;
        }

        const mainFile = getMainFile();
        const compressedCode = compressCode(mainFile?.value!);
        const codeParam = encodeURIComponent(compressedCode);
        const exampleVersion = encodeURIComponent(kaplayVersion);
        const url =
            `${window.location.origin}/?code=${codeParam}&version=${exampleVersion}`;

        if (url.length <= 2048) {
            navigator.clipboard.writeText(url).then(() => {
                toast("Project shared, URL copied to clipboard!");
            });
        } else {
            alert("Code too long to encode in URL");
        }
    };

    return (
        <ToolbarButton
            icon={assets.share.outlined}
            text="Share"
            onClick={handleShare}
            tip="Share Project"
        />
    );
};
