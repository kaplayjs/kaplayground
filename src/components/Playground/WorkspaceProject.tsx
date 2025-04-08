import { Allotment } from "allotment";
import type { FC } from "react";
import { allotmentStorage } from "../../util/allotmentStorage";
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
    const { getAllotmentSize, setAllotmentSize } = allotmentStorage("project");

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

                <main className="h-full overflow-hidden">
                    <Allotment
                        vertical={props.isPortrait}
                        defaultSizes={getAllotmentSize("editor", [0.5, 2, 2])}
                        onChange={e => setAllotmentSize("editor", e)}
                        className="p-px pt-0"
                    >
                        <Allotment.Pane snap minSize={200} className="pr-px">
                            <FileTree />
                        </Allotment.Pane>
                        <Allotment.Pane snap>
                            <Allotment
                                vertical
                                defaultSizes={getAllotmentSize("brew", [2, 1])}
                                onChange={e => setAllotmentSize("brew", e)}
                                className="pr-px"
                            >
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
