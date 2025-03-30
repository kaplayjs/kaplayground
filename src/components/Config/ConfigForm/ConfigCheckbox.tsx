import { type Config, useConfig } from "../../../hooks/useConfig.ts";

export interface ConfigCheckboxProps {
    label: string;
    configKey: keyof Config;
}

// TODO: FIX THIS
export const ConfigCheckbox = (props: ConfigCheckboxProps) => {
    const { config } = useConfig();

    return (
        <label className="label cursor-pointer">
            <span className="label-text">{props.label}</span>

            <input
                type="checkbox"
                className="checkbox checkbox-primary"
                defaultChecked={String(config[props.configKey]) == "true"
                    ? true
                    : false}
                data-config={props.configKey}
                data-checkbox
                data-value={String(config[props.configKey])}
                onChange={(e) => {
                    const value = e.target.value == "on" ? "true" : "false";
                    e.target.setAttribute("value", value);
                }}
            />
        </label>
    );
};
