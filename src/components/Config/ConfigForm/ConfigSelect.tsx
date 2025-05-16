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
            <span className="label-text font-medium">{props.label}</span>

            <select
                className="select select-bordered select-sm"
                defaultValue={config[props.configKey]
                    ? String(config[props.configKey])
                    : undefined}
                data-config={props.configKey}
                data-value={config[props.configKey]}
                data-select
                onChange={(e) => {
                    const value = e.target.value;
                    e.target.setAttribute("data-value", value);
                }}
            >
                {props.children}
            </select>
        </label>
    );
};
