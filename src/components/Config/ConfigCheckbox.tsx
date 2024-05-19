import { useProject } from "@/hooks/useProject";
import type { KaboomOpt } from "kaboom";
import { type FC, useState } from "react";

type Props = {
    label: string;
    configKey: keyof KaboomOpt;
    defaultValue?: boolean;
    tip?: string;
};

const ConfigCheckbox: FC<Props> = ({ configKey, label, defaultValue, tip }) => {
    const [kaboomConfig] = useProject((state) => [state.project.kaboomConfig]);
    const [setValue, setSetValue] = useState<boolean>(
        kaboomConfig[configKey] ?? defaultValue,
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
