import type { DirectoryNode, FileNode } from "@webcontainer/api";
import { $fileExplorer } from "../../stores/playground";
import {
    $currentEditingFile,
    $project,
    type ProjectFile,
} from "../../stores/project";
import { parseHTML } from "../../util/parseHTML";
import FileEntry from "./FileEntry.html?raw";

export class FileExplorer extends HTMLElement {
    constructor() {
        super();

        $fileExplorer.set(this);
        this.sync();
    }

    /** Syncs file explorer UI with file exporer */
    sync() {
        Object.keys($project.get().files).forEach((name) => {
            const fileOrDir = $project.get().files[name];

            if (isFileNode(fileOrDir)) {
                const fileEntry = parseHTML(FileEntry, {
                    fileName: name,
                });

                const template = document.createElement("template");
                template.innerHTML = fileEntry;
                const div = template.content.firstChild as HTMLDivElement;

                const el = this.appendChild(div);

                // File events
                el.addEventListener("click", () => {
                    $currentEditingFile.set(name);
                });
            }
        });
    }

    /** Updates the UI of one file in the file explorer */
    syncFile(name: string) {
        const fileEl = this.querySelector(`[data-file="${name}"]`);
        const fileNameEl = fileEl?.querySelector<HTMLElement>(".file-name");
        const projectFile = $project.get().files[name] as ProjectFile;

        if (!fileNameEl) return;

        if (!projectFile.saved) {
            fileEl?.classList.add("font-bold");
            fileNameEl.innerText = name + "*";
        } else {
            fileEl?.classList.remove("font-bold");
            fileNameEl.innerText = name;
        }
    }
}

customElements.define("file-explorer", FileExplorer);

// helpers
function isFileNode(
    fileOrDir: FileNode | DirectoryNode,
): fileOrDir is FileNode {
    return "file" in fileOrDir;
}

function isDirectoryNode(
    fileOrDir: FileNode | DirectoryNode,
): fileOrDir is DirectoryNode {
    return "directory" in fileOrDir;
}
