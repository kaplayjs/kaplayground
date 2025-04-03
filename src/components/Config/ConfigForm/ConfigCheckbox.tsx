import { type Config, useConfig } from "../../../hooks/useConfig.ts";

type OnlyBooleans<T> = {
    [K in keyof T as T[K] extends boolean ? K : never]: T[K];
};

export interface ConfigCheckboxProps {
    label: string;
    configKey: keyof OnlyBooleans<Config>;
}

export const ConfigCheckbox = (props: ConfigCheckboxProps) => {
    const { config } = useConfig();
    const defaultChecked = config[props.configKey];

    return (
        <label className="label cursor-pointer">
            <span className="label-text font-medium">{props.label}</span>

            <input
                type="checkbox"
                className="checkbox checkbox-primary"
                defaultChecked={defaultChecked}
                data-config={props.configKey}
                data-checkbox
                data-value={String(config[props.configKey])}
                onChange={(e) => {
                    const value = e.target.checked;
                    e.target.setAttribute("data-value", String(value));
                }}
            />
        </label>
    );
};
