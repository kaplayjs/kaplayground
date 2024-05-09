import React, { type FC, forwardRef } from "react";

type Props = {
    icon: string;
    text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Ref = HTMLButtonElement;

const GenericButton = forwardRef<Ref, Props>((props, ref) => {
    return (
        <button
            className="btn btn-xs btn-primary"
            ref={ref}
            {...props}
        >
            <span className="text">{props.text}</span>
            <img src={props.icon} alt="Run" className="w-4" />
        </button>
    );
});

export default GenericButton;
