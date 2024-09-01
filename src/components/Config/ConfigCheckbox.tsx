import type { KAPLAYOpt } from "kaplay";
import { type FC, useState } from "react";
import { useProject } from "../../hooks/useProject";

type Props = {
    label: string;
    configKey: keyof KAPLAYOpt;
    defaultValue?: boolean;
    tip?: string;
};

const ConfigCheckbox: FC<Props> = ({ configKey, label, defaultValue, tip }) => {
    const { kaplayConfig } = useProject((state) => state.project);
    const [setValue, setSetValue] = useState<boolean>(
        kaplayConfig[configKey] ?? defaultValue,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetValue(e.target.checked);
    };

    return (
        <div className="form-control">
            <label
                className="label cursor-pointer"
                data-tooltip-id="config-dialog"
                data-tooltip-content={tip}
                data-tooltip-place="bottom"
            >
                <span className="label-text">{label}</span>

                <input
                    type="checkbox"
                    className="checkbox config-input"
                    onChange={handleChange}
                    defaultChecked={setValue}
                    data-set-value={setValue}
                    data-set-key={configKey}
                    data-set-type="boolean"
                />
            </label>
        </div>
    );
};

export default ConfigCheckbox;
