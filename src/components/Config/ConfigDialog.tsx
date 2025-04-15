import { type Config, useConfig } from "../../hooks/useConfig";
import { stringToValue } from "../../util/stringToValue.ts";
import { Dialog } from "../UI/Dialog";
import { ConfigEditor } from "./ConfigEditor.tsx";

// Handle the change of options in the Configuration dialog
const ConfigDialog = () => {
    const { setConfigKey } = useConfig();

    const handleSave = () => {
        const configElList = document.querySelectorAll("*[data-config]") ?? [];

        // Reproduce saved options in configuration state
        configElList.forEach((el) => {
            const configEl = el as HTMLSelectElement | HTMLInputElement;
            const configKey = configEl.dataset["config"] as keyof Config;
            const configValue = stringToValue(configEl.dataset["value"]!);

            setConfigKey(configKey, configValue);
        });
    };

    return (
        <Dialog id="config" onSave={handleSave}>
            <ConfigEditor />
        </Dialog>
    );
};

export default ConfigDialog;
