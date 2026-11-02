import { assets } from "@kaplayjs/crew";
import { toast } from "react-toastify";
import { exportProject } from "../../../features/Projects/services/projectActions";
import { buildProject } from "../../../features/Projects/services/projectActions";
import { useProject } from "../../../features/Projects/stores/useProject";
import { compressCode } from "../../../util/compressCode";
import { confirm } from "../../../util/confirm";
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
        const urlLimit = 4000;

        if (url.length <= urlLimit) {
            navigator.clipboard.writeText(url).then(() => {
                toast("Project shared, URL copied to clipboard!");
            });
        } else {
            confirm(
                "Too long to share!",
                <>
                    <p>
                        Code is too long to be encoded in a URL
                        (<span className="font-mono text-error">
                            {url.length}
                        </span>/<span className="font-mono text-subheadings">
                            {urlLimit}
                        </span>).
                    </p>
                    <div className="divider mt-1.5 mb-0 before:h-px after:h-px">
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-subheadings font-medium">
                            Your other options are:
                        </h3>
                        <div className="flex flex-col gap-px p-px text-sm bg-base-50 rounded-lg underline-offset-2">
                            <button
                                onClick={() =>
                                    exportProject(undefined, {
                                        toastContainerId:
                                            "confirm-dialog-toasts",
                                    })}
                                className="btn btn-sm h-auto px-3 py-3 bg-base-200 justify-start font-normal text-left rounded-lg"
                            >
                                <span className="btn-link decoration-primary/30">
                                    Export
                                </span>{" "}
                                it as a project file that can be imported back
                            </button>
                            <button
                                onClick={() =>
                                    buildProject(undefined, {
                                        toastContainerId:
                                            "confirm-dialog-toasts",
                                    })}
                                className="btn btn-sm h-auto px-3 py-3 bg-base-200 justify-start font-normal text-left rounded-lg"
                            >
                                <span className="btn-link decoration-primary/30">
                                    Build
                                </span>{" "}
                                it as a HTML file that you can upload online
                            </button>
                        </div>
                    </div>
                </>,
                {
                    type: "neutral",
                },
            );
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
