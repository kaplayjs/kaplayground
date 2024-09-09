import type { FC, PropsWithChildren } from "react";
import runIcon from "../../assets/toolbar/run.png";
import shareIcon from "../../assets/toolbar/share.png";
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
    const { getProjectMode } = useProject();
    const { run } = useEditor();

    return (
        <ul className="flex flex-row items-center justify-center h-full">
            <ToolbarToolItem>
                <ToolbarButton
                    icon={runIcon}
                    text="Run"
                    onClick={run}
                    tip="Run Project"
                    keys={["ctrl", "s"]}
                />
            </ToolbarToolItem>
            {getProjectMode() == "example" && (
                <ToolbarToolItem>
                    <ToolbarButton
                        icon={shareIcon}
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
