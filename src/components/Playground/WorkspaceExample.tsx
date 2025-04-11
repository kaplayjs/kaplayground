import { Allotment } from "allotment";
import type { FC } from "react";
import { allotmentStorage } from "../../util/allotmentStorage.ts";
import { cn } from "../../util/cn";
import { AssetBrew } from "../Assets/AssetBrew.tsx";
import { ConsoleView } from "../ConsoleView/ConsoleView.tsx";
import { MonacoEditor } from "../Editor/MonacoEditor";
import { Toolbar } from "../Toolbar";
import ExampleList from "../Toolbar/ExampleList";
import ToolbarToolsMenu from "../Toolbar/ToolbarToolsMenu";
import { GameView } from "./GameView";

type Props = {
    editorIsLoading: boolean;
    isPortrait: boolean;
    onMount?: () => void;
};

export const WorkspaceExample: FC<Props> = (props) => {
    const { getAllotmentSize, setAllotmentSize } = allotmentStorage("example");

    const handleDragStart = () =>
        document.documentElement.classList.toggle("select-none", true);
    const handleDragEnd = () =>
        document.documentElement.classList.toggle("select-none", false);

    return (
        <div
            className={cn("h-full w-screen flex flex-col gap-px bg-base-50", {
                "hidden": props.editorIsLoading,
            })}
        >
            <header className="h-9 flex">
                {props.isPortrait && <ToolbarToolsMenu /> || <Toolbar />}
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
                                <MonacoEditor
                                    onMount={props.onMount}
                                />
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="pt-px"
                                snap
                                maxSize={80}
                                minSize={72}
                                preferredSize={72}
                            >
                                <AssetBrew />
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
                                preferredSize={72}
                            >
                                <ConsoleView />
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </main>

            {props.isPortrait && (
                <footer className="h-10 flex justify-center items-center -mt-px bg-base-300 rounded-t-xl">
                    <ExampleList />
                </footer>
            )}
        </div>
    );
};
