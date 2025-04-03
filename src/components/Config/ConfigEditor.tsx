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
        <div className="flex flex-col -mx-1 [&>*]:px-1">
            <h2 className="text-2xl text-white font-bold px-1 pb-4">
                Editor Configuration
            </h2>

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

            <div className="divider my-0.5"></div>

            <label className="label flex justify-between items-start w-full">
                <span className="flex flex-col gap-1">
                    <span className="label-text font-medium">
                        Delete all data
                    </span>

                    <span className="label-text-alt">
                        This will delete all saved projects, assets, and
                        configurations
                    </span>
                </span>

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
