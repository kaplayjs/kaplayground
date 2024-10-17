import { Allotment } from "allotment";
import type { FC } from "react";
import { cn } from "../../util/cn";
import { Assets } from "../Assets";
import { MonacoEditor } from "../Editor/MonacoEditor";
import { FileTree } from "../FileTree";
import { Toolbar } from "../Toolbar";
import { GameView } from "./GameView";

type Props = {
    editorIsLoading: boolean;
    isPortrait: boolean;
    onMount?: () => void;
};

export const WorkspaceProject: FC<Props> = (props) => {
    return (
        <>
            <div
                className={cn("h-screen w-screen flex flex-col", {
                    "hidden": props.editorIsLoading,
                })}
            >
                <header className="h-9 flex">
                    <Toolbar />
                </header>

                <main className="h-full overflow-hidden">
                    <Allotment
                        defaultSizes={[0.5, 2, 2]}
                        vertical={props.isPortrait}
                    >
                        <Allotment.Pane snap minSize={200}>
                            <FileTree />
                        </Allotment.Pane>
                        <Allotment.Pane snap>
                            <Allotment vertical defaultSizes={[2, 1]}>
                                <Allotment.Pane>
                                    <MonacoEditor
                                        onMount={props.onMount}
                                    />
                                </Allotment.Pane>
                                <Allotment.Pane snap>
                                    <Assets />
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                        <Allotment.Pane snap>
                            <GameView />
                        </Allotment.Pane>
                    </Allotment>
                </main>
            </div>
        </>
    );
};
