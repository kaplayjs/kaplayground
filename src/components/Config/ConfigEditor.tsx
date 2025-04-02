import { ConfigCheckbox } from "./ConfigForm/ConfigCheckbox.tsx";
import { ConfigSelect } from "./ConfigForm/ConfigSelect.tsx";

export const ConfigEditor = () => {
    const handleDeleteAllData = () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold pb-4">Editor Configuration</h2>

            <ConfigCheckbox configKey="autoFormat" label="Auto Formatting" />
            <ConfigCheckbox
                configKey="funFormat"
                label="Format woah! effect"
            />

            <ConfigSelect configKey="debugLevel" label="Debug Level">
                <option value="0">Level 1</option>
                <option value="1">Level 2</option>
                <option value="2">Level 3</option>
            </ConfigSelect>

            <label className="flex justify-between w-full">
                <div className="label">
                    <span className="label-text">
                        Delete all data
                    </span>
                </div>
                <button
                    className="btn btn-warning btn-sm"
                    onClick={handleDeleteAllData}
                >
                    Delete All Data
                </button>
            </label>
        </div>
    );
};
