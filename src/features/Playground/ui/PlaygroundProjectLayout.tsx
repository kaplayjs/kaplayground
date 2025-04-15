import { Allotment, LayoutPriority } from "allotment";
import { type FC, useEffect } from "react";
import { useAllotmentStorage } from "../../../util/allotmentStorage.ts";
import { cn } from "../../../util/cn.ts";
import { FileTree } from "../../FileTree/ui/FileTree.tsx";
import { useProjects } from "../../Project/stores/useProjects.ts";
import { Toolbar } from "../../Toolbar/ui/Toolbar.tsx";

interface PlaygroundProjectLayoutProps {
    editorIsLoading: boolean;
    isPortrait: boolean;
    onMount?: () => void;
}

export const PlaygroundProjectLayout: FC<PlaygroundProjectLayoutProps> = (
    props,
) => {
    const projects = useProjects();
    const { getAllotmentSize, setAllotmentSize } = useAllotmentStorage(
        "example",
    );

    const handleDragStart = () =>
        document.documentElement.classList.toggle("select-none", true);
    const handleDragEnd = () =>
        document.documentElement.classList.toggle("select-none", false);

    useEffect(() => {
        projects.init();
    }, []);

    useEffect(() => {
        console.log(projects.curProject);
    }, [projects.curProject]);

    return (
        <div
            className={cn("h-full w-screen flex flex-col gap-px bg-base-50", {
                "hidden": props.editorIsLoading,
            })}
        >
            <header className="h-9 flex">
                <Toolbar />
            </header>

            <main className="h-full min-h-0 overflow-hidden">
                <Allotment
                    vertical={props.isPortrait}
                    defaultSizes={getAllotmentSize("editor", [0.5, 2, 2])}
                    onChange={e => setAllotmentSize("editor", e)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    className="p-px pt-0"
                >
                    <Allotment.Pane
                        snap
                        minSize={200}
                        preferredSize={210}
                        priority={LayoutPriority.Low}
                        className="pr-px"
                    >
                        <FileTree />
                    </Allotment.Pane>
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={getAllotmentSize("brew")}
                            onChange={e => setAllotmentSize("brew", e)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            className="pr-px"
                        >
                            <Allotment.Pane>
                                <div></div>
                            </Allotment.Pane>
                            <Allotment.Pane
                                snap
                                preferredSize={210}
                                className="pt-px"
                            >
                                <div></div>
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={getAllotmentSize("console")}
                            onChange={e => setAllotmentSize("console", e)}
                            className="pr-px pb-px"
                        >
                            <Allotment.Pane>
                                <div></div>
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="pt-px"
                                snap
                                minSize={34}
                                preferredSize={34}
                            >
                                <div></div>
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </main>

            {props.isPortrait && (
                <footer className="h-10 flex justify-center items-center -mt-px bg-base-300 rounded-t-xl">
                    <div />
                </footer>
            )}
        </div>
    );
};
