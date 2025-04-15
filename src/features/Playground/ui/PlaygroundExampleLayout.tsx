import { Allotment } from "allotment";
import { type FC, useEffect } from "react";
import { useAllotmentStorage } from "../../../util/allotmentStorage.ts";
import { cn } from "../../../util/cn.ts";
import { scrollbarSize } from "../../../util/scrollbarSize.ts";
import { useProjects } from "../../Project/stores/useProjects.ts";
import { Toolbar } from "../../Toolbar/ui/Toolbar.tsx";

interface PlaygroundExampleLayout {
    editorIsLoading: boolean;
    isPortrait: boolean;
    onMount?: () => void;
}

export const PlaygroundExampleLayout: FC<PlaygroundExampleLayout> = (props) => {
    const projects = useProjects();
    const { getAllotmentSize, setAllotmentSize } = useAllotmentStorage(
        "example",
    );

    const { scrollbarThinHeight } = scrollbarSize();
    const assetBrewHeight = 72 + scrollbarThinHeight();

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
                    defaultSizes={getAllotmentSize("editor")}
                    onChange={e => setAllotmentSize("editor", e)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={getAllotmentSize("brew")}
                            onChange={e => setAllotmentSize("brew", e)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            className="p-px pt-0"
                        >
                            <Allotment.Pane>
                                <div></div>
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="pt-px"
                                snap
                                maxSize={assetBrewHeight + 1}
                                minSize={assetBrewHeight}
                                preferredSize={assetBrewHeight}
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
