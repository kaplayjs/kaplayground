import { assets } from "@kaplayjs/crew";
import type { FC } from "react";
import { useProject } from "../../hooks/useProject";
import type { ProjectMode } from "../../stores/project";
import { View } from "../UI/View";

type Props = {
    mode: ProjectMode;
};

export const ProjectCreate: FC<Props> = ({ mode }) => {
    const { createNewProject } = useProject();

    const handleClick = () => {
        const dialog = document.querySelector<HTMLDialogElement>(
            "#examples-browser",
        );

        dialog?.close();

        if (mode === "pj") {
            createNewProject("pj");
        } else {
            createNewProject("ex");
        }
    };

    return (
        <View
            el="article"
            justify="center"
            gap={2}
            rounded="lg"
            cursor="pointer"
            className="border-4 border-dashed border-base-200 cursor-pointer min-h-20 items-center"
            onClick={handleClick}
        >
            <div className="flex flex-col items-center gap-2">
                <img
                    src={assets.plus.outlined}
                    alt="Create Project"
                    className="h-6"
                />
                <p className="text-lg">
                    Create {mode === "pj" ? "Project" : "Example"}
                </p>
            </div>
        </View>
    );
};
