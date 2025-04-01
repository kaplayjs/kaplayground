import React, { forwardRef } from "react";

type Props = {
    icon: string;
    text: string;
    tip?: string;
    keys?: string[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Ref = HTMLButtonElement;

const generateKbdFromKeys = (keys: string[]) => {
    return keys.map((key) => `<kbd class="kbd kbd-sm my-1.5">${key}</kbd>`).join(" + ");
};

const ToolbarButton = forwardRef<Ref, Props>((props, ref) => {
    return (
        <button
            className="btn btn-xs btn-ghost px-2 rounded-sm items-center justify-center h-full group-last:rounded-br-lg"
            data-tooltip-id="global"
            data-tooltip-html={`${props.tip}</br>${
                props.keys ? generateKbdFromKeys(props.keys) : ""
            }`}
            data-tooltip-place="bottom-end"
            ref={ref}
            {...props}
        >
            <span className="hidden xl:block">{props.text}</span>
            <img src={props.icon} alt={props.text} className="h-5 w-5 object-contain" />
        </button>
    );
});

export default ToolbarButton;
