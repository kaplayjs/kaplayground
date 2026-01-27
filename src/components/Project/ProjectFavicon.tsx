import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import tween from "tweenkie";
import { defaultFavicon } from "../../features/Projects/application/defaultFavicon";
import { cn } from "../../util/cn";
import { fileToBase64 } from "../../util/fileToBase64";

type FaviconProps = {
    defaultValue?: string;
    className?: string;
};

export const ProjectFavicon = ({ defaultValue, className }: FaviconProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [filled, setFilled] = useState<boolean>(!!defaultValue);
    const [theme, setTheme] = useState<string>("dark");

    const handleFileUpload = async ([file]: File[]) => {
        if (!imgRef.current || !inputRef.current) return;

        if (!file) return;

        const img = imgRef.current;
        const input = inputRef.current;

        setFilled(true);
        input.value = await fileToBase64(file);
        animateChange(() => img.src = URL.createObjectURL(file));
    };

    const animateChange = (onEnd: () => void) => {
        if (!imgRef.current) return;

        const img = imgRef.current;

        tween([1, 0.5], v => img.style.transform = `scale(${v})`, () => {
            onEnd();
            tween(
                [0.5, 1],
                v => img.style.transform = `scale(${v})`,
                undefined,
                120,
            );
        }, 120);
    };

    const handleRemove = () => {
        setFilled(false);

        animateChange(() => {
            if (inputRef.current) inputRef.current.value = "";
            if (imgRef.current) imgRef.current.src = defaultFavicon;
        });
    };

    const handleReset = () => {
        setFilled(!!defaultValue);

        if (imgRef.current) imgRef.current.src = defaultValue || defaultFavicon;
    };

    useEffect(() => {
        const img = imgRef.current;
        const input = inputRef.current;

        setFilled(!!defaultValue);
        if (img) img.src = defaultValue || defaultFavicon;

        if (input) {
            input.value = defaultValue || "";
            input.addEventListener("reset", handleReset);

            return () => input.removeEventListener("reset", handleReset);
        }
    }, [defaultValue]);

    return (
        <div className={cn("relative", className)}>
            <Dropzone
                accept={{
                    "image/*": [],
                }}
                multiple={false}
                noClick
                onDropAccepted={handleFileUpload}
                onDropRejected={() =>
                    toast("Favicon has to be an image!", {
                        type: "error",
                        containerId: "project-preferences-toasts",
                    })}
            >
                {(
                    {
                        getRootProps,
                        getInputProps,
                        isFocused,
                        isDragAccept,
                        isDragReject,
                    },
                ) => (
                    <label
                        className={cn(
                            "flex min-h-[8.25rem] mx-auto after-border-dashed rounded-xl cursor-pointer hover:after:bg-base-content/30 focus:outline-none",
                            "before:absolute before:inset-1 before:bg-white before:rounded-lg before:opacity-0 before:transition-opacity",
                            {
                                "bg-base-200": theme == "dark",
                                "before:opacity-100": theme == "light",
                                "after:bg-base-content/50": isFocused
                                    || isDragAccept,
                                "after:bg-error": isDragReject,
                            },
                        )}
                        {...getRootProps()}
                    >
                        <span className="absolute top-1.5 left-1.5 label-text font-medium px-1.5 py-0.5 bg-base-200/90 rounded-md">
                            Favicon
                        </span>

                        <input
                            {...getInputProps()}
                            hidden
                        />

                        <img
                            ref={imgRef}
                            src={defaultValue || defaultFavicon}
                            className="w-20 h-20 object-scale-down m-auto z-10"
                            width={80}
                            height={80}
                            aria-hidden="true"
                        />
                    </label>
                )}
            </Dropzone>

            <input
                ref={inputRef}
                type="text"
                name="favicon"
                defaultValue={defaultValue || ""}
                hidden
            />

            <button
                className={cn(
                    "absolute top-1.5 right-1.5 btn btn-xs btn-ghost h-auto min-h-0 px-1 py-1 bg-base-50 hover:bg-base-highlight transition-all",
                    { "scale-0 opacity-0": !filled },
                    { "scale-1 opacity-1": filled },
                )}
                type="button"
                aria-label="Remove"
                onClick={handleRemove}
                disabled={!filled}
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
            </button>

            <ToggleGroup.Root
                className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 p-1 bg-base-200/90 rounded-md"
                type="single"
                value={theme}
                onValueChange={v => setTheme(v)}
                aria-label="Theme preview"
            >
                <svg
                    className="pl-0.5 pr-1 shrink-0 w-auto"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                </svg>

                <ToggleGroup.Item
                    className="border border-base-content/20 w-4 h-4 rounded-md bg-base-300 bg-clip-padding focus:outline-none focus-visible:ring-2 ring-base-content"
                    value="dark"
                    aria-label="Dark"
                >
                    <span
                        className={cn(
                            "block m-auto w-1 h-1 bg-white/15 rounded opacity-0 transition-opacity",
                            { "opacity-100": theme == "dark" },
                        )}
                    >
                    </span>
                </ToggleGroup.Item>

                <ToggleGroup.Item
                    className="border border-base-content/20 w-4 h-4 rounded-md bg-white bg-clip-padding focus:outline-none focus-visible:ring-2 ring-base-content"
                    value="light"
                    aria-label="Light"
                >
                    <span
                        className={cn(
                            "block m-auto w-1 h-1 bg-black/30 rounded opacity-0 transition-opacity",
                            { "opacity-100": theme == "light" },
                        )}
                    >
                    </span>
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        </div>
    );
};
