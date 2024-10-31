import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import { toast } from "react-toastify";
import AboutButton from "../../components/About/AboutButton";
import ConfigOpenDialog from "../../components/Config/ConfigOpenDialog";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { compressCode } from "../../util/compressCode";
import Projects from "./Projects";
import ThemeToggler from "./ThemeToggler";
import ToolbarButton from "./ToolbarButton";

const ToolbarToolItem: FC<PropsWithChildren> = ({ children }) => {
    return (
        <li className="h-full">
            {children}
        </li>
    );
};

const ToolbarToolsMenu: FC = () => {
    const { getProject, getMainFile } = useProject();
    const { run } = useEditor();

    const handleShare = () => {
        const isDefault = getProject().isDefault;

        if (isDefault) {
            const exampleParam = encodeURIComponent(getProject().id);
            const url = `${window.location.origin}/?example=${exampleParam}`;

            navigator.clipboard.writeText(url).then(() => {
                toast("Example shared, URL copied to clipboard!");
            });

            return;
        }

        const mainFile = getMainFile();
        const compressedCode = compressCode(mainFile?.value!);
        const codeParam = encodeURIComponent(compressedCode);
        const url = `${window.location.origin}/?code=${codeParam}`;

        if (url.length <= 2048) {
            navigator.clipboard.writeText(url).then(() => {
                toast("Project shared, URL copied to clipboard!");
            });
        } else {
            alert("Code too long to encode in URL");
        }
    };

    return (
        <ul className="flex flex-row items-center justify-center h-full w-full lg:w-fit">
            <ToolbarToolItem>
                <ToolbarButton
                    icon={assets.play.outlined}
                    text="Run"
                    onClick={run}
                    tip="Run Project"
                    keys={["ctrl", "s"]}
                />
            </ToolbarToolItem>
            {getProject().mode == "ex" && (
                <ToolbarToolItem>
                    <ToolbarButton
                        icon={assets.bag.outlined}
                        text="Share"
                        onClick={handleShare}
                        tip="Share Project"
                    />
                </ToolbarToolItem>
            )}

            <ToolbarToolItem>
                <ThemeToggler />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <Projects />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <AboutButton />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <ConfigOpenDialog />
            </ToolbarToolItem>
        </ul>
    );
};

export default ToolbarToolsMenu;
