import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarMoreActionsDropdown } from "./ToolbarMoreActionsDropdown";
import { ToolbarProjectDropdown } from "./ToolbarProjectDropdown";
import { ToolbarSeparator } from "./ToolbarSeparator";
import { AboutButton } from "./ToolButtons/AboutButton";
import { ConfigButton } from "./ToolButtons/ConfigButton";
import { ShareButton } from "./ToolButtons/ShareButton";

const ToolbarToolItem: FC<PropsWithChildren> = ({ children }) => {
    return (
        <li className="flex h-full group">
            {children}
        </li>
    );
};

const ToolbarToolsMenu: FC = () => {
    const projectMode = useProject((state) => state.project.mode);
    const run = useEditor((state) => state.run);

    return (
        <ul className="flex flex-row items-center justify-center h-full w-auto bg-base-300 rounded-b-xl">
            <ToolbarToolItem>
                <ToolbarButton
                    icon={assets.play.outlined}
                    iconFirst={true}
                    text="Run"
                    onClick={run}
                    tip="Run Project"
                    keys={["ctrl", "s"]}
                    className="pr-1.5"
                />

                <ToolbarMoreActionsDropdown />
            </ToolbarToolItem>

            <ToolbarToolItem>
                <ToolbarSeparator className="hidden md:flex -mx-1 px-0" />
            </ToolbarToolItem>

            {projectMode == "ex" && (
                <ToolbarToolItem>
                    <ShareButton />
                </ToolbarToolItem>
            )}

            <ToolbarToolItem>
                <ToolbarProjectDropdown />
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
