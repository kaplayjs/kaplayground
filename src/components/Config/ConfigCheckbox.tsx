import { useProject } from "@/hooks/useProject";
import type { KaboomOpt } from "kaboom";
import { type FC, useState } from "react";

type Props = {
    label: string;
    configKey: keyof KaboomOpt;
};

const ConfigCheckbox: FC<Props> = ({ configKey, label }) => {
    const [kaboomConfig] = useProject((state) => [state.project.kaboomConfig]);
    const [setValue, setSetValue] = useState<boolean>(kaboomConfig[configKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetValue(e.target.checked);
    };

    return (
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">{label}</span>
                <input
                    type="checkbox"
                    className="checkbox config-input"
                    onChange={handleChange}
                    defaultChecked={kaboomConfig[configKey]}
                    data-set-value={setValue}
                    data-set-key={configKey}
                    data-set-type="boolean"
                />
            </label>
        </div>
    );
};

export default ConfigCheckbox;
