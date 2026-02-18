import { Allotment } from "allotment";
import type { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { MonacoEditor } from "../../features/Editor/components/MonacoEditor.tsx";
import useConsolePane from "../../hooks/useConsolePane";
import { allotmentStorage } from "../../util/allotmentStorage.ts";
import { cn } from "../../util/cn";
import { scrollbarSize } from "../../util/scrollbarSize.ts";
import { AssetBrew } from "../AssetBrew/AssetBrew.tsx";
import { ConsoleView } from "../ConsoleView/ConsoleView.tsx";
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
    const isWidescreen = useMediaQuery({ query: "(min-width: 900px)" });
    const { getAllotmentSize, setAllotmentSize } = allotmentStorage("example");

    const { scrollbarThinHeight } = scrollbarSize();
    const assetBrewHeight = 72 + scrollbarThinHeight();

    const { consoleVisible, consoleMinSize, consoleSize } = useConsolePane();

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
            <header className="h-9 flex flex-col">
                {isWidescreen ? <Toolbar /> : <ToolbarToolsMenu />}
            </header>

            <main className="h-full min-h-0 overflow-hidden">
                <Allotment
                    vertical={props.isPortrait}
                    defaultSizes={getAllotmentSize("editor")}
                    onChange={e => setAllotmentSize("editor", e)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    key={`vertical-${props.isPortrait}`}
                >
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={getAllotmentSize("brew", [
                                9999,
                                assetBrewHeight,
                            ])}
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
                                maxSize={assetBrewHeight + 1}
                                minSize={assetBrewHeight}
                                preferredSize={assetBrewHeight}
                            >
                                <AssetBrew />
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={consoleVisible
                                ? getAllotmentSize("console", [
                                    9999,
                                    consoleSize,
                                ])
                                : [9999, 0]}
                            onChange={e => setAllotmentSize("console", e)}
                            className="pr-px pb-px"
                        >
                            <Allotment.Pane>
                                <GameView />
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="pt-px"
                                snap
                                minSize={consoleMinSize}
                                preferredSize={consoleSize}
                                visible={consoleVisible}
                            >
                                <ConsoleView />
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </main>

            {!isWidescreen && (
                <footer className="h-9 flex justify-center items-center -mt-px px-1 bg-base-300 rounded-t-xl">
                    <ExampleList />
                </footer>
            )}
        </div>
    );
};
