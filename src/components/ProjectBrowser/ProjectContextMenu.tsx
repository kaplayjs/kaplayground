import * as ContextMenu from "@radix-ui/react-context-menu";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import {
    confirmAndDeleteProject,
    openProjectPreferences,
    showProjectDetails,
} from "../../features/Projects/services/projectActions";
import { ProjectEntryProject } from "./ProjectEntry";

type ProjectContextMenuProps = {
    project: ProjectEntryProject;
    children: ReactNode | undefined;
};

export const ProjectContextMenu = forwardRef<
    { trigger: HTMLDivElement | null },
    ProjectContextMenuProps
>(({ children, project, ...props }, ref) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
        get trigger() {
            return triggerRef.current;
        },

        get content() {
            return contentRef.current;
        },
    }));

    const handleProjectPreferences = () => {
        openProjectPreferences(project.key);
    };

    const handleProjectDetails = () => {
        showProjectDetails(project.key);
    };

    const handleProjectDelete = async () => {
        confirmAndDeleteProject(project.key, {
            containerId: "projects-browser-toasts",
        });
    };

    return (
        <ContextMenu.Root modal={true}>
            <ContextMenu.Trigger ref={triggerRef} asChild={true}>
                {children}
            </ContextMenu.Trigger>

            <ContextMenu.Portal
                container={document.getElementById("examples-browser")}
            >
                <ContextMenu.Content
                    className="flex flex-col p-1 min-w-28 bg-base-50 border border-base-content/[4%] rounded-btn shadow-2xl animate-scale-in [transform-origin:var(--radix-context-menu-content-transform-origin)]"
                    {...props}
                    ref={contentRef}
                >
                    <ContextMenu.Label className="ml-3 mt-1.5 mb-1.5 font-semibold text-xs tracking-wider opacity-70">
                        Project
                    </ContextMenu.Label>

                    <ContextMenu.Item
                        className="btn btn-sm btn-ghost justify-start font-normal rounded-md"
                        onClick={handleProjectPreferences}
                    >
                        Preferences
                    </ContextMenu.Item>

                    <ContextMenu.Item
                        className="btn btn-sm btn-ghost justify-start font-normal rounded-md"
                        onClick={handleProjectDetails}
                    >
                        Details
                    </ContextMenu.Item>

                    <ContextMenu.Separator className="my-1 h-px bg-base-content/10" />

                    <ContextMenu.Item
                        className="btn btn-sm btn-ghost justify-start font-normal rounded-md hover:bg-error hover:text-error-content"
                        onClick={handleProjectDelete}
                    >
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
});
