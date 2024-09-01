import type { KAPLAYOpt } from "kaplay";
import { type FC, useRef, useState } from "react";
import { useProject } from "../../hooks/useProject";

type Props = {
    label: string;
    configKey: keyof KAPLAYOpt;
    type: "text" | "number";
    placeholder: string;
    defaultValue?: string | number;
    tip?: string;
};

const ConfigInput: FC<Props> = (
    { label, configKey, type, placeholder, tip, defaultValue },
) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [setValue, setSetValue] = useState<string | number>("");
    const { kaplayConfig } = useProject((state) => state.project);

    const handleChange = () => {
        const value = inputRef.current?.value ?? "";
        const parsedValue = type === "number" ? parseInt(value, 10) : value;

        setSetValue(parsedValue);
    };

    return (
        <label
            className="form-control w-full max-w-xs"
            data-tooltip-id="config-dialog"
            data-tooltip-content={tip}
            data-tooltip-place="bottom-end"
        >
            <div className="label">
                <span className="label-text">{label}</span>
            </div>

            <input
                type={type}
                placeholder={placeholder}
                className="input input-bordered w-full max-w-xs config-input"
                ref={inputRef}
                defaultValue={kaplayConfig[
                    configKey as keyof typeof kaplayConfig
                ] ?? defaultValue}
                onChange={handleChange}
                min={0}
                data-set-value={setValue}
                data-set-key={configKey}
                data-set-type={type}
            />
        </label>
    );
};

export default ConfigInput;
