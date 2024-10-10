import { Allotment } from "allotment";
import type { FC } from "react";
import { cn } from "../../util/cn";
import { MonacoEditor } from "../Editor/MonacoEditor";
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
        <>
            <div
                className={cn("h-full w-screen", {
                    "hidden": props.editorIsLoading,
                })}
            >
                <header className="h-[4%] flex">
                    <ToolbarToolsMenu />
                </header>

                <main className="h-[92%] lg:h-[96%] overflow-hidden">
                    <Allotment
                        vertical={props.isPortrait}
                        defaultSizes={[0.5, 0.5]}
                    >
                        <Allotment.Pane snap>
                            <MonacoEditor
                                onMount={props.onMount}
                            />
                        </Allotment.Pane>
                        <Allotment.Pane snap>
                            <GameView />
                        </Allotment.Pane>
                    </Allotment>
                </main>

                {props.isPortrait && (
                    <footer className="h-[4%] flex justify-center items-center bg-base-300">
                        <ExampleList />
                    </footer>
                )}
            </div>
        </>
    );
};
