import React, { forwardRef } from "react";
import { cn } from "../../util/cn";
import normalizeKey from "../../util/normalizeKey";

type Props = {
    icon: string | "down";
    iconFirst?: boolean;
    text?: string;
    tip?: string | { text: string; keys?: string[] }[];
    keys?: string[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Ref = HTMLButtonElement;

export const generateKbdFromKeys = (keys: string[]) => {
    return `<span class="text-base-content">${
        keys.map((key) =>
            `<kbd class="kbd kbd-xs my-1.5">${normalizeKey(key)}</kbd>`
        ).join(" + ")
    }</span>`;
};

export const ToolbarButton = forwardRef<Ref, Props>(
    ({ icon, iconFirst, text, tip, keys, className, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "btn btn-xs btn-ghost px-2 rounded-sm items-center justify-center h-full group-last:rounded-br-lg",
                    className,
                )}
                data-tooltip-id="global"
                data-tooltip-html={`${tip}</br>${
                    keys ? generateKbdFromKeys(keys) : ""
                }`}
                data-tooltip-place="bottom-end"
                data-tooltip-delay-show={300}
                ref={ref}
                {...props}
            >
                {text && <span className="hidden xl:block">{text}</span>}

                {icon.startsWith("data:image")
                    ? (
                        <img
                            src={icon}
                            alt={text}
                            className={cn("h-5 w-5 object-contain", {
                                "order-first": iconFirst,
                            })}
                        />
                    )
                    : icon == "down"
                    ? (
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-0.5 text-base-content"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    )
                    : ""}
            </button>
        );
    },
);
