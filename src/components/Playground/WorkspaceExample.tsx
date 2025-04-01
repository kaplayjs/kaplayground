import { Allotment } from "allotment";
import type { FC } from "react";
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
    return (
        <div
            className={cn("h-full w-screen flex flex-col gap-px bg-base-50", {
                "hidden": props.editorIsLoading,
            })}
        >
            <header className="h-9 flex">
                {props.isPortrait && <ToolbarToolsMenu /> || <Toolbar />}
            </header>

            <main className="h-full overflow-hidden">
                <Allotment
                    vertical={props.isPortrait}
                    defaultSizes={[0.5, 0.5]}
                >
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={[2, 0.2]}
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
                            >
                                <AssetBrew />
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                    <Allotment.Pane snap>
                        <Allotment
                            vertical
                            defaultSizes={[1, 0.3]}
                            className="pr-px pb-px"
                        >
                            <Allotment.Pane>
                                <GameView />
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="pt-px"
                                snap
                            >
                                <ConsoleView />
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </main>

            {props.isPortrait && (
                <footer className="h-10 flex justify-center items-center bg-base-300">
                    <ExampleList />
                </footer>
            )}
        </div>
    );
};
