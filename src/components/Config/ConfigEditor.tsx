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
        <>
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

            <div className="flex flex-col flex-wrap gap-2">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">
                            Debug level:
                        </span>
                    </div>
                    <select
                        id="debug-selector"
                        className="select select-bordered"
                    >
                        <option>None</option>
                        <option value="none">Level 1: Project logs</option>
                        <option value="1">Level 2: Project+ logs</option>
                        <option value="2">Level 3: Execution logs</option>
                        <option value="3">
                            Level 4: Advanced tracing logs
                        </option>
                    </select>
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">
                            Delete all data:
                        </span>
                    </div>
                    <button
                        className="btn btn-warning"
                        onClick={handleDeleteAllData}
                    >
                        Delete All Data
                    </button>
                    <label className="label">
                        <span className="label-text">
                            This will delete all saved projects, assets, and
                            configurations.
                        </span>
                    </label>
                </label>
            </div>
        </>
    );
};
