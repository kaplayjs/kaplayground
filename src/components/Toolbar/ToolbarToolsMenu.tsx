import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import AboutButton from "../../components/About/AboutButton";
import ConfigOpenDialog from "../../components/Config/ConfigOpenDialog";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
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
    const { getProject } = useProject();
    const { run } = useEditor();

    return (
        <ul className="flex flex-row items-center justify-center h-full">
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
                        onClick={() => {
                            alert("reimplement share");
                        }}
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
