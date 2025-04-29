import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import Projects from "./Projects";
import ToolbarButton from "./ToolbarButton";
import { AboutButton } from "./ToolButtons/AboutButton";
import { ConfigButton } from "./ToolButtons/ConfigButton";
import { ShareButton } from "./ToolButtons/ShareButton";

const ToolbarToolItem: FC<PropsWithChildren> = ({ children }) => {
    return (
        <li className="h-full group">
            {children}
        </li>
    );
};

const ToolbarToolsMenu: FC = () => {
    const projectMode = useProject((state) => state.project.mode);
    const run = useEditor((state) => state.run);

    return (
        <ul className="flex flex-row items-center justify-center h-full w-full md:w-fit bg-base-300 rounded-b-xl">
            <ToolbarToolItem>
                <ToolbarButton
                    icon={assets.play.outlined}
                    text="Run"
                    onClick={run}
                    tip="Run Project"
                    keys={["ctrl", "s"]}
                />
            </ToolbarToolItem>
            {projectMode == "ex" && (
                <ToolbarToolItem>
                    <ShareButton />
                </ToolbarToolItem>
            )}

            <ToolbarToolItem>
                <Projects />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <AboutButton />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <ConfigButton />
            </ToolbarToolItem>
        </ul>
    );
};

export default ToolbarToolsMenu;
