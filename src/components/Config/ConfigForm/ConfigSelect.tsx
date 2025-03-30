import { type PropsWithChildren } from "react";
import { type Config, useConfig } from "../../../hooks/useConfig.ts";

export interface ConfigSelectProps extends PropsWithChildren {
    label: string;
    configKey: keyof Config;
}

export const ConfigSelect = (props: ConfigSelectProps) => {
    const { config } = useConfig();

    return (
        <label className="label cursor-pointer">
            <span className="label-text">{props.label}</span>

            <select
                id="debug-selector"
                className="select select-bordered"
                data-config={props.configKey}
                data-value={config[props.configKey]}
                data-select
                onChange={(e) => {
                    const value = e.target.value;
                    e.target.setAttribute("value", value);
                }}
            >
                {props.children}
            </select>
        </label>
    );
};
