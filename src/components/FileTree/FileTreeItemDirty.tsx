import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useProject } from "../../features/Projects/stores/useProject";
import { cn } from "../../util/cn";

type FileTreeItemDirtyProps = {
    folder: string;
    createFolder?: boolean;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};
type FileTreeItemDirtyRef = HTMLInputElement;

const undertaleNames: Record<string, string> = {
    sans: "nope.",
    toriel: "I think you should think of your own name, my child.",
    flowey: "I already CHOSE that name.",
    alphys: "D-don't do that.",
    asgore: "You cannot.",
    undyne: "Get your OWN name!",
    asriel: "...",
    ghosty: "Please don't.",
};

export const FileTreeItemDirty = forwardRef<
    FileTreeItemDirtyRef,
    FileTreeItemDirtyProps
>((
    { onBlur, folder, createFolder = false },
    ref: React.Ref<HTMLInputElement>,
) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const fileName = useRef<string>("");
    const [error, setError] = useState("");
    const [triedToSave, setTriedToSave] = useState(false);
    const files = useProject(s => s.project.files);

    const checkErrors = (fileName: string) => {
        const name = fileName.toLowerCase().trim();
        if (!name) return "";

        if (undertaleNames[name]) {
            return undertaleNames[name];
        }

        const file = files.has(`${folder}/${name}`);

        if (file) {
            return "File already exists";
        }

        return "";
    };

    useImperativeHandle(ref, () => {
        return internalRef.current as HTMLInputElement;
    });

    useEffect(() => {
        setTimeout(() => {
            setTriedToSave(false);
        }, 500);
    }, [triedToSave]);

    return (
        <div className="join w-full">
            <input
                ref={internalRef}
                className={cn(
                    "input input-xs join-item active:outline-none text-left truncate w-full flex-1 py-0.5 h-[1.875rem] min-h-0",
                    {
                        "animate-shake": triedToSave,
                    },
                )}
                type="text"
                autoFocus={true}
                tabIndex={0}
                data-tooltip-id="global-open"
                data-tooltip-content={error}
                data-tooltip-hidden={!error}
                data-tooltip-variant="error"
                data-tooltip-place="bottom-start"
                data-valid={error == ""}
                data-kind={createFolder ? "folder" : "file"}
                onBlur={(e) => {
                    onBlur?.(e);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();

                        if (error != "") {
                            setTriedToSave(true);
                        } else {
                            e.currentTarget.blur();
                        }
                    }
                }}
                onChange={(e) => {
                    fileName.current = e.currentTarget.value;

                    const newError = checkErrors(fileName.current);

                    if (newError != error) {
                        setError(newError);
                    }
                }}
            >
            </input>
            {!createFolder && (
                <div className="join-item py-0.5 h-[1.875rem] min-h-0 px-2 bg-base-200">
                    .js
                </div>
            )}
        </div>
    );
});
