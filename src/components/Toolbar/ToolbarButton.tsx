import React, { forwardRef } from "react";

type Props = {
    icon: string;
    text: string;
    tooltip?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Ref = HTMLButtonElement;

const ToolbarButton = forwardRef<Ref, Props>((props, ref) => {
    return (
        <div
            className="tooltip tooltip-bottom h-full"
            {...(props.tooltip
                ? {
                    "data-tip": props.tooltip,
                }
                : {})}
        >
            <button
                className="btn btn-sm btn-ghost px-2 rounded-sm items-center justify-center h-full"
                ref={ref}
                {...props}
            >
                <img src={props.icon} alt="Run" className="h-8" />
            </button>
        </div>
    );
});

export default ToolbarButton;
