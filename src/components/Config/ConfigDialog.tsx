import { useConfig } from "../../hooks/useConfig";
import { useProject } from "../../hooks/useProject";
import { debug } from "../../util/logs";
import { Dialog } from "../UI/Dialog";
import { ConfigProject } from "./ConfigProject";

const ConfigDialog = () => {
    const { setProject } = useProject();

    const handleDeleteAllData = () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    const handleSave = () => {
        const versionEl = document.querySelector<HTMLSelectElement>(
            "#version-selector",
        );

        const debugEl = document.querySelector<HTMLSelectElement>(
            "#debug-selector",
        );

        if (versionEl) {
            const version = versionEl.value;
            setProject({ kaplayVersion: version });
            debug(0, "KAPLAY.js version set to", version);
        }

        if (debugEl) {
            const debugLevel = debugEl.value;
            useConfig.getState().setConfig({
                debugLevel: debugLevel === "none" ? null : parseInt(debugLevel),
            });
            debug(0, "Debug level set to", debugLevel);
        }
    };

    return (
        <Dialog id="config" onSave={handleSave}>
            <ConfigProject />
            <div className="divider"></div>
            <h2 className="text-2xl font-bold pb-4">PG Configuration</h2>

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
        </Dialog>
    );
};

export default ConfigDialog;
