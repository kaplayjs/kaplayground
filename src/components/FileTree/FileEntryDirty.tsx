import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useProject } from "../../features/Projects/stores/useProject";

type FileEntryDirtyProps = {
    folder: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};
type FileEntryDirtyRef = HTMLInputElement;

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

export const FileEntryDirty = forwardRef<
    FileEntryDirtyRef,
    FileEntryDirtyProps
>((
    { onBlur, folder },
    ref: React.Ref<HTMLInputElement>,
) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const fileName = useRef<string>("");
    const [error, setError] = useState("");
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

    return (
        <div className="join w-full">
            <input
                ref={internalRef}
                className="input input-xs join-item active:outline-none text-left truncate w-full flex-1 py-0.5 h-[1.875rem] min-h-0"
                type="text"
                autoFocus={true}
                tabIndex={0}
                data-tooltip-id="global-open"
                data-tooltip-content={error}
                data-tooltip-hidden={!error}
                data-tooltip-variant="error"
                data-tooltip-place="bottom-start"
                data-valid={error == ""}
                onBlur={(e) => {
                    onBlur?.(e);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
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
            <div className="join-item py-0.5 h-[1.875rem] min-h-0 px-2 bg-base-200">
                .js
            </div>
        </div>
    );
});
