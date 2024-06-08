import React, { forwardRef } from "react";

type Props = {
    icon: string;
    text: string;
    tip?: string;
    keys?: string[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Ref = HTMLButtonElement;

const generateKbdFromKeys = (keys: string[]) => {
    return keys.map((key) => `<kbd class="kbd">${key}</kbd>`).join(" + ");
};

const ToolbarButton = forwardRef<Ref, Props>((props, ref) => {
    return (
        <button
            className="btn btn-sm btn-ghost px-2 rounded-sm items-center justify-center h-full"
            data-tooltip-id="global"
            data-tooltip-html={`${props.tip}</br>${
                props.keys ? generateKbdFromKeys(props.keys) : ""
            }`}
            data-tooltip-place="bottom-end"
            ref={ref}
            {...props}
        >
            <img src={props.icon} alt="Run" className="h-8" />
        </button>
    );
});

export default ToolbarButton;
