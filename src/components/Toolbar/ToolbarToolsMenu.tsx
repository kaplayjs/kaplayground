import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
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
        const mainFile = getMainFile();
        const url = `${window.location.origin}/?code=${
            compressCode(mainFile?.value!)
        }`;
        navigator.clipboard.writeText(url);
        window.history.pushState({}, "", url);
    };

    return (
        <ul className="flex flex-row items-center justify-center h-full w-full">
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
