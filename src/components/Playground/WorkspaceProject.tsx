import { Allotment, LayoutPriority } from "allotment";
import type { FC } from "react";
import { MonacoEditor } from "../../features/Editor/MonacoEditor.tsx";
import { allotmentStorage } from "../../util/allotmentStorage";
import { cn } from "../../util/cn";
import { Assets } from "../Assets";
import { ConsoleView } from "../ConsoleView/ConsoleView.tsx";
import { FileTree } from "../FileTree";
import { Toolbar } from "../Toolbar";
import { GameView } from "./GameView";

type Props = {
    editorIsLoading: boolean;
    isPortrait: boolean;
    onMount?: () => void;
};

export const WorkspaceProject: FC<Props> = (props) => {
    const { getAllotmentSize, setAllotmentSize } = allotmentStorage("project");

    const handleDragStart = () =>
        document.documentElement.classList.toggle("select-none", true);
    const handleDragEnd = () =>
        document.documentElement.classList.toggle("select-none", false);

    return (
        <>
            <div
                className={cn(
                    "h-screen w-screen flex flex-col gap-px bg-base-50",
                    {
                        "hidden": props.editorIsLoading,
                    },
                )}
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
                                    <MonacoEditor
                                        onMount={props.onMount}
                                    />
                                </Allotment.Pane>
                                <Allotment.Pane
                                    snap
                                    preferredSize={210}
                                    className="pt-px"
                                >
                                    <Assets />
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
                                    <GameView />
                                </Allotment.Pane>
                                <Allotment.Pane
                                    className="pt-px"
                                    snap
                                    minSize={34}
                                    preferredSize={34}
                                >
                                    <ConsoleView />
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                    </Allotment>
                </main>
            </div>
        </>
    );
};
