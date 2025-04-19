import * as ContextMenu from "@radix-ui/react-context-menu";
import { type FC, useState } from "react";
import type { FileKind } from "../../../core/File/models/FileKind.ts";
import { cn } from "../../../util/cn.ts";
import "./FileFolder.css";
import { useProjectStore } from "../../Project/store/useProject.ts";

interface FileFolderProps {
    title: string;
    kind: FileKind;
    icon: string;
    folded: boolean;
    level: number;
}

const paddingLevels = [
    "pl-0",
    "pl-2.5",
    "pl-5",
    "pl-7.5",
    "pl-10",
    "pl-12.5",
];

export const FileFolder: FC<FileFolderProps> = (props) => {
    const [folded, setFolded] = useState(props.folded ?? false);
    const projectStore = useProjectStore();

    const triggerContextMenu = (x: number, y: number) => {
        const radixTrigger = document.querySelector("#radix-trigger");

        if (radixTrigger) {
            const evt = new MouseEvent("contextmenu", {
                bubbles: true,
                clientX: x,
                clientY: y,
            });

            radixTrigger.dispatchEvent(evt);
        }
    };

    return (
        <div className="mb-0">
            <ContextMenu.Root>
                <ContextMenu.Trigger id="radix-trigger">
                    <div className="file join w-full justify-between pr-0.5 h-[1.875rem] min-h-0">
                        <button
                            className="flex gap-2 join-item btn btn-sm btn-ghost flex-1 justify-start"
                            onClick={() => {
                                setFolded(!folded);
                            }}
                        >
                            <img
                                src={props.icon}
                                className="w-4"
                            />

                            <h2 className="font-bold text-xs uppercase tracking-wider select-none">
                                {props.title}
                            </h2>
                        </button>

                        <button
                            className="join-item btn btn-sm btn-ghost"
                            onClick={(e) => {
                                triggerContextMenu(e.clientX, e.clientY);
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>
                    </div>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                    <ContextMenu.Content className="rounded-btn p-1 bg-base-300 flex flex-col shadow-lg">
                        <ContextMenu.Item
                            className="pl-4 pr-6 btn btn-xs btn-ghost justify-start rounded-md outline-none"
                            onClick={() => {
                                projectStore.createFile({
                                    path: "objects/test.js",
                                    content: "console.log('test')",
                                    kind: props.kind,
                                    language: "javascript",
                                    name: "test.js",
                                });
                            }}
                        >
                            Add file
                        </ContextMenu.Item>
                        <ContextMenu.Item className="pl-4 pr-6 btn btn-xs btn-ghost justify-start rounded-md outline-none">
                            Add folder
                        </ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Portal>
            </ContextMenu.Root>

            <ul
                className={cn(
                    paddingLevels[props.level],
                    "space-y-px",
                    {
                        "mt-1 border-l border-base-content/10": props.level,
                        "hidden": folded,
                    },
                )}
            >
                list xD?
            </ul>
        </div>
    );
};
