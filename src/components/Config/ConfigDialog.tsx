import { type Config, useConfig } from "../../hooks/useConfig";
import { useProject } from "../../hooks/useProject";
import { debug } from "../../util/logs";
import { Dialog } from "../UI/Dialog";
import { ConfigEditor } from "./ConfigEditor.tsx";
import { ConfigProject } from "./ConfigProject";

const stringToValue = (value: string) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
};

const ConfigDialog = () => {
    const { setProject } = useProject();
    const { setConfigKey } = useConfig();

    const handleSave = () => {
        const versionEl = document.querySelector<HTMLSelectElement>(
            "#version-selector",
        );

        const configElList = document.querySelectorAll("*[data-config]") ?? [];

        configElList.forEach((el) => {
            const configEl = el as HTMLSelectElement | HTMLInputElement;
            const configKey = configEl.dataset["config"] as keyof Config;
            const configValue = stringToValue(configEl.dataset["value"]!);

            setConfigKey(configKey, configValue);
        });

        if (versionEl) {
            const version = versionEl.value;

            if (version) {
                setProject({ kaplayVersion: version });
            }

            debug(0, "[config] KAPLAY.js version set to", version);
        }

        console.log(useConfig.getState().config);
    };

    return (
        <Dialog id="config" onSave={handleSave}>
            <ConfigProject />
            <div className="divider"></div>
            <ConfigEditor />
        </Dialog>
    );
};

export default ConfigDialog;
